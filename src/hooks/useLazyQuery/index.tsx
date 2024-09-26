import { useCallback, useState } from 'react';
import {
  QueryFunction,
  QueryKey,
  useQuery,
  // UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

// type UseQueryParams = Parameters<typeof useQuery>;

export default function useLazyQuery<TData, TError>(
  key: string[],
  fetchFn: QueryFunction<TData, QueryKey>,
  // options?: Omit<UseQueryOptions<TData, TError, unknown, QueryKey>, 'queryKey' | 'queryFn'>
): [() => void, UseQueryResult<unknown, unknown>] {
  const [enabled, setEnabled] = useState(false);
  // key, fetchFn, {
  //   ...(options as || {}),
  //   // enabled,
  // }
  const query = useQuery<TData, TError, unknown, QueryKey>({
    queryKey: key,
    queryFn: fetchFn,
    enabled
  });

  const trigger = useCallback(() => {
    if (!enabled) {
      setEnabled(true);
    }
  }, [enabled]);

  return [trigger, query];
}