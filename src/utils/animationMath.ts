/**
 * Pure layout, animation, and store calculation math.
 */

export interface SizeStock {
  t: string;
  q: number;
}

export interface ProductOfferInput {
  preco: number;
  ofertaTipo?: string;
  descontoPercentual?: number;
  precoPromocional?: number;
}

export interface ProductOfferResult {
  active: boolean;
  type: 'desconto' | 'promocao' | 'nenhuma';
  original: number;
  current: number;
  percent: number;
}

/**
 * Calculates the expanded width of the active client item in `.clients-list`.
 * Original minified formula in `j`:
 * `let e = l.current.offsetWidth, t = A.length - 1; return `${e - 16 - 48 * t - 4 * t}px``
 */
export function calculateExpandedClientWidth(
  containerOffsetWidth: number | null | undefined,
  totalClients: number
): string {
  if (!containerOffsetWidth || containerOffsetWidth <= 0) {
    return '10rem';
  }
  const inactiveCount = Math.max(0, totalClients - 1);
  const pixels = containerOffsetWidth - 16 - 48 * inactiveCount - 4 * inactiveCount;
  return `${pixels}px`;
}

/**
 * Determines whether the fixed `.top-bar` should hide (`-offsetHeight`), show (`0`),
 * or remain unchanged based on current and previous scrollY positions.
 */
export function getTopBarTargetY(
  currentScrollY: number,
  lastScrollY: number,
  topBarHeight: number
): number | null {
  const direction = currentScrollY > lastScrollY ? 1 : -1;
  if (direction === 1 && currentScrollY > 50) {
    return -topBarHeight;
  }
  if (direction === -1) {
    return 0;
  }
  return null;
}

/**
 * Checks whether the current viewport is within the catalog section bounds.
 */
export function isViewportInCatalog(
  catalogRect: { top: number; bottom: number } | null | undefined,
  headerThresholdPx = 140
): boolean {
  if (!catalogRect) return false;
  return catalogRect.top <= headerThresholdPx && catalogRect.bottom >= headerThresholdPx;
}

/**
 * Determines whether the navigation bar ("sidebar" / top notch and bottom menu pill)
 * should be hidden across all sections of the site using the catalog scroll-visibility logic:
 * - Visible (`false`) ONLY when actively scrolling up (`isScrollingUp && !isScrollingStopped`)
 *   or while hovered (`isHovered`).
 * - Hidden (`true`) when stationary (`isScrollingStopped`), scrolling down (`!isScrollingUp`),
 *   or during programmatic navigation (`isProgrammaticNav`), in any section of the page.
 */
export function computeCatalogSidebarHidden(params: {
  isInCatalog?: boolean;
  isScrollingUp: boolean;
  isScrollingStopped: boolean;
  isHovered?: boolean;
  isProgrammaticNav?: boolean;
  hoverOnly?: boolean;
}): boolean {
  if (params.isHovered) {
    return false;
  }
  if (params.hoverOnly) {
    return true;
  }
  if (params.isProgrammaticNav) {
    return true;
  }
  if (params.isScrollingUp && !params.isScrollingStopped) {
    return false;
  }
  return true;
}


/**
 * Computes the 3D perspective interpolation state for `.featured-project-card-inner`
 * across scroll progress [0, 1].
 */
export function computeCardTransform(progress: number): {
  yPercent: number;
  z: number;
  rotationX: number;
} {
  const clamped = Math.max(0, Math.min(1, progress));
  return {
    yPercent: -50 * clamped || 0,
    z: -250 * clamped || 0,
    rotationX: 45 * clamped || 0,
  };
}

/**
 * Resolves internal CTA and navigation routes to their corresponding target section selectors on the page.
 */
export function resolveRouteTargetSelector(route: string): string {
  const trimmed = route.trim();
  const normalized = trimmed.replace(/^\/+/, '').toLowerCase();
  switch (normalized) {
    case '':
    case 'top':
    case 'hero':
    case '.site-hero':
      return '.site-hero';
    case '#page2':
    case 'page2':
    case 'lookbook':
      return '#page2';
    case 'studio':
    case 'colecao':
    case 'featured':
    case '.featured-projects-container':
    case 'blueprints':
    case 'catalog':
    case 'catalogo':
    case '#page3':
    case 'page3':
    case '.bemie-catalog-section':
      return '.bemie-catalog-section';
    case 'connect':
    case '.cta-window':
      return '.cta-window';
    case 'instagram':
    case '#instagram':
    case '.numana-instafeed-section':
      return '.numana-instafeed-section';
    default:
      return '#page2';
  }
}

/**
 * Formats a Brazilian CEP string (`00000-000`).
 */
export function formatCep(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

/**
 * Formats a Brazilian phone number (`(81) 99999-9999`).
 */
export function formatBrazilPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Calculates product sale price and active offer from Bemiê store state (`offerFor` in `loja.html`).
 */
export function calculateProductOffer(p: ProductOfferInput): ProductOfferResult {
  const original = Math.max(0, Number(p.preco) || 0);
  const type =
    p.ofertaTipo === 'desconto' || p.ofertaTipo === 'promocao' ? p.ofertaTipo : 'nenhuma';

  if (type === 'desconto') {
    const percent = Math.min(99, Math.max(1, Math.round(Number(p.descontoPercentual) || 0)));
    if (percent > 0 && original > 0) {
      return {
        active: true,
        type,
        original,
        current: Math.round(original * (1 - percent / 100) * 100) / 100,
        percent,
      };
    }
  }

  if (type === 'promocao') {
    const current = Math.max(0, Number(p.precoPromocional) || 0);
    if (current > 0 && current < original) {
      return { active: true, type, original, current, percent: 0 };
    }
  }

  return { active: false, type: 'nenhuma', original, current: original, percent: 0 };
}

/**
 * Calculates clamped transform-origin percentages (0% - 100%) for smooth product zoom inspection.
 */
export function calculateZoomOrigin(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number }
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) return { x: 50, y: 50 };
  const rawX = ((clientX - rect.left) / rect.width) * 100;
  const rawY = ((clientY - rect.top) / rect.height) * 100;
  return {
    x: Math.round(Math.max(0, Math.min(100, rawX)) * 10) / 10,
    y: Math.round(Math.max(0, Math.min(100, rawY)) * 10) / 10,
  };
}

/**
 * Formats a number as BRL currency (`R$ 143,84`).
 */
export function formatBrl(value: number): string {
  return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Computes Pix transfer price and interest-free installments in the Numana catalog style
 * (e.g., "R$ 136,65 com Pix · 3x de R$ 47,95 sem juros").
 */
export function calculatePixAndInstallments(
  currentPrice: number,
  pixDiscountPercent = 5,
  installmentsCount = 3
): {
  pixPrice: number;
  installmentValue: number;
  installmentsCount: number;
  pixLabel: string;
} {
  const safePrice = Math.max(0, Number(currentPrice) || 0);
  const safeDiscount = Math.min(50, Math.max(0, Number(pixDiscountPercent) || 0));
  const safeCount = Math.max(1, Math.round(Number(installmentsCount) || 1));
  const pixPrice = Math.round(safePrice * (1 - safeDiscount / 100) * 100) / 100;
  const installmentValue = Math.round((safePrice / safeCount) * 100) / 100;
  return {
    pixPrice,
    installmentValue,
    installmentsCount: safeCount,
    pixLabel: `${formatBrl(pixPrice)} com Pix`,
  };
}

/**
 * Returns the available stock for a given size token.
 */
export function getStockForSize(tamanhos: SizeStock[], size: string): number {
  const found = tamanhos.find((s) => s.t.toUpperCase() === size.toUpperCase());
  return found ? Math.max(0, found.q) : 0;
}

/**
 * Builds the WhatsApp checkout URL for Bemiê Moda Praia (`5581971041702`).
 */
export function buildWhatsAppOrderUrl(
  whatsappNumber: string,
  items: { nome: string; cor?: string; tamanho: string; qty: number; unitPrice: number }[],
  customer?: {
    nome?: string;
    telefone?: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    complemento?: string;
    pagamento?: string;
  }
): string {
  const cleanPhone = whatsappNumber.replace(/\D/g, '') || '5581971041702';
  const total = items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
  const lines: string[] = [
    'Olá, *Bemiê Moda Praia*! 🌊 Gostaria de finalizar meu pedido:',
    '',
    ...items.map(
      (i) =>
        `• ${i.qty}x *${i.nome}* (Tam: ${i.tamanho}${i.cor ? ` · ${i.cor}` : ''}) — ${formatBrl(
          i.unitPrice * i.qty
        )}`
    ),
    '',
    `*Total:* ${formatBrl(total)}`,
  ];

  if (customer?.nome) {
    lines.push('', `*Cliente:* ${customer.nome}`);
  }
  if (customer?.telefone?.trim()) {
    lines.push(`*Contato:* ${customer.telefone.trim()}`);
  }
  if (customer?.endereco || customer?.cidade || customer?.cep) {
    const addrParts = [
      customer.endereco,
      customer.numero ? `nº ${customer.numero}` : '',
      customer.complemento,
      customer.bairro,
      customer.cidade,
      customer.cep ? `CEP ${customer.cep}` : '',
    ].filter(Boolean);
    lines.push(`*Entrega:* ${addrParts.join(', ')}`);
  }
  if (customer?.pagamento) {
    const payMap: Record<string, string> = {
      pix: 'Pix',
      credito: 'Cartão de Crédito',
      debito: 'Cartão de Débito',
    };
    lines.push(`*Pagamento:* ${payMap[customer.pagamento] || customer.pagamento}`);
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export type CatalogFilterKey =
  | 'todas'
  | 'asa-delta'
  | 'marquinha'
  | 'alca-dupla'
  | 'biquini'
  | 'maio'
  | 'saida'
  | 'estruturado'
  | 'ofertas';

export interface CatalogFilterableProduct {
  id: string;
  nome: string;
  cor?: string;
  categoria?: string;
  styleTag?: string;
  ofertaTipo?: string;
  estilos?: string[];
  description?: string;
}

/**
 * Normalizes a string for accent-insensitive, case-insensitive search matching.
 * E.g. "Biquíni" -> "biquini", "Maiô" -> "maio", "Saída de Praia" -> "saida de praia".
 */
export function normalizeSearchText(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Checks whether a product matches a given CatalogFilterKey ('todas', 'asa-delta', 'marquinha', 'alca-dupla', 'biquini', 'maio', 'saida', etc.).
 */
export function matchesCatalogStyleFilter(
  product: CatalogFilterableProduct,
  filterKey: CatalogFilterKey
): boolean {
  if (filterKey === 'todas') return true;
  if (filterKey === 'ofertas') return product.ofertaTipo === 'desconto';
  if (filterKey === 'marquinha') return product.styleTag === 'marquinha';
  if (filterKey === 'estruturado') return product.styleTag === 'estruturado';

  const normalizedTags = (product.estilos || []).map(normalizeSearchText);
  const normalizedCategory = normalizeSearchText(product.categoria || '');
  const normalizedName = normalizeSearchText(product.nome || '');
  const normalizedDesc = normalizeSearchText(product.description || '');

  if (filterKey === 'asa-delta') {
    return (
      normalizedName.includes('asa delta') ||
      normalizedDesc.includes('asa delta') ||
      normalizedTags.some((t) => t.includes('asa delta')) ||
      product.styleTag === 'estruturado'
    );
  }

  if (filterKey === 'alca-dupla') {
    return (
      normalizedName.includes('alca dupla') ||
      normalizedDesc.includes('alca dupla') ||
      normalizedDesc.includes('tiras duplas') ||
      normalizedTags.some((t) => t.includes('alca dupla'))
    );
  }

  if (filterKey === 'biquini') {
    return (
      normalizedCategory === 'biquinis' ||
      normalizedTags.some((t) => t.includes('biquini'))
    );
  }
  if (filterKey === 'maio') {
    return (
      normalizedCategory === 'maios' ||
      normalizedTags.some((t) => t.includes('maio'))
    );
  }
  if (filterKey === 'saida') {
    return (
      normalizedCategory === 'saidas' ||
      normalizedTags.some((t) => t.includes('saida'))
    );
  }
  return true;
}

const PRIMARY_PRODUCT_BY_FILTER: Partial<Record<CatalogFilterKey, string>> = {
  'asa-delta': 'p_bayopyq5',
  marquinha: 'p_icbso4d4',
  'alca-dupla': 'p_wnba68hp',
};

/**
 * Filters a list of catalog products by active style tag filter and free-text search query.
 * When filtering by one of the 3 lookbook categories ('asa-delta', 'marquinha', 'alca-dupla'),
 * places that category's signature bikini first in the grid.
 */
export function filterCatalogProducts<T extends CatalogFilterableProduct>(
  products: T[],
  filterKey: CatalogFilterKey,
  searchQuery: string
): T[] {
  const q = normalizeSearchText(searchQuery);

  const matched = products.filter((product) => {
    if (!matchesCatalogStyleFilter(product, filterKey)) {
      return false;
    }

    if (!q) {
      return true;
    }

    const haystack = [
      product.nome,
      product.cor || '',
      product.description || '',
      ...(product.estilos || []),
    ]
      .map(normalizeSearchText)
      .join(' ');

    return haystack.includes(q);
  });

  const primaryId = PRIMARY_PRODUCT_BY_FILTER[filterKey];
  if (primaryId && matched.length > 1) {
    return [...matched].sort((a, b) => {
      if (a.id === primaryId) return -1;
      if (b.id === primaryId) return 1;
      return 0;
    });
  }

  return matched;
}

export const CATEGORY_REEL_SWITCH_INTERVAL_MS = 7000;

export interface CategoryReelConfig {
  id: 'elem1' | 'elem2' | 'elem3';
  categoryBold: 'ASA DELTA' | 'MARQUINHA' | 'ALÇA DUPLA';
  catalogFilter: CatalogFilterKey;
  primaryProductId: string;
  shortcode: string;
  reelUrl: string;
  videoSrc: string;
  reelUrls: string[];
  videoSources: string[];
}

const ASA_DELTA_REEL_CONFIG: CategoryReelConfig = {
  id: 'elem1',
  categoryBold: 'ASA DELTA',
  catalogFilter: 'asa-delta',
  primaryProductId: 'p_bayopyq5',
  shortcode: 'Dc3unyiRadO',
  reelUrl: 'https://www.instagram.com/p/Dc3unyiRadO/',
  videoSrc: '/bemie/reels/reel-asa-delta.mp4',
  reelUrls: [
    'https://www.instagram.com/p/Dc3unyiRadO/',
    'https://www.instagram.com/reel/DdWsBQBxr6W/',
  ],
  videoSources: [
    '/bemie/reels/reel-asa-delta.mp4',
    '/bemie/reels/reel-asa-delta-2.mp4',
  ],
};

const MARQUINHA_REEL_CONFIG: CategoryReelConfig = {
  id: 'elem2',
  categoryBold: 'MARQUINHA',
  catalogFilter: 'marquinha',
  primaryProductId: 'p_icbso4d4',
  shortcode: 'De4hjmLxfzK',
  reelUrl: 'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
  videoSrc: '/bemie/reels/reel-marquinha.mp4',
  reelUrls: [
    'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
    'https://www.instagram.com/reel/DdEXoszxKeA/',
  ],
  videoSources: [
    '/bemie/reels/reel-marquinha.mp4',
    '/bemie/reels/reel-marquinha-2.mp4',
  ],
};

const ALCA_DUPLA_REEL_CONFIG: CategoryReelConfig = {
  id: 'elem3',
  categoryBold: 'ALÇA DUPLA',
  catalogFilter: 'alca-dupla',
  primaryProductId: 'p_wnba68hp',
  shortcode: 'DdpIwAPvjp8',
  reelUrl: 'https://www.instagram.com/p/DdpIwAPvjp8/',
  videoSrc: '/bemie/reels/reel-alca-dupla.mp4',
  reelUrls: ['https://www.instagram.com/p/DdpIwAPvjp8/'],
  videoSources: ['/bemie/reels/reel-alca-dupla.mp4'],
};

export const CATEGORY_REEL_MAP: Record<string, CategoryReelConfig> = {
  'asa delta': ASA_DELTA_REEL_CONFIG,
  'asa-delta': ASA_DELTA_REEL_CONFIG,
  elem1: ASA_DELTA_REEL_CONFIG,
  marquinha: MARQUINHA_REEL_CONFIG,
  elem2: MARQUINHA_REEL_CONFIG,
  'alca dupla': ALCA_DUPLA_REEL_CONFIG,
  'alca-dupla': ALCA_DUPLA_REEL_CONFIG,
  elem3: ALCA_DUPLA_REEL_CONFIG,
};

/**
 * Resolves the Instagram Reel configuration (URL, shortcode, local MP4 stream, catalogFilter, primaryProductId)
 * for the Lookbook categories ('ASA DELTA', 'MARQUINHA', 'ALÇA DUPLA') or column IDs ('elem1', 'elem2', 'elem3').
 */
export function getCategoryReelConfig(categoryOrId: string): CategoryReelConfig | null {
  const key = normalizeSearchText(categoryOrId);
  return CATEGORY_REEL_MAP[key] || null;
}

/**
 * Returns the next video index when cycling through a category's reel list.
 */
export function getNextCategoryReelIndex(currentIndex: number, totalSources: number): number {
  if (totalSources <= 1) return 0;
  return (Math.max(0, currentIndex) + 1) % totalSources;
}

/**
 * Resolves the active Reel source and URL for a category at a given elapsed time (alternating every 7 seconds).
 */
export function getActiveCategoryReelByElapsedMs(
  categoryOrId: string,
  elapsedMs: number,
  intervalMs = CATEGORY_REEL_SWITCH_INTERVAL_MS
): { index: number; videoSrc: string; reelUrl: string } | null {
  const cfg = getCategoryReelConfig(categoryOrId);
  if (!cfg) return null;
  const total = cfg.videoSources.length;
  if (total <= 1 || intervalMs <= 0) {
    return { index: 0, videoSrc: cfg.videoSrc, reelUrl: cfg.reelUrl };
  }
  const steps = Math.floor(Math.max(0, elapsedMs) / intervalMs);
  const index = steps % total;
  return {
    index,
    videoSrc: cfg.videoSources[index] || cfg.videoSrc,
    reelUrl: cfg.reelUrls[index] || cfg.reelUrl,
  };
}

/**
 * Determines whether the category Reel video should be actively playing and visible.
 * Plays automatically and continuously without requiring mouse hover (`isCardHovered` not required),
 * pausing/hiding only while the user hovers a specific mini product angle thumbnail (`isPreviewingProductThumb`).
 */
export function shouldPlayCategoryReel(params?: {
  isCardHovered?: boolean;
  isPreviewingProductThumb?: boolean;
}): boolean {
  return !params?.isPreviewingProductThumb;
}

/**
 * Determines whether the decorative mouse ball cursor (#cursor) should be visible.
 * Always disabled inside the catalog section (`isInCatalog: true`) and over interactive controls.
 */
export function shouldShowMouseBallCursor(params: {
  isInCatalog: boolean;
  isInLookbookCard: boolean;
  isOverInteractiveControl: boolean;
}): boolean {
  if (params.isInCatalog) {
    return false;
  }
  if (params.isOverInteractiveControl) {
    return false;
  }
  return Boolean(params.isInLookbookCard);
}

/**
 * Calculates topbar / navigation visibility based on scroll direction.
 * In accordance with user preference:
 * - Hidden when scrolling down (ao descer o scroll sumir o sidebar)
 * - Shown when scrolling up (ao subir o scroll aparecer o sidebar)
 * - Always shown at page top (scrollY <= topAnchor)
 */
export function computeHeaderVisibility(
  currentScrollY: number,
  lastScrollY: number,
  prevVisibility: boolean,
  threshold = 6,
  topAnchor = 15
): { isVisible: boolean; nextLastScrollY: number } {
  const current = Math.max(0, currentScrollY);
  if (current <= topAnchor) {
    return { isVisible: true, nextLastScrollY: current };
  }
  const diff = current - lastScrollY;
  if (Math.abs(diff) < threshold) {
    return { isVisible: prevVisibility, nextLastScrollY: lastScrollY };
  }
  // User: "agora é ao contrario, quando descer o scroll sumir o sidebar e quando subir aparecer"
  // Scrolling down (diff > 0): hidden
  // Scrolling up (diff < 0): visible
  return { isVisible: diff < 0, nextLastScrollY: current };
}

/**
 * Calculates symmetrical layout coordinates for the preloader brand words and vertical divider line.
 * Guarantees that the vertical line at 50% screen width sits precisely in the center
 * between word 1 ("Bemiê") on the left and word 2 ("Moda Praia") on the right.
 */
export function calculateLoaderBrandDividerLayout(viewportWidth: number, paddingPx = 24) {
  const dividerX = Number((viewportWidth * 0.5).toFixed(2));
  const word1RightEdge = Number((dividerX - paddingPx).toFixed(2));
  const word2LeftEdge = Number((dividerX + paddingPx).toFixed(2));
  const gapBetweenWords = Number((word2LeftEdge - word1RightEdge).toFixed(2));
  const distanceWord1ToDivider = Number((dividerX - word1RightEdge).toFixed(2));
  const distanceWord2ToDivider = Number((word2LeftEdge - dividerX).toFixed(2));

  return {
    dividerX,
    word1RightEdge,
    word2LeftEdge,
    gapBetweenWords,
    distanceWord1ToDivider,
    distanceWord2ToDivider,
    isSymmetricallyCentered: distanceWord1ToDivider === distanceWord2ToDivider,
  };
}

export const NUMANA_TRANSITION_CONFIG = {
  dataTransitionAttr: 'fade-in-up',
  inViewportClass: 'is-inViewport',
  fadeInUpDurationMs: 1000,
  fadeInUpTranslateYPx: 30,
  imageFadeDurationMs: 200,
  bannerScaleDurationMs: 800,
  placeholderClass: 'placeholder-fade',
} as const;

/**
 * Generates exact Numana (https://numana.com.ar/) image & container classes
 * for progressive lazy-loading, blur-up, fade-in, and secondary hover image swap.
 */
export function getNumanaImageRevealClasses(params: {
  isLoaded: boolean;
  isInViewport?: boolean;
  isSecondary?: boolean;
  isBanner?: boolean;
}): {
  containerTransitionClass: string;
  imageClass: string;
  placeholderVisible: boolean;
} {
  const containerTransitionClass = params.isInViewport
    ? NUMANA_TRANSITION_CONFIG.inViewportClass
    : '';

  const imgParts = ['lazyload', 'fade-in'];
  if (params.isBanner) {
    imgParts.push('textbanner-image-effect');
  } else if (params.isSecondary) {
    imgParts.push('product-item-image-secondary', 'item-image-secondary');
  } else {
    imgParts.push('product-item-image-featured', 'item-image-featured');
  }

  if (params.isLoaded) {
    imgParts.push('lazyloaded');
  }

  return {
    containerTransitionClass,
    imageClass: imgParts.join(' '),
    placeholderVisible: !params.isLoaded,
  };
}


