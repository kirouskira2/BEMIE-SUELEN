import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateExpandedClientWidth,
  getTopBarTargetY,
  isViewportInCatalog,
  computeCatalogSidebarHidden,
  computeCardTransform,
  resolveRouteTargetSelector,
  calculateProductOffer,
  getStockForSize,
  buildWhatsAppOrderUrl,
  calculateZoomOrigin,
  formatCep,
  formatBrazilPhone,
  normalizeSearchText,
  matchesCatalogStyleFilter,
  filterCatalogProducts,
  getCategoryReelConfig,
  shouldPlayCategoryReel,
  computeHeaderVisibility,
  calculateLoaderBrandDividerLayout,
} from './animationMath';
import {
  PRELOADER_COUNTS,
  FEATURED_PROJECTS,
  CLIENT_REVIEWS,
  HERO_STATS,
  WHAT_WE_DO_TAGS,
  BEMIE_PRODUCTS,
  STORE_CONFIG,
} from '../data/siteData';

test('calculateExpandedClientWidth matches exact minified formula (e - 16 - 48*t - 4*t)', () => {
  assert.equal(calculateExpandedClientWidth(null, 5), '10rem');
  assert.equal(calculateExpandedClientWidth(0, 5), '10rem');
  assert.equal(calculateExpandedClientWidth(500, 5), '276px');
});

test('getTopBarTargetY hides header when scrolling down past 50px and reveals on scroll up', () => {
  assert.equal(getTopBarTargetY(40, 10, 80), null);
  assert.equal(getTopBarTargetY(120, 40, 80), -80);
  assert.equal(getTopBarTargetY(90, 120, 80), 0);
});

test('isViewportInCatalog and computeCatalogSidebarHidden enforce scroll-up-only visibility across all sections', () => {
  // Outside catalog bounds check
  assert.equal(isViewportInCatalog({ top: 450, bottom: 2400 }), false);
  assert.equal(isViewportInCatalog({ top: -1500, bottom: 80 }), false);
  // Inside catalog bounds check
  assert.equal(isViewportInCatalog({ top: 0, bottom: 1800 }), true);
  assert.equal(isViewportInCatalog({ top: -600, bottom: 500 }), true);

  // Outside catalog & stationary -> hidden (same logic across all sections)
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: false,
      isScrollingUp: false,
      isScrollingStopped: true,
    }),
    true
  );

  // Outside catalog & actively scrolling up -> visible (hidden = false)
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: false,
      isScrollingUp: true,
      isScrollingStopped: false,
    }),
    false
  );

  // Inside catalog & stationary -> hidden
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: true,
      isScrollingUp: false,
      isScrollingStopped: true,
    }),
    true
  );

  // Inside catalog & scrolling down -> hidden
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: true,
      isScrollingUp: false,
      isScrollingStopped: false,
    }),
    true
  );

  // Inside catalog & actively scrolling up -> visible (hidden = false)
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: true,
      isScrollingUp: true,
      isScrollingStopped: false,
    }),
    false
  );

  // Stopped after scrolling up -> hidden again
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: true,
      isScrollingUp: true,
      isScrollingStopped: true,
    }),
    true
  );

  // Hovered while visible -> stays visible in any section
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: false,
      isScrollingUp: false,
      isScrollingStopped: true,
      isHovered: true,
    }),
    false
  );

  // Hover-only mode -> hidden even when scrolling up unless mouse is hovering
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: false,
      isScrollingUp: true,
      isScrollingStopped: false,
      isHovered: false,
      hoverOnly: true,
    }),
    true
  );
  assert.equal(
    computeCatalogSidebarHidden({
      isInCatalog: true,
      isScrollingUp: false,
      isScrollingStopped: true,
      isHovered: true,
      hoverOnly: true,
    }),
    false
  );
});

test('computeCardTransform interpolates 3D card perspective values accurately', () => {
  assert.deepEqual(computeCardTransform(0), { yPercent: 0, z: 0, rotationX: 0 });
  assert.deepEqual(computeCardTransform(0.5), { yPercent: -25, z: -125, rotationX: 22.5 });
  assert.deepEqual(computeCardTransform(1), { yPercent: -50, z: -250, rotationX: 45 });
});

test('resolveRouteTargetSelector maps CTA routes to DOM sections', () => {
  assert.equal(resolveRouteTargetSelector('/studio'), '.bemie-catalog-section');
  assert.equal(resolveRouteTargetSelector('.featured-projects-container'), '.bemie-catalog-section');
  assert.equal(resolveRouteTargetSelector('blueprints'), '.bemie-catalog-section');
  assert.equal(resolveRouteTargetSelector('#page3'), '.bemie-catalog-section');
  assert.equal(resolveRouteTargetSelector('/connect'), '.cta-window');
  assert.equal(resolveRouteTargetSelector('#page2'), '#page2');
  assert.equal(resolveRouteTargetSelector('/'), '.site-hero');
});

test('formatCep and formatBrazilPhone apply clean Brazilian masks', () => {
  assert.equal(formatCep('51020000'), '51020-000');
  assert.equal(formatCep('51020-00099'), '51020-000');
  assert.equal(formatBrazilPhone('81971041702'), '(81) 97104-1702');
  assert.equal(formatBrazilPhone('8133221100'), '(81) 3322-1100');
});

test('calculateProductOffer computes 20% Bemiê discount accurately', () => {
  const scarlet = calculateProductOffer({
    preco: 179.8,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
  });
  assert.equal(scarlet.active, true);
  assert.equal(scarlet.current, 143.84);
  assert.equal(scarlet.percent, 20);

  const regular = calculateProductOffer({
    preco: 139.9,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
  });
  assert.equal(regular.active, false);
  assert.equal(regular.current, 139.9);
});

test('getStockForSize and buildWhatsAppOrderUrl work with real Bemiê products', () => {
  const product = BEMIE_PRODUCTS[0];
  assert.equal(getStockForSize(product.tamanhos, 'P'), 2);
  assert.equal(getStockForSize(product.tamanhos, 'G'), 0);

  const url = buildWhatsAppOrderUrl(
    STORE_CONFIG.whatsapp,
    [{ nome: product.nome, cor: product.cor, tamanho: 'P', qty: 1, unitPrice: 143.84 }],
    { nome: 'Ana', cidade: 'Recife', pagamento: 'pix' }
  );
  assert.ok(url.startsWith('https://wa.me/5581971041702?text='));
  assert.ok(decodeURIComponent(url).includes('Biquíni Scarlet Asa Delta'));
});

test('siteData contains all Bemiê Moda Praia records and Do It structure', () => {
  assert.equal(PRELOADER_COUNTS.length, 5);
  assert.equal(HERO_STATS.length, 4);
  assert.equal(WHAT_WE_DO_TAGS.length, 6);
  assert.equal(FEATURED_PROJECTS.length, 4);
  assert.equal(CLIENT_REVIEWS.length, 5);
  assert.equal(BEMIE_PRODUCTS.length, 10);
});

test('calculateZoomOrigin clamps cursor percentages within 0% to 100%', () => {
  const rect = { left: 100, top: 100, width: 400, height: 500 };
  // Center
  assert.deepEqual(calculateZoomOrigin(300, 350, rect), { x: 50, y: 50 });
  // Top left corner
  assert.deepEqual(calculateZoomOrigin(100, 100, rect), { x: 0, y: 0 });
  // Bottom right corner
  assert.deepEqual(calculateZoomOrigin(500, 600, rect), { x: 100, y: 100 });
  // Clamped outside bounds
  assert.deepEqual(calculateZoomOrigin(50, 50, rect), { x: 0, y: 0 });
  assert.deepEqual(calculateZoomOrigin(800, 900, rect), { x: 100, y: 100 });
  // Zero dimensions fallback
  assert.deepEqual(calculateZoomOrigin(100, 100, { left: 0, top: 0, width: 0, height: 0 }), {
    x: 50,
    y: 50,
  });
});

test('normalizeSearchText and filterCatalogProducts filter by Biquíni, Maiô (0 items), and search query', () => {
  assert.equal(normalizeSearchText('Biquíni'), 'biquini');
  assert.equal(normalizeSearchText('Maiô'), 'maio');
  assert.equal(normalizeSearchText('Saída de Praia'), 'saida de praia');

  const allBiquini = filterCatalogProducts(BEMIE_PRODUCTS, 'biquini', '');
  assert.equal(allBiquini.length, 10);

  // Zero maiôs on the site
  const maioItems = filterCatalogProducts(BEMIE_PRODUCTS, 'maio', '');
  assert.equal(maioItems.length, 0);

  // Combined style filter + color search
  const pistachioBikinis = filterCatalogProducts(BEMIE_PRODUCTS, 'biquini', 'pistachio');
  assert.equal(pistachioBikinis.length, 2);
});

test('getCategoryReelConfig and shouldPlayCategoryReel map Asa Delta, Marquinha, and Alça Dupla to their Instagram Reels and alternate videos after 7s', async () => {
  const {
    CATEGORY_REEL_SWITCH_INTERVAL_MS,
    getNextCategoryReelIndex,
    getActiveCategoryReelByElapsedMs,
  } = await import('./animationMath');

  assert.equal(CATEGORY_REEL_SWITCH_INTERVAL_MS, 7000);

  const asaDelta = getCategoryReelConfig('ASA DELTA');
  assert.ok(asaDelta);
  assert.equal(asaDelta.id, 'elem1');
  assert.equal(asaDelta.catalogFilter, 'asa-delta');
  assert.equal(asaDelta.primaryProductId, 'p_bayopyq5');
  assert.equal(asaDelta.reelUrl, 'https://www.instagram.com/p/Dc3unyiRadO/');
  assert.equal(asaDelta.videoSrc, '/bemie/reels/reel-asa-delta.mp4');
  assert.deepEqual(asaDelta.reelUrls, [
    'https://www.instagram.com/p/Dc3unyiRadO/',
    'https://www.instagram.com/reel/DdWsBQBxr6W/',
  ]);
  assert.deepEqual(asaDelta.videoSources, [
    '/bemie/reels/reel-asa-delta.mp4',
    '/bemie/reels/reel-asa-delta-2.mp4',
  ]);

  const marquinha = getCategoryReelConfig('Marquinha');
  assert.ok(marquinha);
  assert.equal(marquinha.id, 'elem2');
  assert.equal(marquinha.catalogFilter, 'marquinha');
  assert.equal(marquinha.primaryProductId, 'p_icbso4d4');
  assert.equal(marquinha.reelUrl, 'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/');
  assert.equal(marquinha.videoSrc, '/bemie/reels/reel-marquinha.mp4');
  assert.deepEqual(marquinha.reelUrls, [
    'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
    'https://www.instagram.com/reel/DdEXoszxKeA/',
  ]);
  assert.deepEqual(marquinha.videoSources, [
    '/bemie/reels/reel-marquinha.mp4',
    '/bemie/reels/reel-marquinha-2.mp4',
  ]);

  const alcaDupla = getCategoryReelConfig('Alça Dupla');
  assert.ok(alcaDupla);
  assert.equal(alcaDupla.id, 'elem3');
  assert.equal(alcaDupla.catalogFilter, 'alca-dupla');
  assert.equal(alcaDupla.primaryProductId, 'p_wnba68hp');
  assert.equal(alcaDupla.reelUrl, 'https://www.instagram.com/p/DdpIwAPvjp8/');
  assert.equal(alcaDupla.videoSrc, '/bemie/reels/reel-alca-dupla.mp4');

  // Verify 7s alternation on Asa Delta and Marquinha
  assert.equal(getNextCategoryReelIndex(0, 2), 1);
  assert.equal(getNextCategoryReelIndex(1, 2), 0);
  assert.equal(getNextCategoryReelIndex(0, 1), 0);

  assert.deepEqual(getActiveCategoryReelByElapsedMs('ASA DELTA', 0), {
    index: 0,
    videoSrc: '/bemie/reels/reel-asa-delta.mp4',
    reelUrl: 'https://www.instagram.com/p/Dc3unyiRadO/',
  });
  assert.deepEqual(getActiveCategoryReelByElapsedMs('ASA DELTA', 7000), {
    index: 1,
    videoSrc: '/bemie/reels/reel-asa-delta-2.mp4',
    reelUrl: 'https://www.instagram.com/reel/DdWsBQBxr6W/',
  });
  assert.deepEqual(getActiveCategoryReelByElapsedMs('ASA DELTA', 14000), {
    index: 0,
    videoSrc: '/bemie/reels/reel-asa-delta.mp4',
    reelUrl: 'https://www.instagram.com/p/Dc3unyiRadO/',
  });

  assert.deepEqual(getActiveCategoryReelByElapsedMs('MARQUINHA', 0), {
    index: 0,
    videoSrc: '/bemie/reels/reel-marquinha.mp4',
    reelUrl: 'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
  });
  assert.deepEqual(getActiveCategoryReelByElapsedMs('MARQUINHA', 7000), {
    index: 1,
    videoSrc: '/bemie/reels/reel-marquinha-2.mp4',
    reelUrl: 'https://www.instagram.com/reel/DdEXoszxKeA/',
  });

  // Autoplay without requiring mouse hover
  assert.equal(shouldPlayCategoryReel({ isCardHovered: false }), true);
  assert.equal(shouldPlayCategoryReel({ isCardHovered: true, isPreviewingProductThumb: false }), true);
  assert.equal(shouldPlayCategoryReel({ isCardHovered: true, isPreviewingProductThumb: true }), false);

  // Filtering by lookbook category places signature bikini first
  const asaDeltaCatalog = filterCatalogProducts(BEMIE_PRODUCTS, 'asa-delta', '');
  assert.ok(asaDeltaCatalog.length >= 2);
  assert.equal(asaDeltaCatalog[0].id, 'p_bayopyq5');

  const marquinhaCatalog = filterCatalogProducts(BEMIE_PRODUCTS, 'marquinha', '');
  assert.ok(marquinhaCatalog.length >= 3);
  assert.equal(marquinhaCatalog[0].id, 'p_icbso4d4');

  const alcaDuplaCatalog = filterCatalogProducts(BEMIE_PRODUCTS, 'alca-dupla', '');
  assert.ok(alcaDuplaCatalog.length >= 2);
  assert.equal(alcaDuplaCatalog[0].id, 'p_wnba68hp');
});

test('calculatePixAndInstallments, shouldShowMouseBallCursor, and Instagram feed items support the Numana catalog & instafeed adaptation', async () => {
  const { calculatePixAndInstallments, shouldShowMouseBallCursor } = await import('./animationMath');
  const { INSTAGRAM_FEED_ITEMS, HEADER_PROMO_BAR_TEXT } = await import('../data/siteData');

  // Cursor ball is strictly disabled in catalog
  assert.equal(
    shouldShowMouseBallCursor({
      isInCatalog: true,
      isInLookbookCard: true,
      isOverInteractiveControl: false,
    }),
    false
  );
  assert.equal(
    shouldShowMouseBallCursor({
      isInCatalog: false,
      isInLookbookCard: true,
      isOverInteractiveControl: false,
    }),
    true
  );
  assert.equal(
    shouldShowMouseBallCursor({
      isInCatalog: false,
      isInLookbookCard: true,
      isOverInteractiveControl: true,
    }),
    false
  );

  const pixInfo = calculatePixAndInstallments(143.84, 5, 3);
  assert.equal(pixInfo.pixPrice, 136.65);
  assert.equal(pixInfo.installmentValue, 47.95);
  assert.equal(pixInfo.installmentsCount, 3);
  assert.ok(pixInfo.pixLabel.includes('136,65'));
  assert.ok(pixInfo.pixLabel.includes('Pix'));

  assert.equal(INSTAGRAM_FEED_ITEMS.length, 6);
  assert.ok(INSTAGRAM_FEED_ITEMS.every((item) => item.image.startsWith('/bemie/products/ig_bemie_')));

  // Ensure no duplicate images, productIds, or hrefs inside INSTAGRAM_FEED_ITEMS
  const uniqueImages = new Set(INSTAGRAM_FEED_ITEMS.map((item) => item.image));
  const uniqueProducts = new Set(INSTAGRAM_FEED_ITEMS.map((item) => item.productId));
  const uniqueHrefs = new Set(INSTAGRAM_FEED_ITEMS.map((item) => item.href));
  assert.equal(uniqueImages.size, INSTAGRAM_FEED_ITEMS.length);
  assert.equal(uniqueProducts.size, INSTAGRAM_FEED_ITEMS.length);
  assert.equal(uniqueHrefs.size, INSTAGRAM_FEED_ITEMS.length);

  // Ensure none of the Instagram grid photos repeat the default cover (photos[0]) of any catalog card
  const defaultCatalogCovers = new Set(BEMIE_PRODUCTS.map((p) => p.photos[0]));
  assert.ok(INSTAGRAM_FEED_ITEMS.every((item) => !defaultCatalogCovers.has(item.image)));

  assert.ok(HEADER_PROMO_BAR_TEXT.includes('20% OFF'));
  assert.equal(resolveRouteTargetSelector('#instagram'), '.numana-instafeed-section');
});

test('computeHeaderVisibility hides header when scrolling down and reveals when scrolling up', () => {
  // At page top (scrollY <= 15), header is always visible
  assert.deepEqual(computeHeaderVisibility(0, 0, false), { isVisible: true, nextLastScrollY: 0 });
  assert.deepEqual(computeHeaderVisibility(10, 50, false), { isVisible: true, nextLastScrollY: 10 });

  // Scrolling down past top (diff > 0): hides header
  const scrollDown = computeHeaderVisibility(200, 100, true);
  assert.equal(scrollDown.isVisible, false);
  assert.equal(scrollDown.nextLastScrollY, 200);

  // Scrolling up (diff < 0): reveals header
  const scrollUp = computeHeaderVisibility(150, 200, false);
  assert.equal(scrollUp.isVisible, true);
  assert.equal(scrollUp.nextLastScrollY, 150);

  // Small jitter within threshold (e.g. diff = 3 < 6): keeps previous visibility
  const jitter = computeHeaderVisibility(153, 150, false, 6);
  assert.equal(jitter.isVisible, false);
  assert.equal(jitter.nextLastScrollY, 150);
});

test('TRUST_BENEFITS defines 3 continuous marquee trust blocks (Entrega, Pagamento, WhatsApp)', async () => {
  const { TRUST_BENEFITS } = await import('../components/TrustMarquee');
  assert.equal(TRUST_BENEFITS.length, 3);
  const ids = TRUST_BENEFITS.map((b) => b.id);
  assert.deepEqual(ids, ['entrega', 'pagamento', 'whatsapp']);
});

test('calculateLoaderBrandDividerLayout places vertical line precisely and symmetrically between Bemiê and Moda Praia', () => {
  // Desktop 1440px viewport with 24px padding (1.5rem)
  const desktop = calculateLoaderBrandDividerLayout(1440, 24);
  assert.equal(desktop.dividerX, 720);
  assert.equal(desktop.word1RightEdge, 696);
  assert.equal(desktop.word2LeftEdge, 744);
  assert.equal(desktop.gapBetweenWords, 48);
  assert.equal(desktop.distanceWord1ToDivider, 24);
  assert.equal(desktop.distanceWord2ToDivider, 24);
  assert.equal(desktop.isSymmetricallyCentered, true);

  // Mobile 390px viewport with 13.6px padding (0.85rem)
  const mobile = calculateLoaderBrandDividerLayout(390, 13.6);
  assert.equal(mobile.dividerX, 195);
  assert.equal(mobile.word1RightEdge, 181.4);
  assert.equal(mobile.word2LeftEdge, 208.6);
  assert.equal(mobile.gapBetweenWords, 27.2);
  assert.equal(mobile.distanceWord1ToDivider, 13.6);
  assert.equal(mobile.distanceWord2ToDivider, 13.6);
  assert.equal(mobile.isSymmetricallyCentered, true);
});

test('getNumanaImageRevealClasses and EAGLE_TRIO_COLUMNS match Numana photo loading spec and requested bikini replacements', async () => {
  const { NUMANA_TRANSITION_CONFIG, getNumanaImageRevealClasses } = await import('./animationMath');
  const { EAGLE_TRIO_COLUMNS } = await import('../components/EagleShowcase');

  assert.equal(NUMANA_TRANSITION_CONFIG.dataTransitionAttr, 'fade-in-up');
  assert.equal(NUMANA_TRANSITION_CONFIG.inViewportClass, 'is-inViewport');
  assert.equal(NUMANA_TRANSITION_CONFIG.fadeInUpTranslateYPx, 30);

  assert.deepEqual(
    getNumanaImageRevealClasses({ isLoaded: false }),
    {
      containerTransitionClass: '',
      imageClass: 'lazyload fade-in product-item-image-featured item-image-featured',
      placeholderVisible: true,
    }
  );
  assert.deepEqual(
    getNumanaImageRevealClasses({ isLoaded: true, isInViewport: true }),
    {
      containerTransitionClass: 'is-inViewport',
      imageClass: 'lazyload fade-in product-item-image-featured item-image-featured lazyloaded',
      placeholderVisible: false,
    }
  );
  assert.deepEqual(
    getNumanaImageRevealClasses({ isLoaded: true, isBanner: true }),
    {
      containerTransitionClass: '',
      imageClass: 'lazyload fade-in textbanner-image-effect lazyloaded',
      placeholderVisible: false,
    }
  );

  // Verify elem1 (ASA DELTA) 2nd inner product is BIQUÍNI HAWAI MARQUINHA DE AMARRAR BOSSA
  const elem1 = EAGLE_TRIO_COLUMNS.find((c) => c.id === 'elem1');
  assert.ok(elem1);
  assert.equal(elem1.products[1].id, 'p_dwsrre4l');
  assert.equal(elem1.products[1].name, 'BIQUÍNI HAWAI MARQUINHA DE AMARRAR BOSSA');
  assert.equal(elem1.products[1].image, '/bemie/products/p_dwsrre4l_0.jpg');

  // Verify elem2 (MARQUINHA) 2nd inner product is BIQUÍNI MARQUINHA VERMELHO CEREJA E ROSA AREIA
  const elem2 = EAGLE_TRIO_COLUMNS.find((c) => c.id === 'elem2');
  assert.ok(elem2);
  assert.equal(elem2.products[1].id, 'p_qiw632k8');
  assert.equal(elem2.products[1].name, 'BIQUÍNI MARQUINHA VERMELHO CEREJA E ROSA AREIA');
  assert.equal(elem2.products[1].image, '/bemie/products/p_qiw632k8_0.jpg');

  // Verify resolveBufferedCategoryReelIndex gates second video on canplaythrough buffer state
  const { resolveBufferedCategoryReelIndex } = await import('./animationMath');
  assert.equal(
    resolveBufferedCategoryReelIndex({
      currentIndex: 0,
      targetIndex: 1,
      totalSources: 2,
      isTargetBuffered: false,
    }),
    0
  );
  assert.equal(
    resolveBufferedCategoryReelIndex({
      currentIndex: 0,
      targetIndex: 1,
      totalSources: 2,
      isTargetBuffered: true,
    }),
    1
  );
  assert.equal(
    resolveBufferedCategoryReelIndex({
      currentIndex: 1,
      targetIndex: 0,
      totalSources: 2,
      isTargetBuffered: false,
    }),
    0
  );
});



