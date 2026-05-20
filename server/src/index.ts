import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  AdminRole,
  UserType,
  createCustomer,
  ensureAdminUser,
  getRefreshRecord,
  getUserByEmail,
  getUserById,
  revokeRefreshToken,
  signAccessToken,
  signRefreshToken,
  validatePassword,
  verifyAccessToken,
  verifyRefreshToken,
} from './auth.js';
import { ensureConnection, query } from './db.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const apiOrigin = process.env.API_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: apiOrigin, credentials: false }));
app.use(express.json());

type AuthedRequest = express.Request & {
  auth?: { userId: string; type: UserType; role?: AdminRole };
};

type AsyncHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void | express.Response>;

type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

type ProductLookupRow = {
  id: string;
  name: string;
  price: string;
  status: string;
  stock: number;
};

async function ensureSchema() {
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5`);
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INT NOT NULL DEFAULT 0`);
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asyncHandler(handler: AsyncHandler): express.RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function normalizeCheckoutItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const merged = new Map<string, number>();

  for (const item of value) {
    if (!item || typeof item !== 'object') {
      return null;
    }

    const { productId, quantity } = item as Partial<CheckoutItemInput>;
    if (
      typeof productId !== 'string' ||
      !uuidPattern.test(productId) ||
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return null;
    }

    merged.set(productId, (merged.get(productId) ?? 0) + quantity);
  }

  return Array.from(merged.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function requireAuth(req: AuthedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token.' });
  }
  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = verifyAccessToken(token);
    if (!payload.sub || !payload.type) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.auth = {
      userId: String(payload.sub),
      type: payload.type as UserType,
      role: payload.role as AdminRole | undefined,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

function requireUserType(type: UserType) {
  return (req: AuthedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.auth || req.auth.type !== type) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    return next();
  };
}

function requireAdminRole(roles: AdminRole[]) {
  return (req: AuthedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.auth || req.auth.type !== 'admin') {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    if (!req.auth.role || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    return next();
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' });
  }

  const user = await getUserByEmail(email);
  if (!user || user.type !== 'admin') {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const valid = await validatePassword(user, password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  });
}));

app.post('/auth/customer/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' });
  }

  const user = await getUserByEmail(email);
  if (!user || user.type !== 'customer') {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const valid = await validatePassword(user, password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
  });
}));

app.post('/auth/customer/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password required.' });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  const user = await createCustomer(email, password, name);
  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  res.status(201).json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
  });
}));

app.post('/auth/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload.jti || !payload.sub || !payload.type) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const record = await getRefreshRecord(payload.jti);
    if (!record || record.revoked_at) {
      return res.status(401).json({ message: 'Refresh token revoked.' });
    }

    await revokeRefreshToken(payload.jti);
    const user = await getUserById(String(payload.sub));
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const accessToken = signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);
    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user:
        user.type === 'admin'
          ? { id: user.id, email: user.email, role: user.role }
          : { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }
}));

app.post('/auth/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.jti) {
      await revokeRefreshToken(payload.jti);
    }
  } catch {
    // ignore invalid token
  }
  res.json({ ok: true });
}));

app.get('/auth/me', requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const user = await getUserById(req.auth!.userId);
  if (!user) return res.status(401).json({ message: 'User not found.' });
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    type: user.type,
    name: user.name,
  });
}));

// Admin: Products
app.get(
  '/admin/products',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (_req, res) => {
    const result = await query(
      `SELECT id, name, price, cost, stock, category, image, status, rating, reviews_count AS reviews, sales, created_at
       FROM products ORDER BY created_at DESC`
    );
    res.json(result.rows);
  })
);

app.post(
  '/admin/products',
  requireAuth,
  requireAdminRole(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    const { name, price, cost, stock, category, image, status, rating, reviews } = req.body ?? {};
    if (!name || price == null || !category || !image || !status) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const result = await query(
      `INSERT INTO products (name, price, cost, stock, category, image, status, rating, reviews_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, price, cost, stock, category, image, status, rating, reviews_count AS reviews, sales, created_at`,
      [name, price, cost ?? 0, stock ?? 0, category, image, status, rating ?? 4.5, reviews ?? 0]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  '/admin/products/:id',
  requireAuth,
  requireAdminRole(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, cost, stock, category, image, status, rating, reviews } = req.body ?? {};
    const result = await query(
      `UPDATE products
       SET name = COALESCE($2, name),
           price = COALESCE($3, price),
           cost = COALESCE($4, cost),
           stock = COALESCE($5, stock),
           category = COALESCE($6, category),
           image = COALESCE($7, image),
           status = COALESCE($8, status),
           rating = COALESCE($9, rating),
           reviews_count = COALESCE($10, reviews_count)
       WHERE id = $1
       RETURNING id, name, price, cost, stock, category, image, status, rating, reviews_count AS reviews, sales, created_at`,
      [id, name, price, cost, stock, category, image, status, rating, reviews]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(result.rows[0]);
  })
);

app.delete(
  '/admin/products/:id',
  requireAuth,
  requireAdminRole(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await query(`DELETE FROM products WHERE id = $1 RETURNING id`, [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ ok: true });
  })
);

// Admin: Blogs
app.get(
  '/admin/blogs',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (_req, res) => {
    const result = await query(
      `SELECT id, title, excerpt, content, image, category, published, created_at
       FROM blogs ORDER BY created_at DESC`
    );
    res.json(result.rows);
  })
);

app.post(
  '/admin/blogs',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (req, res) => {
    const { title, excerpt, content, image, category, published } = req.body ?? {};
    if (!title || !excerpt || !content || !image || !category) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const result = await query(
      `INSERT INTO blogs (title, excerpt, content, image, category, published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, excerpt, content, image, category, published, created_at`,
      [title, excerpt, content, image, category, published ?? true]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  '/admin/blogs/:id',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content, image, category, published } = req.body ?? {};
    const result = await query(
      `UPDATE blogs
       SET title = COALESCE($2, title),
           excerpt = COALESCE($3, excerpt),
           content = COALESCE($4, content),
           image = COALESCE($5, image),
           category = COALESCE($6, category),
           published = COALESCE($7, published)
       WHERE id = $1
       RETURNING id, title, excerpt, content, image, category, published, created_at`,
      [id, title, excerpt, content, image, category, published]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    res.json(result.rows[0]);
  })
);

app.delete(
  '/admin/blogs/:id',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await query(`DELETE FROM blogs WHERE id = $1 RETURNING id`, [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    res.json({ ok: true });
  })
);

// Admin: Reviews
app.get(
  '/admin/reviews',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (_req, res) => {
    const result = await query(
      `SELECT id, name, rating, text, avatar, published, created_at
       FROM reviews ORDER BY created_at DESC`
    );
    res.json(result.rows);
  })
);

app.post(
  '/admin/reviews',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (req, res) => {
    const { name, rating, text, avatar, published } = req.body ?? {};
    if (!name || !rating || !text) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const result = await query(
      `INSERT INTO reviews (name, rating, text, avatar, published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, rating, text, avatar, published, created_at`,
      [name, rating, text, avatar ?? null, published ?? true]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  '/admin/reviews/:id',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, rating, text, avatar, published } = req.body ?? {};
    const result = await query(
      `UPDATE reviews
       SET name = COALESCE($2, name),
           rating = COALESCE($3, rating),
           text = COALESCE($4, text),
           avatar = COALESCE($5, avatar),
           published = COALESCE($6, published)
       WHERE id = $1
       RETURNING id, name, rating, text, avatar, published, created_at`,
      [id, name, rating, text, avatar, published]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.json(result.rows[0]);
  })
);

app.delete(
  '/admin/reviews/:id',
  requireAuth,
  requireAdminRole(['admin', 'manager', 'staff']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await query(`DELETE FROM reviews WHERE id = $1 RETURNING id`, [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.json({ ok: true });
  })
);

// Admin: Orders + Customers (view only for manager; admin full)
app.get(
  '/admin/orders',
  requireAuth,
  requireAdminRole(['admin', 'manager']),
  asyncHandler(async (_req, res) => {
    const result = await query(
      `SELECT id, customer_id, status, payment_status, total, shipping_address, items, created_at, updated_at
       FROM orders ORDER BY created_at DESC`
    );
    res.json(result.rows);
  })
);

app.patch(
  '/admin/orders/:id/status',
  requireAuth,
  requireAdminRole(['admin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body ?? {};
    const result = await query(
      `UPDATE orders
       SET status = COALESCE($2, status),
           payment_status = COALESCE($3, payment_status),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, customer_id, status, payment_status, total, shipping_address, items, created_at, updated_at`,
      [id, status, paymentStatus]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(result.rows[0]);
  })
);

app.get(
  '/admin/customers',
  requireAuth,
  requireAdminRole(['admin', 'manager']),
  asyncHandler(async (_req, res) => {
    const result = await query(
      `SELECT id, email, name, created_at
       FROM users WHERE type = 'customer' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  })
);

// Public data for storefront
app.get('/products', asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT id, name, price, image, category, rating, reviews_count AS reviews
     FROM products
     WHERE status = 'active'
     ORDER BY created_at DESC`
  );
  res.json(result.rows);
}));

app.get('/blogs', asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT id, title, excerpt, image, category, created_at
     FROM blogs WHERE published = true ORDER BY created_at DESC`
  );
  res.json(result.rows);
}));

app.get('/blogs/:id', asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, title, excerpt, content, image, category, created_at
     FROM blogs
     WHERE id = $1 AND published = true`,
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  res.json(result.rows[0]);
}));

app.get('/reviews', asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT id, name, rating, text, avatar
     FROM reviews WHERE published = true ORDER BY created_at DESC`
  );
  res.json(result.rows);
}));

app.post(
  '/orders/checkout',
  requireAuth,
  requireUserType('customer'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { shippingAddress, items } = req.body ?? {};
    const normalizedItems = normalizeCheckoutItems(items);

    if (typeof shippingAddress !== 'string' || shippingAddress.trim().length < 10 || !normalizedItems) {
      return res.status(400).json({ message: 'Valid shipping address and cart items are required.' });
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const productResult = await query<ProductLookupRow>(
      `SELECT id, name, price::text, status, stock
       FROM products
       WHERE id = ANY($1::uuid[])`,
      [productIds]
    );

    if (productResult.rows.length !== productIds.length) {
      return res.status(400).json({ message: 'One or more cart items are no longer available.' });
    }

    const productsById = new Map(productResult.rows.map((product) => [product.id, product]));
    const unavailableItem = normalizedItems.find((item) => {
      const product = productsById.get(item.productId);
      return !product || product.status !== 'active' || product.stock < item.quantity;
    });
    if (unavailableItem) {
      return res.status(400).json({ message: 'One or more cart items are unavailable for checkout.' });
    }

    const orderItems = normalizedItems.map((item) => {
      const product = productsById.get(item.productId)!;
      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: Number(product.price),
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = await query(
      `INSERT INTO orders (customer_id, status, payment_status, total, shipping_address, items)
       VALUES ($1, 'pending', 'pending', $2, $3, $4::jsonb)
       RETURNING id, customer_id, status, payment_status, total, shipping_address, items, created_at, updated_at`,
      [req.auth!.userId, total.toFixed(2), shippingAddress.trim(), JSON.stringify(orderItems)]
    );

    for (const item of orderItems) {
      await query(
        `UPDATE products
         SET stock = stock - $2,
             sales = sales + $2,
             status = CASE
               WHEN stock - $2 <= 0 THEN 'out_of_stock'
               WHEN stock - $2 <= 10 THEN 'low_stock'
               ELSE 'active'
             END
         WHERE id = $1`,
        [item.productId, item.quantity]
      );
    }

    res.status(201).json(result.rows[0]);
  })
);

// Customer profile + orders
app.get('/me', requireAuth, requireUserType('customer'), asyncHandler(async (req: AuthedRequest, res) => {
  const user = await getUserById(req.auth!.userId);
  if (!user) return res.status(401).json({ message: 'User not found.' });
  res.json({ id: user.id, email: user.email, name: user.name });
}));

app.get('/me/orders', requireAuth, requireUserType('customer'), asyncHandler(async (req: AuthedRequest, res) => {
  const result = await query(
    `SELECT id, status, payment_status, total, shipping_address, items, created_at, updated_at
     FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`,
    [req.auth!.userId]
  );
  res.json(result.rows);
}));

async function seedAdminUsers() {
  if (process.env.ENABLE_ADMIN_BOOTSTRAP !== 'true') {
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const managerEmail = process.env.MANAGER_EMAIL;
  const managerPassword = process.env.MANAGER_PASSWORD;
  const staffEmail = process.env.STAFF_EMAIL;
  const staffPassword = process.env.STAFF_PASSWORD;

  if (
    !adminEmail ||
    !adminPassword ||
    !managerEmail ||
    !managerPassword ||
    !staffEmail ||
    !staffPassword
  ) {
    throw new Error(
      'ENABLE_ADMIN_BOOTSTRAP=true requires ADMIN_EMAIL, ADMIN_PASSWORD, MANAGER_EMAIL, MANAGER_PASSWORD, STAFF_EMAIL, and STAFF_PASSWORD.'
    );
  }

  await ensureAdminUser(adminEmail, adminPassword, 'admin');
  await ensureAdminUser(managerEmail, managerPassword, 'manager');
  await ensureAdminUser(staffEmail, staffPassword, 'staff');
}

async function start() {
  await ensureConnection();
  await ensureSchema();
  await seedAdminUsers();
  app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled request error', err);
  res.status(500).json({ message: 'Internal server error.' });
});
