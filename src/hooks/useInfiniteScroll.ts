
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps<T> {
  fetchFunction: (params: { page: number, limit: number }) => Promise<T[]>;
  initialPage?: number;
  limit?: number;
}

export function useInfiniteScroll<T>({
  fetchFunction,
  initialPage = 1,
  limit = 10,
}: UseInfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newItems = await fetchFunction({ page, limit });
      if (newItems.length > 0) {
        setItems(prevItems => [...prevItems, ...newItems]);
        setPage(prevPage => prevPage + 1);
      }
      setHasMore(newItems.length === limit);
    } catch (error) {
      console.error("Failed to fetch more items", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, page, limit, isLoading, hasMore]);

  const lastItemRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);
  
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMore();
  }, []); // Initial load

  return { items, lastItemRef, hasMore, isLoading, reset };
}
