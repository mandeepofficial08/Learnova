import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const positions = useRef({});

  // Save scroll position continuously
  useEffect(() => {
    const savePosition = () => {
      const historyIndex = window.history.state?.idx;

      if (historyIndex !== undefined) {
        positions.current[historyIndex] =
          document.documentElement.scrollTop;
      }
    };

    window.addEventListener("scroll", savePosition, {
      passive: true,
    });

    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, []);

  // Restore scroll position after navigation
  useEffect(() => {
    const historyIndex = window.history.state?.idx;

    if (navigationType === "POP") {
      const savedPosition =
        historyIndex !== undefined
          ? positions.current[historyIndex]
          : undefined;

      if (savedPosition !== undefined) {
        const restore = () => {
          document.documentElement.scrollTop = savedPosition;
        };

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            restore();

            setTimeout(restore, 50);
            setTimeout(restore, 150);
            setTimeout(restore, 300);
          });
        });
      }
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, [location.key, navigationType]);

  return null;
}

export default ScrollRestoration;