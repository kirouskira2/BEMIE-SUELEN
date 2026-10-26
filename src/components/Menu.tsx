import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useLenis } from 'lenis/react';
import { STORE_CONFIG } from '../data/siteData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, CustomEase);
}

interface MenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export function MenuToggle({ isOpen, toggleMenu, cartCount, onOpenCart }: MenuToggleProps) {
  return (
    <div className="eagle-icons-hover-zone is-sidebar-visible">
      <div
        id="icons"
        className={`menu-toggle eagle-icons-pill ${isOpen ? 'opened' : 'closed'}`}
      >
        <button
          type="button"
          className="eagle-icon-trigger"
          aria-label="Menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <i className={isOpen ? 'ri-close-line' : 'ri-menu-fill'} />
        </button>
        <button
          type="button"
          className="eagle-icon-trigger eagle-cart-trigger"
          aria-label={`Abrir carrinho com ${cartCount} itens`}
          onClick={onOpenCart}
        >
          <i className="ri-shopping-cart-2-line" />
          {cartCount > 0 && <span className="eagle-cart-count">{cartCount}</span>}
        </button>
      </div>
    </div>
  );
}

interface MenuProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate?: (route: string) => void;
}

export function Menu({ cartCount, onOpenCart, onNavigate }: MenuProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const splitTextsRef = useRef<SplitText[]>([]);
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, isOpen]);

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      'hop-menu',
      'M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1'
    );
  }, []);

  useLayoutEffect(() => {
    if (!menuRef.current) return;
    const menuEl = menuRef.current;

    splitTextsRef.current.forEach((s) => {
      if (s.revert) s.revert();
    });
    splitTextsRef.current = [];

    gsap.set(menuEl, { clipPath: 'circle(0% at 50% 50%)' });

    const headings = menuEl.querySelectorAll('h2');
    const paragraphs = menuEl.querySelectorAll('p');

    headings.forEach((h2) => {
      const split = SplitText.create(h2, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
      });
      gsap.set(split.lines, { y: '120%' });
      split.lines.forEach((line) => {
        (line as HTMLElement).style.pointerEvents = 'auto';
      });
      splitTextsRef.current.push(split);
    });

    paragraphs.forEach((p) => {
      const split = SplitText.create(p, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
      });
      gsap.set(split.lines, { y: '120%' });
      split.lines.forEach((line) => {
        (line as HTMLElement).style.pointerEvents = 'auto';
      });
      splitTextsRef.current.push(split);
    });

    isInitializedRef.current = true;
  }, []);

  const animateMenu = useCallback((open: boolean) => {
    if (!menuRef.current) return;
    const menuEl = menuRef.current;
    setIsAnimating(true);

    if (open) {
      document.body.classList.add('menu-open');
      gsap.to(menuEl, {
        clipPath: 'circle(100% at 50% 50%)',
        ease: 'power3.out',
        duration: 2,
        onStart: () => {
          menuEl.style.pointerEvents = 'all';
          splitTextsRef.current.forEach((split, index) => {
            gsap.to(split.lines, {
              y: '0%',
              stagger: 0.05,
              delay: 0.35 + index * 0.1,
              duration: 1,
              ease: 'power4.out',
            });
          });
        },
        onComplete: () => {
          setIsAnimating(false);
        },
      });
    } else {
      const tl = gsap.timeline({
        onStart: () => {
          gsap.to(menuEl, {
            clipPath: 'circle(0% at 50% 50%)',
            ease: 'power3.out',
            duration: 1,
            delay: 0.75,
            onComplete: () => {
              menuEl.style.pointerEvents = 'none';
              splitTextsRef.current.forEach((split) => {
                gsap.set(split.lines, { y: '120%' });
              });
              document.body.classList.remove('menu-open');
              setIsAnimating(false);
              setIsNavigating(false);
            },
          });
        },
      });

      splitTextsRef.current.forEach((split, index) => {
        tl.to(
          split.lines,
          {
            y: '-120%',
            stagger: 0.03,
            delay: index * 0.05,
            duration: 1,
            ease: 'power3.out',
          },
          0
        );
      });
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current) {
      animateMenu(isOpen);
    }
  }, [isOpen, animateMenu]);

  const toggleMenu = useCallback(() => {
    if (!isAnimating && isInitializedRef.current && !isNavigating) {
      setIsOpen((prev) => !prev);
    }
  }, [isAnimating, isNavigating]);

  return (
    <div>
      <MenuToggle
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />
      <div className="menu" ref={menuRef}>
        <div className="menu-wrapper">
          <div className="col col-1">
            <div className="links">
              <div className="link">
                <a
                  href="#page2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    onNavigate?.('#page2');
                  }}
                >
                  <h2>Lookbook</h2>
                </a>
              </div>
              <div className="link">
                <a
                  href="#instagram"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    onNavigate?.('#instagram');
                  }}
                >
                  <h2>Instagram</h2>
                </a>
              </div>
              <div className="link">
                <a
                  href="#catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    onNavigate?.('#page3');
                  }}
                >
                  <h2>Catálogo</h2>
                </a>
              </div>
              <div className="link">
                <a
                  href={`https://wa.me/${STORE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2>WhatsApp</h2>
                </a>
              </div>
            </div>
          </div>
          <div className="col col-2">
            <div className="socials">
              <div className="sub-col">
                <div className="menu-meta menu-commissions">
                  <p>Pedidos & Atendimento</p>
                  <p>{STORE_CONFIG.handle}</p>
                  <p>{STORE_CONFIG.whatsappDisplay}</p>
                </div>
                <div className="menu-meta">
                  <p>Envio & Entrega</p>
                  <p>Todo o Brasil via Correios / Transportadora</p>
                  <p>Prazo estimado: {STORE_CONFIG.previsaoEntrega}</p>
                </div>
              </div>
              <div className="sub-col">
                <div className="menu-meta">
                  <p>Pagamento</p>
                  <p>Pix com confirmação imediata</p>
                  <p>Cartão de Crédito e Débito</p>
                  <p>Instagram {STORE_CONFIG.handle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
