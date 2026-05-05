import { useEffect, useRef } from 'react';

const FADE_CLASS = 'fade-section';
const VISIBLE_CLASS = 'visible';

/**
 * Adds `visible` to descendants with class `fade-section` when they
 * scroll into view (15% threshold). Each element is observed once.
 */
export function useFadeOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(`.${FADE_CLASS}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(VISIBLE_CLASS);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return ref;
}
