
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
  const isInitialLoad = useRef(true);

  const loadMore = useCallback(async (isInitial = false) => {
    if (isLoading || !hasMore) return;
    if (!isInitial && isInitialLoad.current) return;


    setIsLoading(true);
    try {
      const newItems = await fetchFunction({ page, limit });
      setItems(prevItems => [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
      setHasMore(newItems.length === limit);
      if(isInitial) {
        isInitialLoad.current = false;
      }
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
      if (entries[0].isIntersecting && hasMore && !isInitialLoad.current) {
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
    isInitialLoad.current = true;
    loadMore(true);
  }, [loadMore]);

  useEffect(() => {
    loadMore(true);
  }, []);

  return { items, lastItemRef, hasMore, isLoading, reset };
}
