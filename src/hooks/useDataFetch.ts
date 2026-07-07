"use client";

import { useState, useEffect, useRef } from 'react';

// In-memory deduplication & caching layer for client data fetching
const cache = new Map<string, any>();
const inFlightRequests = new Map<string, Promise<any>>();

interface UseDataFetchOptions<T> {
  enabled?: boolean;
  initialData?: T;
  revalidate?: boolean;
}

export function useDataFetch<T = any>(url: string | null, options: UseDataFetchOptions<T> = {}) {
  const { enabled = true, initialData, revalidate = false } = options;
  
  const [data, setData] = useState<T | undefined>(() => {
    if (url && cache.has(url)) return cache.get(url);
    return initialData;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => !url || (!cache.has(url) && enabled));
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the active URL to prevent race conditions
  const activeUrlRef = useRef<string | null>(url);
  activeUrlRef.current = url;

  useEffect(() => {
    if (!url || !enabled) {
      setIsLoading(false);
      return;
    }

    // If already cached and not forcing revalidation, use cached data immediately
    if (cache.has(url) && !revalidate) {
      setData(cache.get(url));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        let promise = inFlightRequests.get(url);
        if (!promise) {
          promise = fetch(url, { signal: controller.signal }).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json = await res.json();
            cache.set(url, json);
            return json;
          });
          inFlightRequests.set(url, promise);
        }

        const result = await promise;
        inFlightRequests.delete(url);

        // Prevent race conditions: only update state if this is still the active request
        if (activeUrlRef.current === url && !controller.signal.aborted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err: any) {
        inFlightRequests.delete(url);
        if (err.name !== 'AbortError' && activeUrlRef.current === url && !controller.signal.aborted) {
          console.error(`Data fetching error for ${url}:`, err);
          setError(err);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: abort in-flight request on unmount or URL change to prevent leaks
    return () => {
      controller.abort();
    };
  }, [url, enabled, revalidate]);

  return { data, isLoading, error, setData };
}
