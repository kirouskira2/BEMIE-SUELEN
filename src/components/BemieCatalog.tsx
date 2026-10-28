import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BEMIE_PRODUCTS } from '../data/siteData';
import {
  calculateProductOffer,
  calculateCardInstallments,
  formatBrl,
  CatalogFilterKey,
  filterCatalogProducts,
  matchesCatalogStyleFilter,
  normalizeSearchText,
  getStockForSize,
} from '../utils/animationMath';
import { ProductImageZoom } from './ProductImageZoom';

interface BemieCatalogProps {
  onAddToCart: (productId: string, size: string) => void;
  selectedCategoryFilter?: CatalogFilterKey;
  onCategoryFilterChange?: (filter: CatalogFilterKey) => void;
  highlightedProductId?: string | null;
}

const STYLE_TAG_CONFIG: { key: CatalogFilterKey; label: string }[] = [
  { key: 'todas', label: 'TODAS' },
  { key: 'asa-delta', label: 'ASA DELTA' },
  { key: 'marquinha', label: 'MARQUINHA' },
  { key: 'alca-dupla', label: 'ALÇA DUPLA' },
  { key: 'biquini', label: 'BIQUÍNIS' },
  { key: 'maio', label: 'MAIÔS' },
  { key: 'ofertas', label: 'OFERTAS -20%' },
];

export interface BemieProductCardProps {
  product: (typeof BEMIE_PRODUCTS)[0];
  index: number;
  selSize: string;
  manualPhotoIdx?: number;
  isCardHovered: boolean;
  isHighlighted: boolean;
  onAddToCart: (productId: string, size: string) => void;
  onSelectSize: (productId: string, size: string) => void;
  onSelectPhoto: (productId: string, photoIdx: number) => void;
  onMouseEnter: (productId: string) => void;
  onMouseLeave: (productId: string) => void;
  onStyleBadgeClick: (tag: string) => void;
}

/**
 * BemieProductCard memoizado para alta taxa de quadros e estabilidade de renderização durante scroll.
 * O recálculo de descontos e parcelas é mantido estável via useMemo.
 */
export const BemieProductCard = React.memo(function BemieProductCard({
  product,
  index,
  selSize,
  manualPhotoIdx,
  isCardHovered,
  isHighlighted,
  onAddToCart,
  onSelectSize,
  onSelectPhoto,
  onMouseEnter,
  onMouseLeave,
  onStyleBadgeClick,
}: BemieProductCardProps) {
  const offer = useMemo(() => calculateProductOffer(product), [product]);
  const cardInstallments = useMemo(
    () => calculateCardInstallments(offer.current, 2),
    [offer.current]
  );
  const isSoldOut = useMemo(
    () => product.tamanhos.every((sz) => sz.q <= 0),
    [product.tamanhos]
  );
  const selSizeStock = useMemo(
    () => getStockForSize(product.tamanhos, selSize),
    [product.tamanhos, selSize]
  );

  const photoIdx =
    manualPhotoIdx !== undefined
      ? manualPhotoIdx
      : isCardHovered && product.photos.length > 1
      ? 1
      : 0;
  const currentPhoto = product.photos[photoIdx] || product.photos[0];

  return (
    <article
      className={`child numana-product-card js-product-container js-scroll-trigger${
        product.photos.length > 1 ? ' product-item-secondary-images-loaded' : ''
      }${isHighlighted ? ' is-highlighted-child' : ''}${
        isSoldOut ? ' is-soldout' : ''
      }`}
      id={`child${index + 1}`}
      data-product-id={product.id}
      data-transition="fade-in-up"
      onMouseEnter={() => onMouseEnter(product.id)}
      onMouseLeave={() => onMouseLeave(product.id)}
    >
      <div className={`child-media-wrap${isSoldOut ? ' is-soldout' : ''}`}>
        <ProductImageZoom
          src={currentPhoto}
          alt={product.nome}
          zoomScale={1.35}
          className={isSoldOut ? 'bemie-soldout-img' : ''}
          containerClassName={isSoldOut ? 'is-soldout' : ''}
        />
        {isSoldOut ? (
          <span className="bemie-soldout-pill child-badge">ESGOTADO</span>
        ) : offer.active ? (
          <span className="bemie-discount-pill child-badge">
            -{offer.percent}% OFF
          </span>
        ) : null}
      </div>

      {product.photos.length > 1 && (
        <div
          className="bemie-grid-thumbs"
          role="tablist"
          aria-label={`Fotos de ${product.nome}`}
        >
          {product.photos.map((ph, idx) => (
            <button
              key={ph}
              type="button"
              role="tab"
              aria-selected={(manualPhotoIdx ?? 0) === idx}
              aria-label={`Foto ${idx + 1} de ${product.nome}`}
              className={`bemie-grid-thumb-dot bemie-grid-thumb-preview ${
                (manualPhotoIdx ?? 0) === idx ? 'active' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPhoto(product.id, idx);
              }}
            >
              <img
                src={ph}
                alt=""
                aria-hidden="true"
                className="bemie-grid-thumb-img lazyload fade-in lazyloaded"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <div className="childInfo numana-card-info">
        {/* Linha superior: Nome uppercase + botão de sacola */}
        <div className="numana-card-head-row">
          <span className="child-title">{product.nome}</span>
          <button
            type="button"
            className="numana-card-bag-btn"
            disabled={isSoldOut || selSizeStock <= 0}
            aria-label={
              isSoldOut
                ? `${product.nome} esgotado`
                : `Adicionar ${product.nome} (${selSize}) ao carrinho`
            }
            title={
              isSoldOut
                ? `${product.nome} esgotado`
                : `Adicionar ${product.nome} (${selSize}) ao carrinho`
            }
            onClick={() => {
              if (!isSoldOut && selSizeStock > 0) {
                onAddToCart(product.id, selSize);
              }
            }}
          >
            <svg
              width="15"
              height="17"
              viewBox="0 0 20 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <path d="M3 6H17L18 20H2L3 6Z" />
              <path d="M6.5 6V4.5C6.5 2.567 8.067 1 10 1C11.933 1 13.5 2.567 13.5 4.5V6" />
            </svg>
          </button>
        </div>

        {/* Linha de preço principal */}
        <div className="child-price-line numana-price-line">
          {offer.active && (
            <span className="bemie-price-old">{formatBrl(offer.original)}</span>
          )}
          <span className="child-price">{formatBrl(offer.current)}</span>
        </div>

        {/* Parcelamento no cartão */}
        <p className="numana-transfer-price">
          {cardInstallments.label}
        </p>

        {product.estilos && product.estilos.length > 0 && (
          <div className="child-style-tags" aria-label="Estilos da peça">
            {product.estilos.map((tag) => (
              <button
                key={tag}
                type="button"
                className="child-style-tag-pill"
                onClick={() => onStyleBadgeClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="child-controls numana-card-controls">
          <div className="bemie-size-picker">
            {product.tamanhos.map((sz) => (
              <button
                key={sz.t}
                type="button"
                disabled={sz.q <= 0}
                aria-label={`Tamanho ${sz.t} para ${product.nome}`}
                className={`bemie-size-btn ${selSize === sz.t ? 'active' : ''}`}
                onClick={() => onSelectSize(product.id, sz.t)}
              >
                {sz.t}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="bemie-child-buy-btn"
            disabled={isSoldOut || selSizeStock <= 0}
            onClick={() => onAddToCart(product.id, selSize)}
          >
            {isSoldOut ? 'ESGOTADO' : selSizeStock <= 0 ? 'TAMANHO ESGOTADO' : `COMPRAR · ${selSize}`}
          </button>
        </div>
      </div>
    </article>
  );
});

export const BemieCatalog = React.memo(function BemieCatalog({
  onAddToCart,
  selectedCategoryFilter,
  onCategoryFilterChange,
  highlightedProductId,
}: BemieCatalogProps) {
  const [internalFilter, setInternalFilter] = useState<CatalogFilterKey>('todas');
  const activeFilter = selectedCategoryFilter ?? internalFilter;

  const setActiveFilter = useCallback(
    (next: CatalogFilterKey) => {
      setInternalFilter(next);
      onCategoryFilterChange?.(next);
    },
    [onCategoryFilterChange]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategoryFilter) {
      setInternalFilter(selectedCategoryFilter);
      setSearchQuery('');
    }
  }, [selectedCategoryFilter]);

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    BEMIE_PRODUCTS.forEach((p) => {
      const avail = p.tamanhos.find((s) => s.q > 0);
      map[p.id] = avail ? avail.t : p.tamanhos[0]?.t || 'P';
    });
    return map;
  });
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});

  const counts = useMemo(() => {
    const result: Record<CatalogFilterKey, number> = {
      todas: BEMIE_PRODUCTS.length,
      'asa-delta': 0,
      marquinha: 0,
      'alca-dupla': 0,
      biquini: 0,
      maio: 0,
      saida: 0,
      estruturado: 0,
      ofertas: 0,
    };
    (Object.keys(result) as CatalogFilterKey[]).forEach((key) => {
      if (key !== 'todas') {
        result[key] = BEMIE_PRODUCTS.filter((p) => matchesCatalogStyleFilter(p, key)).length;
      }
    });
    return result;
  }, []);

  const filteredProducts = useMemo(() => {
    return filterCatalogProducts(BEMIE_PRODUCTS, activeFilter, searchQuery);
  }, [activeFilter, searchQuery]);

  const handleStyleBadgeClick = useCallback(
    (tagLabel: string) => {
      const norm = normalizeSearchText(tagLabel);
      if (norm === 'biquini') {
        setActiveFilter('biquini');
        setSearchQuery('');
      } else if (norm === 'maio') {
        setActiveFilter('maio');
        setSearchQuery('');
      } else if (norm.includes('saida')) {
        setActiveFilter('saida');
        setSearchQuery('');
      } else if (norm.includes('alca dupla')) {
        setActiveFilter('alca-dupla');
        setSearchQuery('');
      } else if (norm.includes('asa delta') || norm.includes('meia-taca')) {
        setActiveFilter('asa-delta');
        setSearchQuery('');
      } else if (norm.includes('marquinha') || norm.includes('cortininha')) {
        setActiveFilter('marquinha');
        setSearchQuery('');
      } else {
        setActiveFilter('todas');
        setSearchQuery(tagLabel);
      }
    },
    [setActiveFilter]
  );

  const handleSelectSize = useCallback((productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  }, []);

  const handleSelectPhoto = useCallback((productId: string, photoIdx: number) => {
    setActivePhotoIndex((prev) => ({ ...prev, [productId]: photoIdx }));
  }, []);

  const handleCardMouseEnter = useCallback((productId: string) => {
    setHoveredProductId(productId);
  }, []);

  const handleCardMouseLeave = useCallback((productId: string) => {
    setHoveredProductId((prev) => (prev === productId ? null : prev));
  }, []);

  return (
    <div className="bemie-catalog-section numana-catalog-section">
      <div className="container numana-catalog-container">
        <div className="bemie-catalog-header numana-catalog-header">
          <div className="bemie-catalog-title-block numana-catalog-title-block">
            <p className="bemie-eyebrow numana-eyebrow">CATÁLOGO COMPLETO · PRONTA ENTREGA</p>
            <h2>COLEÇÃO BEMIÊ MODA PRAIA</h2>
          </div>

          <div className="bemie-catalog-toolbar numana-catalog-toolbar">
            <div className="bemie-filter-pills" role="tablist" aria-label="Filtrar por estilo">
              {STYLE_TAG_CONFIG.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  data-filter-key={tab.key}
                  aria-selected={activeFilter === tab.key}
                  className={`bemie-filter-chip ${activeFilter === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label} ({counts[tab.key]})
                </button>
              ))}
            </div>

            <div className="bemie-search-wrap">
              <label htmlFor="bemie-catalog-search" className="sr-only">
                Buscar produtos por estilo, modelo ou cor
              </label>
              <div className="bemie-search-input-box">
                <span className="bemie-search-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <path
                      d="M20 20L16.35 16.35"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
                <input
                  id="bemie-catalog-search"
                  type="search"
                  placeholder="BUSCAR POR BIQUÍNI, MAIÔ, SAÍDA OU COR…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bemie-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="bemie-search-clear"
                    aria-label="Limpar busca"
                    onClick={() => setSearchQuery('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div id="page3" className="bemie-eagle-page3 numana-catalog-grid">
          {filteredProducts.length === 0 ? (
            <div className="bemie-catalog-empty">
              <p className="bemie-catalog-empty-title">
                Nenhuma peça encontrada para &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="bemie-catalog-empty-sub">
                Tente buscar por outro estilo (Biquíni, Maiô, Saída de Praia), cor ou explore todas as categorias da coleção.
              </p>
              <button
                type="button"
                className="bemie-child-buy-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('todas');
                }}
              >
                LIMPAR BUSCA E VER TODAS ({counts.todas})
              </button>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <BemieProductCard
                key={product.id}
                product={product}
                index={index}
                selSize={selectedSizes[product.id] || 'P'}
                manualPhotoIdx={activePhotoIndex[product.id]}
                isCardHovered={hoveredProductId === product.id}
                isHighlighted={highlightedProductId === product.id}
                onAddToCart={onAddToCart}
                onSelectSize={handleSelectSize}
                onSelectPhoto={handleSelectPhoto}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                onStyleBadgeClick={handleStyleBadgeClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
});
