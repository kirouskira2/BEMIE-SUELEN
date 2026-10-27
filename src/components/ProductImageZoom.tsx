import React, { useRef, useEffect, useState } from 'react';
import { calculateZoomOrigin, getNumanaImageRevealClasses } from '../utils/animationMath';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  zoomScale?: number;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  loading?: 'lazy' | 'eager';
}

/**
 * ProductImageZoom:
 * - Ampliação suave e sutil (zoomScale: 1.45) ao passar o mouse para inspecionar tecido e estampa
 * - Efeito de carregamento e aparição idêntico ao site numana.com.ar (lazyload fade-in + placeholder-fade)
 * - Rastreamento direto de transform-origin via DOM com 60fps sem sobrecarga de renderização
 * - Suporte a toque no mobile
 */
export const ProductImageZoom = React.memo(function ProductImageZoom({
  src,
  alt,
  className = '',
  containerClassName = '',
  zoomScale = 1.45,
  referrerPolicy = 'no-referrer',
  loading = 'lazy',
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    const indicator = indicatorRef.current;
    if (!container || !img) return;

    let isHovered = false;

    const handleEnter = () => {
      isHovered = true;
      container.classList.add('is-zoomed');
      if (indicator) indicator.classList.add('active');
    };

    const handleMove = (e: MouseEvent) => {
      if (!isHovered) {
        isHovered = true;
        container.classList.add('is-zoomed');
        if (indicator) indicator.classList.add('active');
      }
      const rect = container.getBoundingClientRect();
      const origin = calculateZoomOrigin(e.clientX, e.clientY, rect);
      img.style.transformOrigin = `${origin.x}% ${origin.y}%`;
      img.style.transform = `scale(${zoomScale})`;
    };

    const handleLeave = () => {
      isHovered = false;
      container.classList.remove('is-zoomed');
      if (indicator) indicator.classList.remove('active');
      img.style.transformOrigin = 'center center';
      img.style.transform = 'scale(1)';
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const origin = calculateZoomOrigin(touch.clientX, touch.clientY, rect);
      isHovered = !isHovered;
      if (isHovered) {
        container.classList.add('is-zoomed');
        if (indicator) indicator.classList.add('active');
        img.style.transformOrigin = `${origin.x}% ${origin.y}%`;
        img.style.transform = `scale(${zoomScale})`;
      } else {
        handleLeave();
      }
    };

    container.addEventListener('mouseenter', handleEnter, { passive: true });
    container.addEventListener('mousemove', handleMove, { passive: true });
    container.addEventListener('mouseleave', handleLeave, { passive: true });
    container.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      container.removeEventListener('mouseenter', handleEnter);
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
      container.removeEventListener('touchstart', handleTouch);
    };
  }, [zoomScale]);

  const { imageClass: numanaImgClasses } = getNumanaImageRevealClasses({
    isLoaded,
  });

  return (
    <div
      ref={containerRef}
      className={`bemie-zoom-container item-image${isLoaded ? ' is-loaded' : ''} ${containerClassName}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`bemie-zoom-img ${numanaImgClasses} ${className}`}
        referrerPolicy={referrerPolicy}
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
      <div className="placeholder-fade" aria-hidden="true" />
      <div ref={indicatorRef} className="bemie-zoom-indicator" aria-hidden="true">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        <span>Zoom</span>
      </div>
    </div>
  );
});
