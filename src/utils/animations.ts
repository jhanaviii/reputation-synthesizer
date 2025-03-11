
import { useEffect, useState, useRef } from 'react';

// Fade-in animation using Intersection Observer
export const useFadeIn = (threshold = 0.1, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }
    
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold, rootMargin]);
  
  return { domRef, isVisible };
};

// Smooth image loading
export const useImageLoad = () => {
  const [loaded, setLoaded] = useState(false);
  
  const handleLoad = () => {
    setLoaded(true);
  };
  
  return {
    loaded,
    onLoad: handleLoad,
    className: `image-load ${loaded ? 'image-loaded' : ''}`,
  };
};

// Smooth page transitions
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const triggerTransition = (callback: () => void, duration = 300) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, duration);
  };
  
  return {
    isTransitioning,
    triggerTransition,
    transitionClass: isTransitioning ? 'animate-fade-out' : 'animate-fade-in',
  };
};

// Staggered animation for lists
export const useStaggeredAnimation = (items: any[], baseDelay = 50) => {
  return items.map((item, index) => ({
    ...item,
    style: {
      animationDelay: `${index * baseDelay}ms`,
    },
  }));
};
