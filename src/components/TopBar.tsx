import React, { useState, useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { HEADER_PROMO_BAR_TEXT } from '../data/siteData';
import { CatalogFilterKey, computeHeaderVisibility } from '../utils/animationMath';

interface TopBarProps {
  onNavigate: (route: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategoryFilter?: (filter: CatalogFilterKey) => void;
}

export function TopBar({
  onNavigate,
  cartCount,
  onOpenCart,
  onSelectCategoryFilter,
}: TopBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Synchronized with smooth scroll (Lenis) when present
  useLenis((lenis) => {
    const currentY = lenis.scroll;
    const isProgrammatic = Boolean(
      (window as unknown as { __bemieNavigating?: boolean }).__bemieNavigating
    );
    if (isProgrammatic && currentY > 15) {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
      lastScrollYRef.current = currentY;
      return;
    }
    const result = computeHeaderVisibility(
      currentY,
      lastScrollYRef.current,
      isVisibleRef.current
    );
    if (result.isVisible !== isVisibleRef.current) {
      isVisibleRef.current = result.isVisible;
      setIsVisible(result.isVisible);
    }
    lastScrollYRef.current = result.nextLastScrollY;
  });

  // Native window scroll fallback
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        const isProgrammatic = Boolean(
          (window as unknown as { __bemieNavigating?: boolean }).__bemieNavigating
        );
        if (isProgrammatic && currentY > 15) {
          if (isVisibleRef.current) {
            isVisibleRef.current = false;
            setIsVisible(false);
          }
          lastScrollYRef.current = currentY;
          ticking = false;
          return;
        }
        const result = computeHeaderVisibility(
          currentY,
          lastScrollYRef.current,
          isVisibleRef.current
        );
        if (result.isVisible !== isVisibleRef.current) {
          isVisibleRef.current = result.isVisible;
          setIsVisible(result.isVisible);
        }
        lastScrollYRef.current = result.nextLastScrollY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCategoryNav = (filter: CatalogFilterKey) => {
    onSelectCategoryFilter?.(filter);
    onNavigate('#page3');
  };

  const handleFocusSearch = () => {
    onNavigate('#page3');
    window.setTimeout(() => {
      const searchInput = document.getElementById(
        'bemie-catalog-search'
      ) as HTMLInputElement | null;
      if (searchInput) {
        searchInput.focus({ preventScroll: true });
      }
    }, 650);
  };

  const [isBikiniMenuOpen, setIsBikiniMenuOpen] = useState(false);
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const closeMenuTimerRef = useRef<number | null>(null);
  const justOpenedByHoverRef = useRef(false);

  const openBikiniMenu = () => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    if (!isBikiniMenuOpen) {
      justOpenedByHoverRef.current = true;
      window.setTimeout(() => {
        justOpenedByHoverRef.current = false;
      }, 350);
    }
    setIsBikiniMenuOpen(true);
  };

  const scheduleCloseBikiniMenu = () => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
    }
    closeMenuTimerRef.current = window.setTimeout(() => {
      setIsBikiniMenuOpen(false);
    }, 220);
  };

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(e.target as Node)
      ) {
        setIsBikiniMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBikiniMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeMenuTimerRef.current) {
        window.clearTimeout(closeMenuTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`numana-header-hover-zone ${
          isVisible || isBikiniMenuOpen ? 'is-visible' : 'is-hidden'
        }`}
        role="region"
        aria-label="Barra de topo"
      >
        <header
          className="apple-notch-header numana-header"
          role="banner"
          aria-label="Barra de navegação Bemiê"
        >
          {/* Barra superior de promoções estilo Numana (.section-adbar) */}
          <div className="numana-adbar" role="region" aria-label="Promoções e envios">
            <p className="numana-adbar-text">{HEADER_PROMO_BAR_TEXT}</p>
          </div>

          {/* Cabeçalho principal: logo só as letras BEMIÊ, menu enxuto com Biquínis dropdown */}
          <div className="apple-notch-inner numana-header-main">
            <a
              href="/"
              className="apple-notch-brand numana-brand bemie-brand-letters-link"
              aria-label="Bemiê Moda Praia Início"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              <img
                src="/assets/bemie-letters.png"
                alt="BEMIÊ Moda Praia"
                className="bemie-header-letters-logo"
              />
            </a>

            <nav className="apple-notch-nav numana-nav" aria-label="Navegação principal">
              <button
                type="button"
                onClick={() => handleCategoryNav('ofertas')}
                className="apple-notch-link numana-nav-link"
              >
                <span>OFERTAS</span>
                <i className="ri-arrow-down-s-line numana-nav-caret" aria-hidden="true" />
              </button>

              {/* Menu Biquínis com Dropdown contendo Asa Delta, Marquinha e Alça Dupla */}
              <div
                ref={dropdownWrapperRef}
                className="bemie-dropdown-wrapper"
                onMouseEnter={openBikiniMenu}
                onMouseLeave={scheduleCloseBikiniMenu}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (justOpenedByHoverRef.current) {
                      justOpenedByHoverRef.current = false;
                      setIsBikiniMenuOpen(true);
                    } else {
                      setIsBikiniMenuOpen((prev) => !prev);
                    }
                  }}
                  className="apple-notch-link numana-nav-link"
                  aria-expanded={isBikiniMenuOpen}
                  aria-haspopup="true"
                >
                  <span>BIQUÍNIS</span>
                  <i
                    className={`ri-arrow-down-s-line numana-nav-caret transition-transform duration-200 ${
                      isBikiniMenuOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isBikiniMenuOpen && (
                  <div
                    className="bemie-nav-dropdown"
                    role="menu"
                    aria-label="Submenu de Biquínis"
                    onMouseEnter={openBikiniMenu}
                    onMouseLeave={scheduleCloseBikiniMenu}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsBikiniMenuOpen(false);
                        handleCategoryNav('biquini');
                      }}
                      className="bemie-nav-dropdown-item"
                    >
                      <span>TODOS OS BIQUÍNIS</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsBikiniMenuOpen(false);
                        handleCategoryNav('asa-delta');
                      }}
                      className="bemie-nav-dropdown-item"
                    >
                      <span>ASA DELTA</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsBikiniMenuOpen(false);
                        handleCategoryNav('marquinha');
                      }}
                      className="bemie-nav-dropdown-item"
                    >
                      <span>MARQUINHA</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsBikiniMenuOpen(false);
                        handleCategoryNav('alca-dupla');
                      }}
                      className="bemie-nav-dropdown-item"
                    >
                      <span>ALÇA DUPLA</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('#instagram')}
                className="apple-notch-link numana-nav-link"
              >
                <span>INSTAGRAM</span>
                <i className="ri-arrow-down-s-line numana-nav-caret" aria-hidden="true" />
              </button>
            </nav>

            <div className="apple-notch-actions numana-utilities">
              <button
                type="button"
                className="numana-utility-btn"
                aria-label="Buscar peças no catálogo"
                onClick={handleFocusSearch}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7.5" />
                  <path d="M20 20L16.5 16.5" />
                </svg>
              </button>

              <button
                type="button"
                className={`apple-notch-cart-btn numana-bag-trigger ${
                  cartCount > 0 ? 'has-cart-notification' : ''
                }`}
                aria-label={`Abrir carrinho com ${cartCount} itens`}
                onClick={onOpenCart}
              >
                <span className="numana-bag-icon-wrap" aria-hidden="true">
                  <svg
                    width="19"
                    height="21"
                    viewBox="0 0 20 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M3 6H17L18 20H2L3 6Z" />
                    <path d="M6.5 6V4.5C6.5 2.567 8.067 1 10 1C11.933 1 13.5 2.567 13.5 4.5V6" />
                  </svg>
                  <span
                    className={`apple-notch-cart-badge numana-bag-count ${
                      cartCount > 0 ? 'is-notified' : ''
                    }`}
                  >
                    {cartCount}
                  </span>
                </span>
                <span className="sr-only">Carrinho</span>
              </button>
            </div>
          </div>
        </header>
      </div>
      <div className="numana-header-spacer" aria-hidden="true" />
    </>
  );
}
