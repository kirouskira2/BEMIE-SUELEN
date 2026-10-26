import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom Circular Cursor com Física Fluida (LERP), Dot Central Imediato
 * e Efeito Ótico de Inversão (mix-blend-difference).
 */
export const CustomCursor = React.memo(function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Resposta imediata 0ms para o ponto central (evita sensação de lag)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Interpolação Linear (LERP) para suavidade elástica e inércia natural do anel externo
    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Animação de clique (Active State: contração rápida no mousedown)
    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // Controle de visibilidade
    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Detecção inteligente de elementos interativos para expansão
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClickable = Boolean(
        target.closest('a, button, input, textarea, select, [role="button"], .clickable') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );
      setIsHovered(isClickable);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      className="bemie-custom-cursor-container pointer-events-none"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}
      aria-hidden="true"
    >
      {/* 1. Halo / Anel Externo Suave com LERP e mix-blend-difference */}
      <div
        ref={cursorRingRef}
        className={`bemie-cursor-ring ${isHovered ? 'is-hovered' : ''} ${isClicked ? 'is-clicked' : ''}`}
      />
      {/* 2. Ponto Central Imediato (Dot preciso) com mix-blend-difference */}
      <div
        ref={cursorDotRef}
        className={`bemie-cursor-dot ${isHovered ? 'is-hovered' : ''} ${isClicked ? 'is-clicked' : ''}`}
      />
    </div>
  );
});

export default CustomCursor;
