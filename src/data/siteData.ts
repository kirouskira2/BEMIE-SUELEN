import { SizeStock } from '../utils/animationMath';

export interface BemieProduct {
  id: string;
  nome: string;
  cor: string;
  categoria: 'biquinis' | 'saidas' | 'acessorios' | 'generico';
  styleTag: 'marquinha' | 'estruturado' | 'bazar';
  estilos: string[];
  preco: number;
  ofertaTipo: 'desconto' | 'promocao' | 'nenhuma';
  descontoPercentual: number;
  precoPromocional: number;
  tamanho: string;
  tamanhos: SizeStock[];
  estoqueInicial: number;
  photos: string[];
  description: string;
}

export interface FeaturedProject {
  id: string;
  info: string;
  title: string;
  description: string;
  image: string;
  photos: string[];
  cor: string;
  preco: number;
  ofertaTipo: 'desconto' | 'promocao' | 'nenhuma';
  descontoPercentual: number;
  tamanhos: SizeStock[];
}

export interface ClientReview {
  id: number;
  name: string;
  title: string;
  image: string;
  avatar: string;
  review: string;
  productId: string;
}

export interface HeroStat {
  count: string;
  info: string;
  countDelay: number;
  infoDelay: number;
}

export const STORE_CONFIG = {
  brandName: 'Bemiê Moda Praia',
  handle: '@bemiemodapraia',
  whatsapp: '5581971041702',
  whatsappDisplay: '(81) 97104-1702',
  previsaoEntrega: '5 a 10 dias úteis',
  instagramUrl: 'https://www.instagram.com/bemiemodapraia/',
};

export const PRELOADER_COUNTS: [string, string][] = [
  ['0', '0'],
  ['2', '7'],
  ['6', '5'],
  ['9', '8'],
  ['9', '9'],
];

export const HERO_STATS: HeroStat[] = [
  { count: '10', info: 'Modelos exclusivos na coleção', countDelay: 0.1, infoDelay: 0.15 },
  { count: '20%', info: 'OFF em biquínis selecionados', countDelay: 0.2, infoDelay: 0.25 },
  { count: '5–10', info: 'Dias úteis — Entrega em todo o Brasil', countDelay: 0.3, infoDelay: 0.35 },
  { count: '100%', info: 'Pix · Crédito · Débito via WhatsApp', countDelay: 0.4, infoDelay: 0.45 },
];

export const WHAT_WE_DO_TAGS: string[] = [
  'Biquínis e maiôs',
  'Marquinha de amarrar',
  'Asa delta & Meia-taça',
  'Alça dupla & Regulável',
  'Saídas de praia',
  'Acessórios de verão',
];

export const BEMIE_PRODUCTS: BemieProduct[] = [
  {
    id: 'p_bayopyq5',
    nome: 'Biquíni Scarlet Asa Delta',
    cor: 'Vermelho e preto',
    categoria: 'biquinis',
    styleTag: 'estruturado',
    estilos: ['Biquíni', 'Asa Delta'],
    preco: 179.8,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    precoPromocional: 0,
    tamanho: 'P, M',
    tamanhos: [
      { t: 'P', q: 2 },
      { t: 'M', q: 1 },
    ],
    estoqueInicial: 3,
    photos: [
      '/bemie/products/p_bayopyq5_0.jpg',
      '/bemie/products/p_bayopyq5_1.jpg',
      '/bemie/products/p_bayopyq5_2.jpg',
      '/bemie/products/p_bayopyq5_3.jpg',
    ],
    description:
      'Top estruturado com estampa floral maximalista em vermelho e preto e acabamento em viés listrado. Calcinha asa delta que alonga a silhueta com conforto absoluto.',
  },
  {
    id: 'p_icbso4d4',
    nome: 'Biquíni Búzios Marquinha Pistachio e Marrom Café',
    cor: 'Pistacho com Marrom Café',
    categoria: 'biquinis',
    styleTag: 'marquinha',
    estilos: ['Biquíni', 'Cortininha & Marquinha'],
    preco: 139.9,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    precoPromocional: 0,
    tamanho: 'P',
    tamanhos: [{ t: 'P', q: 3 }],
    estoqueInicial: 3,
    photos: [
      '/bemie/products/p_icbso4d4_0.jpg',
      '/bemie/products/p_icbso4d4_1.jpg',
      '/bemie/products/p_icbso4d4_2.jpg',
      '/bemie/products/p_icbso4d4_3.jpg',
    ],
    description:
      'Cortininha bicolor em tom pistache e marrom café com amarração fina pensada para marquinha perfeita. Tecido de toque gelado com proteção solar e secagem rápida.',
  },
  {
    id: 'p_qiw632k8',
    nome: 'Biquíni Marquinha Vermelho Cereja e Rosa Areia',
    cor: 'Vermelho cereja e rosa areia',
    categoria: 'biquinis',
    styleTag: 'marquinha',
    estilos: ['Biquíni', 'Cortininha & Marquinha'],
    preco: 139.9,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    precoPromocional: 0,
    tamanho: 'P, G',
    tamanhos: [
      { t: 'P', q: 0 },
      { t: 'G', q: 0 },
    ],
    estoqueInicial: 0,
    photos: [
      '/bemie/products/p_qiw632k8_0.jpg',
      '/bemie/products/p_qiw632k8_1.jpg',
      '/bemie/products/p_qiw632k8_2.jpg',
      '/bemie/products/p_qiw632k8_3.jpg',
    ],
    description:
      'Contraste vibrante entre o vermelho cereja e o viés rosa areia. Modelagem fixa no busto com laterais finas que valorizam o bronzeado sem abrir mão da segurança.',
  },
  {
    id: 'p_6ltgmlin',
    nome: 'Biquíni Hawai Regulável Belle Bloom Promo Bazar',
    cor: 'Vermelho e azul',
    categoria: 'biquinis',
    styleTag: 'bazar',
    estilos: ['Biquíni', 'Meia-Taça'],
    preco: 111.84,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
    precoPromocional: 0,
    tamanho: 'P, M, G',
    tamanhos: [
      { t: 'P', q: 2 },
      { t: 'M', q: 1 },
      { t: 'G', q: 1 },
    ],
    estoqueInicial: 4,
    photos: [
      '/bemie/products/p_6ltgmlin_0.jpg',
      '/bemie/products/p_6ltgmlin_1.jpg',
      '/bemie/products/p_6ltgmlin_2.jpg',
    ],
    description:
      'Top meia-taça com aro estruturado em estampa floral Belle Bloom vermelha e acabamento listrado azul. Alças e laterais reguláveis para ajuste sob medida.',
  },
  {
    id: 'p_5uzjr4qq',
    nome: 'Biquíni Naomi Pistachio e Marrom Café',
    cor: 'Pistachio e Marrom Café',
    categoria: 'biquinis',
    styleTag: 'estruturado',
    estilos: ['Biquíni', 'Meia-Taça', 'Alça Dupla'],
    preco: 159.9,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    precoPromocional: 0,
    tamanho: 'P, M, G',
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 1 },
      { t: 'G', q: 1 },
    ],
    estoqueInicial: 3,
    photos: [
      '/bemie/products/p_5uzjr4qq_0.jpg',
      '/bemie/products/p_5uzjr4qq_1.jpg',
      '/bemie/products/p_5uzjr4qq_2.jpg',
    ],
    description:
      'Design autoral Bemiê com busto drapeado em marrom café, viés contrastante pistache e tiras duplas nas laterais. Sofisticação de resort com sustentação meia-taça.',
  },
  {
    id: 'p_zaakzxfq',
    nome: 'Biquíni Búzios Marquinha Verde Cítrico e Aqua',
    cor: 'Verde Cítrico e Aqua',
    categoria: 'biquinis',
    styleTag: 'marquinha',
    estilos: ['Biquíni', 'Cortininha & Marquinha'],
    preco: 139.9,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    precoPromocional: 0,
    tamanho: 'P, M',
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 1 },
    ],
    estoqueInicial: 2,
    photos: [
      '/bemie/products/p_zaakzxfq_0.jpg',
      '/bemie/products/p_zaakzxfq_1.jpg',
      '/bemie/products/p_zaakzxfq_2.jpg',
      '/bemie/products/p_zaakzxfq_3.jpg',
    ],
    description:
      'Cortininha clássico em verde cítrico solar com acabamento em azul aqua. Amarração tradicional no pescoço e no quadril com pingente dourado exclusivo Bemiê.',
  },
  {
    id: 'p_avylmc1b',
    nome: 'Biquíni Marquinha Regulável Poá Amore Mio com Listra',
    cor: 'Poá com Listra',
    categoria: 'biquinis',
    styleTag: 'marquinha',
    estilos: ['Biquíni', 'Cortininha & Marquinha'],
    preco: 139.99,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    precoPromocional: 0,
    tamanho: 'P',
    tamanhos: [{ t: 'P', q: 1 }],
    estoqueInicial: 1,
    photos: [
      '/bemie/products/p_avylmc1b_0.jpg',
      '/bemie/products/p_avylmc1b_1.jpg',
    ],
    description:
      'Mix de estampas retrô-chic: fundo creme em poá rosa combinado com viés listrado vermelho e rosa. Alças com reguladores banhados e calcinha de lateral fina.',
  },
  {
    id: 'p_52mz54z2',
    nome: 'Biquíni Sofia — Rendinha',
    cor: 'Branco',
    categoria: 'biquinis',
    styleTag: 'estruturado',
    estilos: ['Biquíni', 'Meia-Taça', 'Asa Delta'],
    preco: 145.8,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
    precoPromocional: 0,
    tamanho: 'P, M, G',
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 2 },
      { t: 'G', q: 0 },
    ],
    estoqueInicial: 3,
    photos: ['/bemie/products/p_52mz54z2_0.jpg'],
    description:
      'Meia-taça estruturado em tecido texturizado rendinha off-white/branco com acabamento franzido delicado no decote e amarração lateral. Forro duplo zero transparência.',
  },
  {
    id: 'p_dwsrre4l',
    nome: 'Biquíni Hawai Marquinha de Amarrar | Bossa',
    cor: 'Estampa Bossa & Vichy Coral',
    categoria: 'biquinis',
    styleTag: 'estruturado',
    estilos: ['Biquíni', 'Meia-Taça'],
    preco: 139.9,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
    precoPromocional: 0,
    tamanho: 'P, M, G',
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 2 },
      { t: 'G', q: 0 },
    ],
    estoqueInicial: 3,
    photos: [
      '/bemie/products/p_dwsrre4l_0.jpg',
      '/bemie/products/p_dwsrre4l_1.jpg',
      '/bemie/products/p_dwsrre4l_2.jpg',
    ],
    description:
      'Inspirado no calçadão carioca: meia-taça com ondas pretas e off-white emolduradas por xadrez vichy coral. Calcinha de amarrar que une charme bossa nova e caimento impecável.',
  },
  {
    id: 'p_wnba68hp',
    nome: 'Biquíni Búzios Alça Dupla Marquinha | Tie Dye Coconut',
    cor: 'Tie dye coconut',
    categoria: 'biquinis',
    styleTag: 'marquinha',
    estilos: ['Biquíni', 'Cortininha & Marquinha', 'Alça Dupla'],
    preco: 139.9,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
    precoPromocional: 0,
    tamanho: 'P, M, G',
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 3 },
      { t: 'G', q: 0 },
    ],
    estoqueInicial: 4,
    photos: [
      '/bemie/products/p_wnba68hp_0.jpg',
      '/bemie/products/p_wnba68hp_1.jpg',
      '/bemie/products/p_wnba68hp_2.jpg',
    ],
    description:
      'Estampa orgânica Tie Dye Coconut em verde folha e marrom cacau. Top cortininha com alça dupla nos ombros e ponteiras naturais nas amarrações laterais.',
  },
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'p_bayopyq5',
    info: 'Biquínis e maiôs · Vermelho e preto · Tam: P, M · -20% OFF',
    title: 'Biquíni Scarlet Asa Delta',
    description:
      'Top estruturado em estampa floral vermelha e preta com acabamento listrado e calcinha asa delta que alonga a silhueta. De R$ 179,80 por R$ 143,84 no catálogo Bemiê.',
    image: '/bemie/products/p_bayopyq5_0.jpg',
    photos: [
      '/bemie/products/p_bayopyq5_0.jpg',
      '/bemie/products/p_bayopyq5_1.jpg',
      '/bemie/products/p_bayopyq5_2.jpg',
      '/bemie/products/p_bayopyq5_3.jpg',
    ],
    cor: 'Vermelho e preto',
    preco: 179.8,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    tamanhos: [
      { t: 'P', q: 2 },
      { t: 'M', q: 1 },
    ],
  },
  {
    id: 'p_dwsrre4l',
    info: 'Biquínis e maiôs · Estampa Bossa & Vichy · Tam: P, M',
    title: 'Biquíni Hawai Marquinha | Bossa',
    description:
      'Meia-taça estruturado com padronagem ondas cariocas e viés vichy coral, combinado com calcinha marquinha de amarrar. Disponível por R$ 139,90 com envio imediato.',
    image: '/bemie/products/p_dwsrre4l_0.jpg',
    photos: [
      '/bemie/products/p_dwsrre4l_0.jpg',
      '/bemie/products/p_dwsrre4l_1.jpg',
      '/bemie/products/p_dwsrre4l_2.jpg',
    ],
    cor: 'Estampa Bossa & Vichy Coral',
    preco: 139.9,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 2 },
      { t: 'G', q: 0 },
    ],
  },
  {
    id: 'p_5uzjr4qq',
    info: 'Biquínis e maiôs · Pistachio e Marrom Café · Tam: P, M, G · -20% OFF',
    title: 'Biquíni Naomi Pistachio & Café',
    description:
      'Busto drapeado em marrom café com contornos verde pistache e tiras duplas nas laterais. De R$ 159,90 por R$ 127,92 — elegância natural para piscina e praia.',
    image: '/bemie/products/p_5uzjr4qq_0.jpg',
    photos: [
      '/bemie/products/p_5uzjr4qq_0.jpg',
      '/bemie/products/p_5uzjr4qq_1.jpg',
      '/bemie/products/p_5uzjr4qq_2.jpg',
    ],
    cor: 'Pistachio e Marrom Café',
    preco: 159.9,
    ofertaTipo: 'desconto',
    descontoPercentual: 20,
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 1 },
      { t: 'G', q: 1 },
    ],
  },
  {
    id: 'p_wnba68hp',
    info: 'Biquínis e maiôs · Tie Dye Coconut · Tam: P, M',
    title: 'Biquíni Búzios Tie Dye Coconut',
    description:
      'Cortininha de alça dupla com estampa exclusiva Tie Dye Coconut em tons terrosos e verde folha, amarração regulável e medalhinha dourada Bemiê. R$ 139,90.',
    image: '/bemie/products/p_wnba68hp_0.jpg',
    photos: [
      '/bemie/products/p_wnba68hp_0.jpg',
      '/bemie/products/p_wnba68hp_1.jpg',
      '/bemie/products/p_wnba68hp_2.jpg',
    ],
    cor: 'Tie dye coconut',
    preco: 139.9,
    ofertaTipo: 'nenhuma',
    descontoPercentual: 0,
    tamanhos: [
      { t: 'P', q: 1 },
      { t: 'M', q: 3 },
      { t: 'G', q: 0 },
    ],
  },
];

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 1,
    name: 'Marina Albuquerque',
    title: 'Biquíni Búzios Pistachio & Café',
    image: '/bemie/products/p_icbso4d4_0.jpg',
    avatar: '/bemie/products/p_icbso4d4_1.jpg',
    productId: 'p_icbso4d4',
    review:
      'A combinação de pistache com marrom café é ainda mais linda pessoalmente! O tecido tem um toque super macio e a modelagem deixa a marquinha perfeita.',
  },
  {
    id: 2,
    name: 'Letícia Cavalcanti',
    title: 'Biquíni Vermelho Cereja & Rosa',
    image: '/bemie/products/p_qiw632k8_0.jpg',
    avatar: '/bemie/products/p_qiw632k8_1.jpg',
    productId: 'p_qiw632k8',
    review:
      'Comprei pelo catálogo e fechei o pedido no WhatsApp em dois minutos. Chegou antes do prazo e o contraste do vermelho cereja com rosa areia ilumina muito na praia!',
  },
  {
    id: 3,
    name: 'Beatriz Monteiro',
    title: 'Biquíni Búzios Verde Cítrico',
    image: '/bemie/products/p_zaakzxfq_1.jpg',
    avatar: '/bemie/products/p_zaakzxfq_0.jpg',
    productId: 'p_zaakzxfq',
    review:
      'Já é o meu terceiro biquíni da Bemiê! O acabamento com a medalhinha dourada e a costura embutida não marcam nada no corpo. Recomendo de olhos fechados.',
  },
  {
    id: 4,
    name: 'Camila Vasconcelos',
    title: 'Biquíni Poá Amore Mio',
    image: '/bemie/products/p_avylmc1b_0.jpg',
    avatar: '/bemie/products/p_avylmc1b_1.jpg',
    productId: 'p_avylmc1b',
    review:
      'A estampa de poá com listras é super delicada e exclusiva. As alças reguláveis ajudaram a ajustar perfeitamente no busto.',
  },
  {
    id: 5,
    name: 'Gabriela Ferraz',
    title: 'Biquíni Sofia — Rendinha',
    image: '/bemie/products/p_52mz54z2_0.jpg',
    avatar: '/bemie/products/p_52mz54z2_0.jpg',
    productId: 'p_52mz54z2',
    review:
      'O Sofia branco em rendinha tem forro impecável, zero transparência mesmo molhado, e sustenta super bem com o aro meia-taça.',
  },
];

export interface InstagramFeedItem {
  id: string;
  image: string;
  alt: string;
  caption?: string;
  href: string;
  productId: string;
}

export const HEADER_PROMO_BAR_TEXT =
  '20% OFF em peças selecionadas ou 2x sem juros no cartão // ENVIOS PARA TODO O BRASIL em 5 a 10 dias úteis';

export const INSTAGRAM_FEED_ITEMS: InstagramFeedItem[] = [
  {
    id: 'ig-1',
    image: '/bemie/products/ig_bemie_1.jpg',
    alt: 'Coconut — Biquíni Búzios Pistachio e Marrom Café na piscina (@bemiemodapraia)',
    caption: 'coconut 🥥🌴🤎',
    href: 'https://www.instagram.com/bemiemodapraia/reel/De4hjmLxfzK/',
    productId: 'p_icbso4d4',
  },
  {
    id: 'ig-2',
    image: '/bemie/products/ig_bemie_2.jpg',
    alt: 'Feriado pede um Biquíni novo — Biquíni Scarlet Asa Delta (@bemiemodapraia)',
    caption: 'feriado pede biquíni novo ✨',
    href: 'https://www.instagram.com/bemiemodapraia/p/Deu-pYpN41e/',
    productId: 'p_bayopyq5',
  },
  {
    id: 'ig-3',
    image: '/bemie/products/ig_bemie_3.jpg',
    alt: 'Dinheiro volta, mas algumas peças saem do estoque para sempre — Compra sim, linda! (@bemiemodapraia)',
    caption: 'compra sim, linda! 🛍️',
    href: 'https://www.instagram.com/bemiemodapraia/p/DemCfs1RNwf/',
    productId: 'p_5uzjr4qq',
  },
  {
    id: 'ig-4',
    image: '/bemie/products/ig_bemie_4.jpg',
    alt: 'Biquíni Rosa cereja com as peças da Versátil (@bemiemodapraia)',
    caption: 'rosa cereja 🍒👙',
    href: 'https://www.instagram.com/bemiemodapraia/reel/DehzsDUos7V/',
    productId: 'p_qiw632k8',
  },
  {
    id: 'ig-5',
    image: '/bemie/products/ig_bemie_5.jpg',
    alt: 'Coconut Tie Dye — Biquíni Búzios Alça Dupla Marquinha (@bemiemodapraia)',
    caption: 'coconut tie dye 🥥🌴',
    href: 'https://www.instagram.com/bemiemodapraia/p/Decr-Muvs0k/',
    productId: 'p_wnba68hp',
  },
  {
    id: 'ig-6',
    image: '/bemie/products/ig_bemie_6.jpg',
    alt: 'Bemiê + Versátil — Biquíni Scarlet e saída listrada (@bemiemodapraia)',
    caption: 'bemiê + versátil 🌹🍒',
    href: 'https://www.instagram.com/bemiemodapraia/reel/Deb3FzTx6eT/',
    productId: 'p_6ltgmlin',
  },
];


