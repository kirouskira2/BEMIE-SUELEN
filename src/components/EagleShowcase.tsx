import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CATEGORY_REEL_SWITCH_INTERVAL_MS,
  CatalogFilterKey,
  getCategoryReelConfig,
  getNextCategoryReelIndex,
  shouldPlayCategoryReel,
} from '../utils/animationMath';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface EagleTrioColumn {
  id: string;
  mainImage: string;
  categoryBold: string;
  editorialSlug: string;
  editorialSub: string;
  catalogFilter: CatalogFilterKey;
  primaryProductId: string;
  reelUrl: string;
  videoSrc: string;
  reelUrls: string[];
  videoSources: string[];
  videoPosters?: string[];
  pillBg: string;
  cursorColor: string;
  products: {
    key: string;
    id: string;
    name: string;
    image: string;
    defaultSize: string;
  }[];
}

export const EAGLE_TRIO_COLUMNS: EagleTrioColumn[] = [
  {
    id: 'elem1',
    mainImage: '/bemie/products/p_bayopyq5_0.jpg',
    categoryBold: 'ASA DELTA',
    editorialSlug: 'asa delta',
    editorialSub: 'ATÉ 20% OFF · VER MODELOS',
    catalogFilter: getCategoryReelConfig('ASA DELTA')?.catalogFilter || 'asa-delta',
    primaryProductId: getCategoryReelConfig('ASA DELTA')?.primaryProductId || 'p_bayopyq5',
    reelUrl: getCategoryReelConfig('ASA DELTA')?.reelUrl || 'https://www.instagram.com/p/Dc3unyiRadO/',
    videoSrc: getCategoryReelConfig('ASA DELTA')?.videoSrc || '/bemie/reels/reel-asa-delta.mp4',
    reelUrls: getCategoryReelConfig('ASA DELTA')?.reelUrls || [
      'https://www.instagram.com/p/Dc3unyiRadO/',
      'https://www.instagram.com/reel/DdWsBQBxr6W/',
    ],
    videoSources: getCategoryReelConfig('ASA DELTA')?.videoSources || [
      '/bemie/reels/reel-asa-delta.mp4',
      '/bemie/reels/reel-asa-delta-2.mp4',
    ],
    videoPosters: [
      '/bemie/products/p_bayopyq5_0.jpg',
      '/bemie/products/p_dwsrre4l_0.jpg',
    ],
    pillBg: '#efe3d3',
    cursorColor: 'rgba(115, 148, 120, 0.24)',
    products: [
      {
        key: 'p_bayopyq5_angle1',
        id: 'p_bayopyq5',
        name: 'BIQUÍNI SCARLET ASA DELTA',
        image: '/bemie/products/p_bayopyq5_1.jpg',
        defaultSize: 'P',
      },
      {
        key: 'p_dwsrre4l_angle1',
        id: 'p_dwsrre4l',
        name: 'BIQUÍNI HAWAI MARQUINHA DE AMARRAR BOSSA',
        image: '/bemie/products/p_dwsrre4l_0.jpg',
        defaultSize: 'P',
      },
    ],
  },
  {
    id: 'elem2',
    mainImage: '/bemie/products/p_icbso4d4_0.jpg',
    categoryBold: 'MARQUINHA',
    editorialSlug: 'marquinha',
    editorialSub: 'CORTININHA & BRONZE · VERÃO 26/27',
    catalogFilter: getCategoryReelConfig('MARQUINHA')?.catalogFilter || 'marquinha',
    primaryProductId: getCategoryReelConfig('MARQUINHA')?.primaryProductId || 'p_icbso4d4',
    reelUrl:
      getCategoryReelConfig('MARQUINHA')?.reelUrl ||
      'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
    videoSrc: getCategoryReelConfig('MARQUINHA')?.videoSrc || '/bemie/reels/reel-marquinha.mp4',
    reelUrls: getCategoryReelConfig('MARQUINHA')?.reelUrls || [
      'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
      'https://www.instagram.com/reel/DdEXoszxKeA/',
    ],
    videoSources: getCategoryReelConfig('MARQUINHA')?.videoSources || [
      '/bemie/reels/reel-marquinha.mp4',
      '/bemie/reels/reel-marquinha-2.mp4',
    ],
    videoPosters: [
      '/bemie/products/p_icbso4d4_0.jpg',
      '/bemie/products/p_qiw632k8_0.jpg',
    ],
    pillBg: '#efe3d3',
    cursorColor: 'rgba(155, 115, 82, 0.24)',
    products: [
      {
        key: 'p_icbso4d4_angle1',
        id: 'p_icbso4d4',
        name: 'BIQUÍNI BÚZIOS PISTACHIO',
        image: '/bemie/products/p_icbso4d4_1.jpg',
        defaultSize: 'P',
      },
      {
        key: 'p_qiw632k8_angle1',
        id: 'p_qiw632k8',
        name: 'BIQUÍNI MARQUINHA VERMELHO CEREJA E ROSA AREIA',
        image: '/bemie/products/p_qiw632k8_0.jpg',
        defaultSize: 'G',
      },
    ],
  },
  {
    id: 'elem3',
    mainImage: '/bemie/products/p_wnba68hp_0.jpg',
    categoryBold: 'ALÇA DUPLA',
    editorialSlug: 'alça dupla',
    editorialSub: 'RESORT & SUSTENTAÇÃO · VER PEÇAS',
    catalogFilter: getCategoryReelConfig('ALÇA DUPLA')?.catalogFilter || 'alca-dupla',
    primaryProductId: getCategoryReelConfig('ALÇA DUPLA')?.primaryProductId || 'p_wnba68hp',
    reelUrl: getCategoryReelConfig('ALÇA DUPLA')?.reelUrl || 'https://www.instagram.com/p/DdpIwAPvjp8/',
    videoSrc: getCategoryReelConfig('ALÇA DUPLA')?.videoSrc || '/bemie/reels/reel-alca-dupla.mp4',
    reelUrls: getCategoryReelConfig('ALÇA DUPLA')?.reelUrls || [
      'https://www.instagram.com/p/DdpIwAPvjp8/',
    ],
    videoSources: getCategoryReelConfig('ALÇA DUPLA')?.videoSources || [
      '/bemie/reels/reel-alca-dupla.mp4',
    ],
    videoPosters: [
      '/bemie/products/p_wnba68hp_0.jpg',
    ],
    pillBg: '#efe3d3',
    cursorColor: 'rgba(179, 167, 152, 0.24)',
    products: [
      {
        key: 'p_wnba68hp_angle1',
        id: 'p_wnba68hp',
        name: 'BIQUÍNI TIE DYE COCONUT',
        image: '/bemie/products/p_wnba68hp_1.jpg',
        defaultSize: 'P',
      },
      {
        key: 'p_wnba68hp_angle2',
        id: 'p_wnba68hp',
        name: 'BIQUÍNI TIE DYE COCONUT',
        image: '/bemie/products/p_wnba68hp_2.jpg',
        defaultSize: 'M',
      },
    ],
  },
];

interface EagleShowcaseProps {
  onSelectCategory: (categoryFilter: CatalogFilterKey, productId: string) => void;
}

export function MouseBallCursor() {
  return null;
}

export const EaglePhotoTrio = React.memo(function EaglePhotoTrio({ onSelectCategory }: EagleShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});
  const [hoveredColId, setHoveredColId] = useState<string | null>(null);
  const [previewThumbColId, setPreviewThumbColId] = useState<string | null>(null);
  const [loadedImageKeys, setLoadedImageKeys] = useState<Record<string, boolean>>({});
  const [activeReelIndices, setActiveReelIndices] = useState<Record<string, number>>({
    elem1: 0,
    elem2: 0,
    elem3: 0,
  });

  const markImageLoaded = (key: string) => {
    setLoadedImageKeys((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>('.elem > img');
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // Synchronize active video playback per column without conflicting play/pause calls
  useEffect(() => {
    EAGLE_TRIO_COLUMNS.forEach((col) => {
      const activeIdx = activeReelIndices[col.id] ?? 0;
      col.videoSources.forEach((_, idx) => {
        const videoEl = videoRefs.current[`${col.id}_${idx}`];
        if (!videoEl) return;
        videoEl.muted = true;
        videoEl.defaultMuted = true;
        videoEl.playsInline = true;

        if (idx === activeIdx) {
          if (col.videoSources.length > 1) {
            try {
              videoEl.currentTime = 0;
            } catch {
              // ignore seek before metadata
            }
          }
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              videoEl.muted = true;
              videoEl.play().catch(() => {});
            });
          }
        } else if (!videoEl.paused) {
          try {
            videoEl.pause();
          } catch {
            // ignore
          }
        }
      });
    });

    const ensureActiveVideosPlaying = () => {
      EAGLE_TRIO_COLUMNS.forEach((col) => {
        const activeIdx = activeReelIndices[col.id] ?? 0;
        const videoEl = videoRefs.current[`${col.id}_${activeIdx}`];
        if (videoEl && videoEl.paused && previewThumbColId !== col.id) {
          videoEl.muted = true;
          videoEl.defaultMuted = true;
          videoEl.playsInline = true;
          videoEl.play().catch(() => {});
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        ensureActiveVideosPlaying();
      }
    };

    const watchdog = window.setInterval(ensureActiveVideosPlaying, 800);

    let io: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && sectionRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              ensureActiveVideosPlaying();
            }
          });
        },
        { threshold: 0.05 }
      );
      io.observe(sectionRef.current);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearInterval(watchdog);
      io?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeReelIndices, previewThumbColId]);

  // Alternate between videos every 7 seconds for Asa Delta (elem1) and Marquinha (elem2)
  useEffect(() => {
    const timer = window.setInterval(() => {
      const loaderEl = document.querySelector('.loader');
      if (loaderEl && window.getComputedStyle(loaderEl).pointerEvents !== 'none') {
        return;
      }
      setActiveReelIndices((prev) => {
        const next: Record<string, number> = { ...prev };
        EAGLE_TRIO_COLUMNS.forEach((col) => {
          if (col.videoSources.length > 1) {
            const currentIdx = prev[col.id] ?? 0;
            next[col.id] = getNextCategoryReelIndex(currentIdx, col.videoSources.length);
          }
        });
        return next;
      });
    }, CATEGORY_REEL_SWITCH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const ensureReelPlaying = (colId: string) => {
    const activeIdx = activeReelIndices[colId] ?? 0;
    const videoEl = videoRefs.current[`${colId}_${activeIdx}`];
    if (videoEl && videoEl.paused) {
      videoEl.muted = true;
      videoEl.defaultMuted = true;
      videoEl.playsInline = true;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  };

  return (
    <section id="page2" ref={sectionRef} aria-label="Lookbook interativo Bemiê">
      {EAGLE_TRIO_COLUMNS.map((col) => {
        const displayedMainImage = activeImages[col.id] || col.mainImage;
        const isPlayingReel = shouldPlayCategoryReel({
          isCardHovered: hoveredColId === col.id,
          isPreviewingProductThumb: previewThumbColId === col.id,
        });
        const currentReelIdx = activeReelIndices[col.id] ?? 0;
        const currentReelUrl = col.reelUrls[currentReelIdx] || col.reelUrl;

        return (
          <div
            id={col.id}
            className={`elem numana-banner-card js-scroll-trigger is-inViewport${isPlayingReel ? ' is-playing-reel' : ''}`}
            data-color={col.cursorColor}
            data-reel-url={currentReelUrl}
            data-active-reel-index={currentReelIdx}
            data-category-filter={col.catalogFilter}
            key={col.id}
            role="button"
            tabIndex={0}
            aria-label={`Ver categoria ${col.categoryBold} no catálogo`}
            onMouseEnter={() => {
              setHoveredColId(col.id);
              setPreviewThumbColId(null);
              ensureReelPlaying(col.id);
            }}
            onMouseLeave={() => {
              setHoveredColId((prev) => (prev === col.id ? null : prev));
              setPreviewThumbColId((prev) => (prev === col.id ? null : prev));
              setActiveImages((prev) =>
                prev[col.id] ? { ...prev, [col.id]: col.mainImage } : prev
              );
              ensureReelPlaying(col.id);
            }}
            onClick={() => onSelectCategory(col.catalogFilter, col.primaryProductId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(col.catalogFilter, col.primaryProductId);
              }
            }}
          >
            <img
              src={displayedMainImage}
              alt={`Coleção ${col.categoryBold}`}
              className="textbanner-image-effect lazyload fade-in lazyloaded"
              referrerPolicy="no-referrer"
              style={{ opacity: 1 }}
            />
            {col.videoSources.map((src, idx) => {
              const isCurrentVideo = idx === currentReelIdx;
              const isVisible = isPlayingReel && isCurrentVideo;
              const videoPoster = col.videoPosters?.[idx] || col.mainImage;
              const cacheBustedSrc = `${src}?v=2`;
              return (
                <video
                  key={src}
                  ref={(node) => {
                    videoRefs.current[`${col.id}_${idx}`] = node;
                    if (node) {
                      node.muted = true;
                      node.defaultMuted = true;
                      node.playsInline = true;
                      node.setAttribute('muted', '');
                      node.setAttribute('playsinline', '');
                      node.setAttribute('webkit-playsinline', '');
                    }
                  }}
                  className={`elem-reel-video${isVisible ? ' is-visible' : ' is-hidden-reel'}`}
                  src={cacheBustedSrc}
                  data-video-src={src}
                  poster={videoPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onCanPlay={(e) => {
                    const v = e.currentTarget;
                    v.muted = true;
                    if (isCurrentVideo && isPlayingReel && v.paused) {
                      v.play().catch(() => {});
                    }
                  }}
                  onLoadedData={(e) => {
                    const v = e.currentTarget;
                    v.muted = true;
                    if (isCurrentVideo && isPlayingReel && v.paused) {
                      v.play().catch(() => {});
                    }
                  }}
                  aria-label={`Vídeo ${idx + 1} da categoria ${col.categoryBold}`}
                />
              );
            })}

            <div
              className="dets"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(col.catalogFilter, col.primaryProductId);
              }}
            >
              <div
                className="dets-info"
                style={{ backgroundColor: col.pillBg }}
              >
                <i className="ri-circle-fill" />
                <p>
                  <b>{col.categoryBold}</b>
                </p>
                <i className="ri-arrow-right-s-line" />
              </div>
              <div
                className="dets-container"
                style={{ backgroundColor: col.pillBg }}
              >
                <div className="listing">
                  {col.products.map((prod) => {
                    const thumbLoaded = loadedImageKeys[prod.image] !== false;
                    return (
                      <button
                        type="button"
                        className="list-elem"
                        key={prod.key}
                        aria-label={`Ver ${prod.name} na categoria ${col.categoryBold} do catálogo`}
                        onMouseEnter={() => {
                          setPreviewThumbColId(col.id);
                          setActiveImages((prev) => ({ ...prev, [col.id]: prod.image }));
                        }}
                        onMouseLeave={() => {
                          setPreviewThumbColId((prev) => (prev === col.id ? null : prev));
                          ensureReelPlaying(col.id);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(col.catalogFilter, prod.id);
                        }}
                      >
                        <div className="img-cont">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className={`lazyload fade-in${thumbLoaded ? ' lazyloaded' : ''}`}
                            referrerPolicy="no-referrer"
                            onLoad={() => markImageLoaded(prod.image)}
                            onError={() => markImageLoaded(prod.image)}
                          />
                          <div className="placeholder-fade" aria-hidden="true" />
                        </div>
                        <p>{prod.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
});
