import { useEffect, useRef } from 'react';

/**
 * Observes elements matching `fadeClass` inside the returned ref and
 * adds `visibleClass` when they scroll into view (15 % visible).
 * Each element is observed only once.
 */
export function useFadeOnScroll(fadeClass: string, visibleClass: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(`.${fadeClass}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [fadeClass, visibleClass]);

  return ref;
}
