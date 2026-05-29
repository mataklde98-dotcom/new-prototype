import { useState, useEffect, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';

interface UseScrollDirectionOptions {
  threshold?: number; // Minimum scroll distance to trigger (default: 10px)
  elementRef?: React.RefObject<HTMLElement>; // Optional: specific element to watch (default: window)
}

/**
 * Hook to detect scroll direction with threshold
 * Used for "Hide on Scroll" patterns (e.g. bottom navigation)
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10, elementRef } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const element = elementRef?.current || window;
    
    const updateScrollDirection = () => {
      const scrollY = elementRef?.current 
        ? elementRef.current.scrollTop 
        : window.pageYOffset || document.documentElement.scrollTop;

      // Only trigger if scroll delta exceeds threshold
      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }

      const direction: ScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
      
      // Update visibility: hide when scrolling down, show when scrolling up
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
        setIsVisible(direction === 'up' || scrollY < threshold);
      }

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // Attach scroll listener
    if (elementRef?.current) {
      elementRef.current.addEventListener('scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Cleanup
    return () => {
      if (elementRef?.current) {
        elementRef.current.removeEventListener('scroll', onScroll);
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, [scrollDirection, threshold, elementRef]);

  return { scrollDirection, isVisible };
}
