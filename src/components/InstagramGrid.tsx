import React, { useState } from 'react';
import { INSTAGRAM_FEED_ITEMS, STORE_CONFIG } from '../data/siteData';

interface InstagramGridProps {
  onSelectProduct?: (productId: string) => void;
}

/**
 * Grade horizontal de fotos do Instagram inspirada em numana.com.ar:
 * - Cabeçalho alinhado à esquerda com ícone do Instagram + handle `bemiemodapraia`
 * - Grade horizontal de 6 colunas com bordas retas (`border-radius: 0`)
 * - Efeito de carregamento e aparição idêntico a numana.com.ar (`data-transition="fade-in-up"`, `.lazyload.fade-in`, `.placeholder-fade`)
 */
export const InstagramGrid = React.memo(function InstagramGrid({ onSelectProduct }: InstagramGridProps) {
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  const markLoaded = (id: string) => {
    setLoadedMap((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  return (
    <section
      id="instagram"
      className="numana-instafeed-section"
      aria-label="Instagram Bemiê Moda Praia"
    >
      <div className="numana-instafeed-header" data-transition="fade-in-up">
        <a
          href={STORE_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="numana-instafeed-handle"
          aria-label="Visitar perfil @bemiemodapraia no Instagram"
        >
          <i className="ri-instagram-line" aria-hidden="true" />
          <span>bemiemodapraia</span>
        </a>
      </div>

      <div className="numana-instafeed-grid">
        {INSTAGRAM_FEED_ITEMS.map((item) => {
          const isLoaded = loadedMap[item.id] !== false;
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`numana-instafeed-item js-scroll-trigger${isLoaded ? ' is-loaded' : ''}`}
              data-transition="fade-in-up"
              aria-label={item.alt}
              onClick={(e) => {
                if (onSelectProduct && e.altKey) {
                  e.preventDefault();
                  onSelectProduct(item.productId);
                }
              }}
            >
              <img
                src={item.image}
                alt={item.alt}
                className={`numana-instafeed-img textbanner-image-effect lazyload fade-in${
                  isLoaded ? ' lazyloaded' : ''
                }`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => markLoaded(item.id)}
                onError={() => markLoaded(item.id)}
              />
              <div className="placeholder-fade" aria-hidden="true" />
              <div className="numana-instafeed-overlay">
                <i className="ri-instagram-line" aria-hidden="true" />
                {item.caption && (
                  <span className="numana-instafeed-caption">{item.caption}</span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
});
