import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CLIENT_REVIEWS } from '../data/siteData';
import { calculateExpandedClientWidth } from '../utils/animationMath';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

export function ClientReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visualTabIndex, setVisualTabIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const clientItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clientsListRef = useRef<HTMLDivElement | null>(null);
  const reviewCopyRef = useRef<HTMLHeadingElement | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const clientInfoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reviewImgWrapperRef = useRef<HTMLDivElement | null>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const getExpandedWidth = () => {
    return calculateExpandedClientWidth(
      clientsListRef.current?.offsetWidth,
      CLIENT_REVIEWS.length
    );
  };

  const crossfadeReviewImage = (src: string) => {
    if (!reviewImgWrapperRef.current) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.opacity = '0';
    reviewImgWrapperRef.current.appendChild(img);

    return gsap.to(img, {
      opacity: 1,
      duration: 1,
      delay: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (!reviewImgWrapperRef.current) return;
        reviewImgWrapperRef.current.querySelectorAll('img').forEach((existing) => {
          if (existing !== img) existing.remove();
        });
      },
    });
  };

  useEffect(() => {
    gsap.set(clientItemRefs.current, { width: '3rem' });
    gsap.set(clientInfoRefs.current, { opacity: 0 });

    if (clientItemRefs.current[0]) {
      const expandedWidth = getExpandedWidth();
      gsap.to(clientItemRefs.current[0], {
        width: expandedWidth,
        duration: 0.75,
        ease: 'power4.inOut',
      });
    }

    if (clientInfoRefs.current[0]) {
      gsap.to(clientInfoRefs.current[0], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    const timer = setTimeout(() => {
      if (reviewCopyRef.current) {
        splitRef.current = SplitText.create(reviewCopyRef.current, {
          type: 'lines',
          mask: 'lines',
        });
        if (splitRef.current && splitRef.current.lines) {
          gsap.set(splitRef.current.lines, { y: '110%' });
          gsap.to(splitRef.current.lines, {
            y: '0%',
            duration: 0.5,
            stagger: 0.05,
            ease: 'power4.out',
          });
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (splitRef.current && reviewCopyRef.current) {
      splitRef.current.revert();
      splitRef.current = SplitText.create(reviewCopyRef.current, {
        type: 'lines',
        mask: 'lines',
      });
      if (splitRef.current.lines) {
        gsap.set(splitRef.current.lines, { y: '110%' });
        gsap.to(splitRef.current.lines, {
          y: '0%',
          duration: 0.5,
          stagger: 0.05,
          ease: 'power4.out',
        });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (reviewCopyRef.current) {
        if (!splitRef.current) {
          splitRef.current = SplitText.create(reviewCopyRef.current, {
            type: 'lines',
            mask: 'lines',
          });
        }
        if (splitRef.current && splitRef.current.lines) {
          gsap.set(splitRef.current.lines, { y: '110%' });
          gsap.to(splitRef.current.lines, {
            y: '0%',
            duration: 0.5,
            stagger: 0.05,
            ease: 'power4.out',
          });
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectClient = (targetIdx: number) => {
    if (targetIdx === activeIndex || isAnimating) return;

    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
    }

    setIsAnimating(true);
    const expandedWidth = getExpandedWidth();
    masterTimelineRef.current = gsap.timeline();
    const tl = masterTimelineRef.current;

    if (clientInfoRefs.current[visualTabIndex]) {
      tl.to(
        clientInfoRefs.current[visualTabIndex],
        { opacity: 0, duration: 0.5, ease: 'power2.out' },
        0
      );
    }

    tl.to(
      clientItemRefs.current[activeIndex],
      { width: '3rem', duration: 0.75, ease: 'power4.inOut' },
      0
    ).to(
      clientItemRefs.current[targetIdx],
      { width: expandedWidth, duration: 0.75, ease: 'power4.inOut' },
      0
    );

    tl.call(
      () => {
        setVisualTabIndex(targetIdx);
      },
      [],
      0.2
    );

    tl.to(
      {},
      {
        duration: 0.1,
        onComplete: () => {
          if (clientInfoRefs.current[targetIdx]) {
            const fadeIn = gsap.to(clientInfoRefs.current[targetIdx], {
              opacity: 0,
              duration: 0,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(clientInfoRefs.current[targetIdx], {
                  opacity: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                });
              },
            });
            tl.add(fadeIn, 0.5);
          }
        },
      },
      0.5
    );

    const imgTween = crossfadeReviewImage(CLIENT_REVIEWS[targetIdx].image);
    if (imgTween) {
      tl.add(imgTween, 0);
    }

    if (splitRef.current && splitRef.current.lines) {
      const textOut = gsap.to(splitRef.current.lines, {
        y: '-110%',
        duration: 0.5,
        stagger: 0.05,
        ease: 'power4.in',
        onComplete: () => {
          setActiveIndex(targetIdx);
        },
      });
      tl.add(textOut, 0);
    } else {
      setActiveIndex(targetIdx);
    }

    tl.call(() => {
      setTimeout(() => {
        setIsAnimating(false);
        masterTimelineRef.current = null;
      }, 250);
    });
  };

  return (
    <div className="client-reviews">
      <div className="container">
        <div className="client-reviews-wrapper">
          <div className="client-review-content">
            <div className="client-review-img" ref={reviewImgWrapperRef}>
              <img src={CLIENT_REVIEWS[activeIndex].image} alt="" />
            </div>
            <div className="client-review-copy">
              <h3 ref={reviewCopyRef} key={activeIndex}>
                {CLIENT_REVIEWS[activeIndex].review}
              </h3>
            </div>
          </div>
          <div className="clients-list" ref={clientsListRef}>
            {CLIENT_REVIEWS.map((client, idx) => (
              <div
                key={client.id}
                ref={(el) => {
                  clientItemRefs.current[idx] = el;
                }}
                className={`client-item ${idx === visualTabIndex ? 'active' : ''} ${
                  isAnimating ? 'animating' : ''
                }`}
                onClick={() => handleSelectClient(idx)}
                role="button"
                tabIndex={0}
                aria-label={client.name}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectClient(idx);
                  }
                }}
              >
                <div className="client-avatar">
                  <img src={client.avatar} alt={client.name} />
                </div>
                {idx === visualTabIndex && (
                  <div
                    className="client-info"
                    ref={(el) => {
                      clientInfoRefs.current[idx] = el;
                    }}
                    style={{ opacity: 0 }}
                  >
                    <p className="client-name md">{client.name}</p>
                    <p className="client-title">{client.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
