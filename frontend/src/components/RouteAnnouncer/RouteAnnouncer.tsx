import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const RouteAnnouncer: React.FC = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Defer reading document.title until after react-helmet-async has flushed
    // the new <title>. A rAF fires too early (before helmet effects settle);
    // setTimeout yields back to the event loop, giving helmet time to commit.
    const timer = setTimeout(() => {
      setMessage(`Navigated to ${document.title}`);
    }, 50);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    const main = document.querySelector('main') as HTMLElement | null;
    let blurCleanup: (() => void) | null = null;
    if (main) {
      const prevTabIndex = main.getAttribute('tabindex');
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: false });
      if (prevTabIndex === null) {
        // Remove after blur so the focus ring doesn't linger on click
        const onBlur = () => {
          main.removeAttribute('tabindex');
          main.removeEventListener('blur', onBlur);
        };
        main.addEventListener('blur', onBlur);
        blurCleanup = () => main.removeEventListener('blur', onBlur);
      }
    }

    return () => {
      clearTimeout(timer);
      blurCleanup?.();
    };
  }, [location.pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {message}
    </div>
  );
};

export default RouteAnnouncer;