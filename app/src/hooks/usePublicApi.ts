import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export function usePublicApi<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}${path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (mounted) setData(json as T);
      })
      .catch(() => null);
    return () => {
      mounted = false;
    };
  }, [path]);

  return data;
}
