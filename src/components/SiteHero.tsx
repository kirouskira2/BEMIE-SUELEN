import React from 'react';

interface SiteHeroProps {
  onExploreCatalog?: () => void;
}

/**
 * Hero Section Editorial Bemiê:
 * - Imagem panorâmica /assets/aistudio/c2d542cb-f2b1-4d6b-9294-8226318f1c76_9a9392ff.jpg
 * - Linha vertical arquitetônica minimalista inspirada em blank-canvas ao final da contagem/seção
 * - Moldura editorial e legenda com COMPRE PELO CATÁLOGO E FINALIZE PELO WHATSAPP
 */
export const SiteHero = React.memo(function SiteHero({ onExploreCatalog }: SiteHeroProps) {
  return (
    <section className="hero site-hero numana-hero" aria-label="Bemiê Moda Praia">
      <div className="site-hero-media numana-hero-media">
        <img
          src="/assets/aistudio/paa_e042e341.jfif"
          alt="Bemiê Moda Praia — Compre pelo catálogo e finalize pelo WhatsApp"
          className="hero-img site-hero-img lazyload fade-in lazyloaded"
        />
        <div className="placeholder-fade" aria-hidden="true" />

        {/* Efeito solar de verão leve e iluminado sobre a imagem */}
        <div className="site-hero-color-filter" aria-hidden="true" />
        <div className="site-hero-overlay numana-hero-overlay" aria-hidden="true" />
        <div className="numana-hero-frame" aria-hidden="true" />

        <div className="numana-hero-caption">
          <div className="numana-hero-copy">
            <span className="numana-hero-kicker">
              <span className="numana-hero-kicker-line" aria-hidden="true" />
              COLEÇÃO VERÃO 26/27 · MODA PRAIA AUTORAL
            </span>
            <p className="numana-hero-sub">
              COMPRE PELO CATÁLOGO E FINALIZE PELO WHATSAPP
            </p>
          </div>
          {onExploreCatalog && (
            <button
              type="button"
              className="numana-hero-btn"
              onClick={onExploreCatalog}
            >
              <span>EXPLORAR CATÁLOGO</span>
              <i className="ri-arrow-right-up-line" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Linha vertical minimalista inspirada em blank-canvas ao final da contagem */}
        <div className="bemie-hero-vertical-divider" aria-hidden="true">
          <span className="bemie-hero-vertical-line" />
        </div>
      </div>
    </section>
  );
});

