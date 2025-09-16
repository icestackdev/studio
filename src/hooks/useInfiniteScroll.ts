
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
  const isFetching = useRef(false);
  const isInitialLoad = useRef(true);

  const loadMore = useCallback(async (isInitial = false) => {
    if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const newItems = await fetchFunction({ page, limit });
      setItems(prevItems => isInitial ? newItems : [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
      setHasMore(newItems.length === limit);
    } catch (error) {
      console.error("Failed to fetch more items", error);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
      if (isInitial) {
        isInitialLoad.current = false;
      }
    }
  }, [fetchFunction, page, limit, hasMore]);

  const lastItemRef = useCallback(node => {
    if (isFetching.current) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isInitialLoad.current) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore, loadMore]);
  
  const reset = useCallback(() => {
    isInitialLoad.current = true;
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setIsLoading(false);
    isFetching.current = false;
    loadMore(true);
  }, [loadMore, initialPage]);

  useEffect(() => {
    if (isInitialLoad.current) {
        loadMore(true);
    }
  }, []);

  return { items, lastItemRef, hasMore, isLoading, reset };
}
