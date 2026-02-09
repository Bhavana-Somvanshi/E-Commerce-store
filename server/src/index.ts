import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  ensureAdminUser,
  getUserByEmail,
  getUserById,
  revokeRefreshToken,
  signAccessToken,
  signRefreshToken,
  validatePassword,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshRecord,
} from './auth.js';
import { initDb } from './db.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const apiOrigin = process.env.API_ORIGIN || 'http://localhost:5173';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors({ origin: apiOrigin, credentials: false }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' });
  }

  const user = getUserByEmail(email);
  if (!user) {
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
});

app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== 'refresh' || !payload.jti || !payload.sub) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const record = getRefreshRecord(payload.jti);
    if (!record || record.revokedAt) {
      return res.status(401).json({ message: 'Refresh token revoked.' });
    }

    await revokeRefreshToken(payload.jti);
    const user = getUserById(String(payload.sub));
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const accessToken = signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);
    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }
});

app.post('/auth/logout', async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type === 'refresh' && payload.jti) {
      await revokeRefreshToken(payload.jti);
    }
  } catch {
    // ignore invalid token
  }
  res.json({ ok: true });
});

app.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token.' });
  }
  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access' || !payload.sub) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    const user = getUserById(String(payload.sub));
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    return res.json({ id: user.id, email: user.email, role: user.role });
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
});

async function start() {
  await initDb();
  await ensureAdminUser(adminEmail, adminPassword);
  app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
