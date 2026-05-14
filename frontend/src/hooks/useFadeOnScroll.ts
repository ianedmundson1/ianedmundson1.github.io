import { useEffect, useRef } from 'react';

const FADE_CLASS = 'fade-section';
const VISIBLE_CLASS = 'visible';

/**
 * Adds `visible` to descendants with class `fade-section` when they scroll
 * into view (15% threshold). Picks up nodes that mount later (e.g. after a
 * suspended subtree resolves) via a MutationObserver.
 */
export function useFadeOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const seen = new WeakSet<Element>();
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

    const observe = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    };

    root.querySelectorAll<HTMLElement>(`.${FADE_CLASS}`).forEach(observe);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches?.(`.${FADE_CLASS}`)) observe(node);
          node.querySelectorAll?.<HTMLElement>(`.${FADE_CLASS}`).forEach(observe);
        });
      }
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return ref;
}
