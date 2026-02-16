import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const REFRESH_TOKEN_KEY = 'customer_refresh_token';

export interface CustomerUser {
  id: string;
  email: string;
  name: string | null;
}

interface CustomerAuthContextValue {
  user: CustomerUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined);

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const message = await res.json().catch(() => ({}));
    const error = new Error(message?.message || 'Request failed.');
    throw error;
  }
  return res.json() as Promise<T>;
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const refreshInFlight = useRef<Promise<void> | null>(null);

  const setAccessTokenSafe = (token: string | null) => {
    accessTokenRef.current = token;
    setAccessToken(token);
  };

  const storeRefreshToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  const refreshSession = useCallback(async () => {
    if (refreshInFlight.current) {
      await refreshInFlight.current;
      return;
    }

    refreshInFlight.current = (async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await requestJson<{
          accessToken: string;
          refreshToken: string;
          user: CustomerUser;
        }>(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        setAccessTokenSafe(data.accessToken);
        setUser(data.user);
        storeRefreshToken(data.refreshToken);
      } catch {
        setAccessTokenSafe(null);
        setUser(null);
        storeRefreshToken(null);
      } finally {
        setIsLoading(false);
      }
    })();

    try {
      await refreshInFlight.current;
    } finally {
      refreshInFlight.current = null;
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await requestJson<{
      accessToken: string;
      refreshToken: string;
      user: CustomerUser;
    }>(`${API_URL}/auth/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setAccessTokenSafe(data.accessToken);
    setUser(data.user);
    storeRefreshToken(data.refreshToken);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await requestJson<{
      accessToken: string;
      refreshToken: string;
      user: CustomerUser;
    }>(`${API_URL}/auth/customer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    setAccessTokenSafe(data.accessToken);
    setUser(data.user);
    storeRefreshToken(data.refreshToken);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      await requestJson(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => null);
    }
    setAccessTokenSafe(null);
    setUser(null);
    storeRefreshToken(null);
  }, []);

  const authFetch = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const attempt = async (token: string | null) => {
        const headers = new Headers(init?.headers);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return fetch(input, { ...init, headers });
      };

      let response = await attempt(accessToken);
      if (response.status !== 401) {
        return response;
      }

      await refreshSession();
      response = await attempt(accessTokenRef.current);
      return response;
    },
    [accessToken, refreshSession]
  );

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, authFetch }),
    [user, isLoading, login, register, logout, authFetch]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
