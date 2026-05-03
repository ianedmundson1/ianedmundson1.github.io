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
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'instant' as ScrollBehavior });

    const main = document.querySelector('main') as HTMLElement | null;
    if (main) {
      const prevTabIndex = main.getAttribute('tabindex');
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: false });
      if (prevTabIndex === null) {
        // Remove after blur so the focus ring doesn't linger on click
        const cleanup = () => {
          main.removeAttribute('tabindex');
          main.removeEventListener('blur', cleanup);
        };
        main.addEventListener('blur', cleanup);
      }
    }

    return () => clearTimeout(timer);
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
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {message}
    </div>
  );
};

export default RouteAnnouncer;