import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { FEATURED_PROJECTS, STORE_CONFIG } from '../data/siteData';
import {
  calculateProductOffer,
  formatBrl,
  buildWhatsAppOrderUrl,
} from '../utils/animationMath';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeaturedProjectsProps {
  onAddToCart: (productId: string, size: string) => void;
}

export function FeaturedProjects({ onAddToCart }: FeaturedProjectsProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    FEATURED_PROJECTS.forEach((p) => {
      const avail = p.tamanhos.find((s) => s.q > 0);
      initial[p.id] = avail ? avail.t : p.tamanhos[0]?.t || 'P';
    });
    return initial;
  });

  const [selectedPhotos, setSelectedPhotos] = useState<Record<string, number>>({});
  const [lockedCardIndex, setLockedCardIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    gsap.registerPlugin(ScrollTrigger);
    let isLocked = false;
    let lockedScrollY = 0;
    let unlockTimeout: number | null = null;
    let lastLockedIdx = -1;

    const blockWheelAndTouch = (e: Event) => {
      if (!isLocked) return;
      e.preventDefault();
      window.scrollTo(0, lockedScrollY);
    };

    window.addEventListener('wheel', blockWheelAndTouch, { passive: false });
    window.addEventListener('touchmove', blockWheelAndTouch, { passive: false });

    const engageScrollLock = (targetY: number, cardIdx: number, durationMs = 220) => {
      if ((window as unknown as { __bemieNavigating?: boolean }).__bemieNavigating) {
        return;
      }
      if (isLocked || lastLockedIdx === cardIdx) return;

      isLocked = true;
      lastLockedIdx = cardIdx;
      lockedScrollY = Math.round(targetY);
      setLockedCardIndex(cardIdx);

      if (lenisRef.current) {
        lenisRef.current.scrollTo(lockedScrollY, { immediate: true, force: true });
        lenisRef.current.stop();
      } else {
        window.scrollTo(0, lockedScrollY);
      }

      if (unlockTimeout) {
        window.clearTimeout(unlockTimeout);
      }
      unlockTimeout = window.setTimeout(() => {
        isLocked = false;
        setLockedCardIndex(null);
        if (lenisRef.current) {
          lenisRef.current.start();
        }
      }, durationMs);
    };

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.featured-project-card');

      cards.forEach((card, index) => {
        const inner = card.querySelector<HTMLElement>('.featured-project-card-inner');
        if (!inner) return;

        gsap.set(inner, {
          y: '0%',
          z: 0,
          scale: 1,
          rotationX: 0,
          '--after-opacity': 0,
        });

        // Scroll-lock trigger com tempo de lock ágil e suave
        ScrollTrigger.create({
          trigger: card,
          start: 'top 24px',
          end: '+=20%',
          onEnter: (self) => {
            engageScrollLock(self.start, index, 160);
          },
          onEnterBack: (self) => {
            engageScrollLock(self.end, index, 140);
          },
          onLeave: () => {
            if (lastLockedIdx === index && !isLocked) {
              lastLockedIdx = -1;
            }
          },
          onLeaveBack: () => {
            if (lastLockedIdx === index && !isLocked) {
              lastLockedIdx = -1;
            }
          },
        });

        // Subtle 3D stack recede that keeps top edge aligned (no upward collision with title)
        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];

          gsap.fromTo(
            inner,
            { y: '0%', z: 0, scale: 1, rotationX: 0 },
            {
              y: '-4%',
              z: -90,
              scale: 0.96,
              rotationX: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: nextCard,
                start: 'top 72%',
                end: 'top 24px',
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            inner,
            { '--after-opacity': 0 },
            {
              '--after-opacity': 0.24,
              ease: 'none',
              scrollTrigger: {
                trigger: nextCard,
                start: 'top 68%',
                end: 'top 24px',
                scrub: true,
              },
            }
          );
        }
      });
    }, containerEl);

    return () => {
      if (unlockTimeout) {
        window.clearTimeout(unlockTimeout);
      }
      window.removeEventListener('wheel', blockWheelAndTouch);
      window.removeEventListener('touchmove', blockWheelAndTouch);
      if (lenisRef.current) {
        lenisRef.current.start();
      }
      ctx.revert();
    };
  }, []);

  return (
    <div className="featured-projects" ref={containerRef}>
      {FEATURED_PROJECTS.map((project, index) => {
        const offer = calculateProductOffer(project);
        const activeSize = selectedSizes[project.id] || 'P';
        const activePhotoIdx = selectedPhotos[project.id] || 0;
        const activePhoto = project.photos[activePhotoIdx] || project.image;
        const directWaUrl = buildWhatsAppOrderUrl(STORE_CONFIG.whatsapp, [
          {
            nome: project.title,
            cor: project.cor,
            tamanho: activeSize,
            qty: 1,
            unitPrice: offer.current,
          },
        ]);

        const cardToneClass = 'is-sand-card';

        return (
          <div
            className={`featured-project-card ${cardToneClass} ${
              lockedCardIndex === index ? 'is-scroll-locked' : ''
            }`}
            style={{ zIndex: index + 1 }}
            data-card-index={index}
            key={project.id}
          >
            <div className={`featured-project-card-inner ${cardToneClass}`}>
              <div className="featured-project-card-content">
                <div className="featured-project-card-info">
                  <p>{project.info}</p>
                </div>
                <div className="featured-project-card-content-main">
                  <div className="featured-project-card-title">
                    <h2>{project.title}</h2>
                  </div>
                  <div className="featured-project-card-description">
                    <p className="lg">{project.description}</p>
                    <div className="bemie-card-controls">
                      <div className="bemie-card-price-row">
                        {offer.active && (
                          <span className="bemie-price-old">{formatBrl(offer.original)}</span>
                        )}
                        <span className="bemie-price-current">{formatBrl(offer.current)}</span>
                        {offer.active && (
                          <span className="bemie-offer-pill">-{offer.percent}% OFF</span>
                        )}
                      </div>

                      <div className="bemie-size-picker">
                        <span className="bemie-meta-label">Tamanho:</span>
                        {project.tamanhos.map((sz) => {
                          const isOut = sz.q <= 0;
                          const isSelected = activeSize === sz.t;
                          return (
                            <button
                              key={sz.t}
                              type="button"
                              disabled={isOut}
                              aria-label={`Selecionar tamanho ${sz.t} para ${project.title}`}
                              className={`bemie-size-btn ${isSelected ? 'active' : ''}`}
                              onClick={() =>
                                setSelectedSizes((prev) => ({ ...prev, [project.id]: sz.t }))
                              }
                            >
                              {sz.t}
                            </button>
                          );
                        })}
                      </div>

                      <div className="bemie-card-actions">
                        <button
                          type="button"
                          className="bemie-action-primary"
                          onClick={() => onAddToCart(project.id, activeSize)}
                        >
                          Adicionar à sacola · {activeSize}
                        </button>
                        <a
                          href={directWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bemie-action-secondary"
                        >
                          Pedir no WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="featured-project-card-media-col">
                <div className="featured-project-card-img">
                  <img
                    src={activePhoto}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                  />
                </div>
                {project.photos.length > 1 && (
                  <div
                    className="bemie-photo-thumbs"
                    role="tablist"
                    aria-label={`Fotos de ${project.title}`}
                  >
                    {project.photos.map((thumb, idx) => (
                      <button
                        key={thumb}
                        type="button"
                        role="tab"
                        aria-selected={activePhotoIdx === idx}
                        aria-label={`Ver foto ${idx + 1} de ${project.title}`}
                        className={`bemie-thumb-btn ${activePhotoIdx === idx ? 'active' : ''}`}
                        onClick={() =>
                          setSelectedPhotos((prev) => ({ ...prev, [project.id]: idx }))
                        }
                      >
                        <img src={thumb} alt="" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
