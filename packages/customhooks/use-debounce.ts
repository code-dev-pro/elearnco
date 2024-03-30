import { useEffect, useRef } from 'react';

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function debouncedCallback(...args: Parameters<T>) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  }

  return debouncedCallback;
}

export default useDebounce;
