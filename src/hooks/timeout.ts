import { useCallback, useEffect, useRef } from 'react';

export type TimeoutId = ReturnType<typeof setTimeout>;

export function useTimeout<T extends (...args: never[]) => unknown>(
  callback: T,
  waitMs: number
): (...args: Parameters<T>) => NodeJS.Timeout | number {
  const timeoutCallback = useRef<T>(callback);
  const timeoutIds = useRef<TimeoutId[]>([]);

  useEffect(() => {
    timeoutCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const ids = timeoutIds.current;
    return () => {
      ids.forEach((id) => clearTimeout(id));
    };
  }, [timeoutIds]);

  return useCallback<(...args: Parameters<T>) => NodeJS.Timeout | number>(
    (...args: Parameters<T>) => {
      const id = setTimeout(() => timeoutCallback.current(...args), waitMs);
      timeoutIds.current.push(id);
      return id;
    },
    [waitMs]
  );
}
