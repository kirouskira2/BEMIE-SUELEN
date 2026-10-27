import React from 'react';

interface SiteHeroProps {
  onExploreCatalog?: () => void;
}

/**
 * Hero Section Editorial Bemiê:
 * - Imagem panorâmica /assets/capa.jfif
 * - Caption FORA do media container: sobreposta no desktop via position absolute,
 *   abaixo da imagem no mobile via normal flow (não cobre o logo da foto)
 * - Linha vertical arquitetônica minimalista ao final da seção
 */
export const SiteHero = React.memo(function SiteHero({ onExploreCatalog }: SiteHeroProps) {
  return (
    <section className="hero site-hero numana-hero" aria-label="Bemiê Moda Praia">
      <div className="site-hero-media numana-hero-media">
        <img
          src="/assets/capa.jfif"
          alt="Bemiê Moda Praia — Compre pelo catálogo e finalize pelo WhatsApp"
          className="hero-img site-hero-img fade-in lazyloaded"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="780"
        />
      </div>

      {/* Caption FORA do media:
          - Desktop → position absolute sobre a imagem (via CSS)
          - Mobile  → flui normalmente abaixo da imagem (não cobre o logo) */}
      <div className="numana-hero-caption">
        <div className="numana-hero-copy">
          <span className="numana-hero-eyebrow">COLEÇÃO VERÃO 26/27</span>
          <div className="numana-hero-brand-group">
            <span className="numana-hero-brand-tag">MODA PRAIA</span>
            <span className="numana-hero-brand-sep" aria-hidden="true" />
            <span className="numana-hero-city">RECIFE</span>
          </div>
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
    </section>
  );
});
