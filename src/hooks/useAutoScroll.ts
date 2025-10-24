import { useEffect, useRef } from 'react';

export function useAutoScroll<T>(deps: T[]) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, deps);

  return scrollRef;
}
