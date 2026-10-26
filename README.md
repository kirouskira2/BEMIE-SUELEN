# 👙 Bemiê Moda Praia — E-commerce & Catálogo Digital

Experiência de e-commerce e catálogo digital de moda praia para a **Bemiê Moda Praia**, com visual editorial refinado (inspirado em referências de moda praia de luxo), animações GSAP de alto impacto, rolagem suave com Lenis, carrinho interativo com consulta de CEP automática (ViaCEP) e finalização de pedido direta no WhatsApp.

---

## ✨ Principais Funcionalidades

- **Preloader & Abertura Cinematográfica:** Animação de entrada fluida com GSAP e curva de easing personalizada (`hop`).
- **Smooth Scroll com Lenis:** Rolagem ultra suave com sincronização precisa com a TopBar e controle de pausamento dinâmico em modais e gavetas.
- **TopBar Inteligente:** Ocultação automática ao rolar para baixo e revelação suave ao rolar para cima, além de contador de carrinho dinâmico e atalhos de categoria.
- **Hero & Marquee de Confiança:** Apresentação visual da marca acompanhada por faixas de benefícios (Frete para todo o Brasil, Pagamento Seguro via Pix/Cartão e Atendimento VIP no WhatsApp).
- **Eagle Showcase (Lookbook Editorial):** Vitrine interativa de três colunas (Asa Delta, Marquinha, Alça Dupla) integrada com prévias de Reels do Instagram e atalhos rápidos para os modelos no catálogo.
- **Catálogo de Produtos Completo:**
  - Filtros por categoria e busca em tempo real.
  - Seleção de tamanhos (P, M, G, GG) com controle dinâmico de estoque disponível.
  - Cálculo de ofertas: 20% OFF, cálculo de desconto Pix e parcelamento.
  - Efeito de zoom interativo nas fotos das peças.
- **Gaveta de Carrinho (Cart Drawer):**
  - Gerenciamento de itens e quantidades com trava de estoque máximo.
  - Etapa de checkout com busca de endereço automática via API ViaCEP.
  - Formatação brasileira automática de CEP e telefone celular.
  - Geração de mensagem estruturada e link direto para finalização do pedido no WhatsApp oficial da loja.
- **Instagram Grid:** Galeria conectada com links diretos para compras dos looks em destaque.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **GSAP (GreenSock)** + `@gsap/react` (ScrollTrigger, CustomEase)
- **Lenis** (Smooth Scrolling)
- **Lucide React** (Ícones modernos)
- **Bun** (Gerenciador de pacotes e runtime ultra rápido)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+) ou [Bun](https://bun.sh/) instalado.

### Passo a Passo

1. **Instalar as dependências:**
   ```bash
   bun install
   # ou: npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   bun dev
   # ou: npm run dev
   ```
   Acesse no seu navegador: `http://localhost:3000`

3. **Executar os testes unitários:**
   ```bash
   bun test
   # ou: npm test
   ```

4. **Gerar a build de produção:**
   ```bash
   bun run build
   # ou: npm run build
   ```

5. **Iniciar o preview da build:**
   ```bash
   bun run preview
   # ou: npm run preview
   ```

---

## 📁 Estrutura do Projeto

```
BEMIE/
├── public/                 # Imagens, vídeos, fontes e favicons estáticos
├── src/
│   ├── components/         # Componentes React (TopBar, BemieCatalog, CartDrawer, etc.)
│   ├── data/               # Dados do catálogo e configurações da loja (siteData.ts)
│   ├── styles/             # Folhas de estilo adicionais e utilitários de animação
│   ├── utils/              # Funções utilitárias (matemática, máscaras de CEP, WhatsApp)
│   │   ├── animationMath.ts
│   │   └── animationMath.test.ts # 17 testes unitários automatizados
│   ├── App.tsx             # Componente raiz da aplicação
│   ├── index.css           # Estilos globais e tokens Tailwind CSS
│   └── main.tsx            # Ponto de entrada do React
├── index.html              # HTML com meta tags SEO e Open Graph
├── package.json            # Metadados e dependências
├── tsconfig.json           # Configurações TypeScript
└── vite.config.ts          # Configuração do Vite e plugins
```

---

## 👩‍💻 Autoria & Direitos

Projeto desenvolvido para a **Bemiê Moda Praia**.
Repositório: [kirouskira2/BEMIE-SUELEN](https://github.com/kirouskira2/BEMIE-SUELEN)
