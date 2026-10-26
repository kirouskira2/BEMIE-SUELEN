# Reprodução pixel-perfect da linha vertical após o contador

## 1. Escopo e fonte de verdade

Este documento descreve a implementação **atual do site Do It Arquitetura**, extraída de `src/routes/index.tsx` e `src/site.css`. Não afirma uma nova comparação pixel a pixel com o site externo de referência. Destina-se a outra IA reproduzir o mesmo efeito, sem reinterpretar medidas ou tempos.

A linha é um elemento HTML `.divider`, não um canvas, shader, SVG ou borda de texto. Ela cresce **do topo para baixo**, no centro horizontal da tela, depois que os números saem e as duas palavras da marca entram. Depois desaparece por opacidade; só então termina a abertura que revela a página.

**Importante:** o contador atual mostra `00 → 27 → 65 → 98 → 99`. Não existe símbolo `%`, nem etapa `100`, nem ligação com progresso real de download. Não acrescentar esses elementos ao reproduzir o que está implementado.

## 2. Geometria e aparência exatas

| Propriedade | Valor |
|---|---|
| Contêiner | `.loader`, fixo em `top: 0; left: 0` |
| Área | `width: 100vw; height: 100svh` |
| Empilhamento | `z-index: 100000` |
| Recorte | `overflow: hidden` no carregador |
| Linha | `position: absolute; top: 0; left: 50%` |
| Espessura | **1 CSS px**, não `1rem` nem espessura proporcional |
| Altura final | `100%` da altura do carregador |
| Cor | `#f2ede620` = RGB `(242, 237, 230)`, alfa `32/255 ≈ 0,12549` |
| Fundo atrás da linha | `#141313`, aplicado aos dois painéis `.block` |
| Origem da transformação | `transform-origin: top` (equivale a `50% 0%`) |
| Estado inicial | `transform: scaleY(0)` e opacidade padrão `1` |
| Estado final do crescimento | `scaleY: "100%"`, equivalente a escala vertical `1` |
| Duração do crescimento | **1 s** |
| Curva do crescimento | GSAP CustomEase `hop`, definida como **`"0.9, 0, 0.1, 1"`** |
| Desaparecimento | Opacidade `1 → 0`, em **0,3 s**, após espera de **0,3 s** |

Não aplicar sombra, brilho, blur, gradiente ou mudança de largura. A linha é bem discreta por causa do alfa baixo.

### Detalhe de cascata que não pode ser “corrigido” silenciosamente

O CSS declara primeiro `transform: translate(-50%)` para `.loader .divider`, mas uma regra posterior com a mesma especificidade declara `transform: scaleY(0)`. A segunda **substitui** a primeira; elas não se somam. Portanto, no estado efetivo, a borda esquerda da linha está em `50%` da largura, sem compensação de meio pixel. Não trocar por `translateX(-50%) scaleY(0)` se o objetivo é reproduzir exatamente o código atual.

`100svh` significa a altura pequena do viewport, relevante para navegadores móveis. Não substituir indiscriminadamente por `100vh`. Em viewport de 1158 × 897 CSS px, se `100svh` coincidir com os 897 px, a linha começa em x = 579 e alcança altura = 897 px. A posição pode cair em meio pixel em larguras ímpares; preserve isso.

## 3. Ordem das camadas

Dentro do carregador, mantenha a ordem: `.overlay` com dois `.block` → `.intro-logo` → `.divider` → spinner → contador. A linha vem depois da marca no DOM. O contador tem `z-index: 2`. Não adicionar um `z-index` independente à linha.

Os dois painéis têm `width: 100%` dentro de um flex horizontal; com o encolhimento flex padrão, cada um ocupa metade da largura. Quando revelam a página, o recorte de cada painel fecha de baixo para cima, com defasagem de 0,1 s. **A linha não é a borda de abertura de uma cortina lateral.**

## 4. Cronologia exata

A timeline principal tem `delay: 0.3` e `defaults: { ease: "hop" }`. A tabela usa tempo local da timeline, sem esse atraso inicial. Para o tempo após criação da timeline, somar **0,3 s**. Os valores pressupõem os cinco pares de dígitos existentes e execução contínua, sem suspensão da aba.

| Tempo local | Ação |
|---|---|
| 0 a 6,075 s | Entrada e saída dos cinco pares de números, com `stagger: 0.075` |
| 6,075 a 6,375 s | Spinner desaparece |
| 6,075 a 7,075 s | Duas palavras entram simultaneamente em `y: "0%"` |
| **7,075 a 8,075 s** | **Linha cresce de `scaleY(0)` até `scaleY(1)`** |
| 8,075 s | Callback agenda o fade da linha |
| **8,375 a 8,675 s** | **Linha desaparece por opacidade** |
| 8,375 a 9,375 s | Primeira palavra sai para baixo; segunda sai para cima |
| 9,125 a 10,225 s | Painéis são recolhidos, com `stagger: 0.1` |
| 9,125 s em diante | Imagem principal anima escala para `1` durante 2 s |
| 10,225 s | Carregador deixa de bloquear cliques; estado de animação é desligado |

Assim, a linha começa aproximadamente **7,375 s** após a criação da timeline e termina de desaparecer em **8,975 s**. Não iniciar seu crescimento junto com o primeiro número.

### Curva e cuidado com GSAP

Registrar `CustomEase` e criar `hop` com `CustomEase.create("hop", "0.9, 0, 0.1, 1")`. Essa curva aproxima-se de um avanço lento no começo, aceleração intensa no meio e desaceleração no fim. Não substituir por `linear`, `power3.out` ou uma spring.

O fade é criado por um `gsap.to` separado, **dentro de `onComplete`**, sem `ease` explícito. Ele não herda os defaults da timeline; na configuração padrão do GSAP usa `power1.out`. Não inserir o fade como um passo sequencial na timeline, pois isso mudaria o tempo das palavras e da revelação.

`hop` é um nome global: o componente do menu também registra uma curva com esse mesmo nome. O tween usa a curva registrada quando é criado. Para uma reprodução isolada e determinística da entrada da página, use a definição da página acima e não a curva do menu. Se reproduzir a aplicação inteira, preserve a ordem de registro ou valide a curva efetivamente resolvida.

## 5. Estrutura real do carregador (React/JSX)

`counts` deve ser:

```js
const counts = [["0", "0"], ["2", "7"], ["6", "5"], ["9", "8"], ["9", "9"]];
```

A seguir está o JSX extraído. Em HTML puro, substituir `className` por `class` e expandir os pares de dígitos; não inserir wrappers que alterem posicionamento ou recorte.

```tsx
        <div className="loader">
          <div className="overlay">
            <div className="block" />
            <div className="block" />
          </div>
          <div className="intro-logo">
            <div className="word" id="word-1">
              <h1>
                <span>Do It</span>
              </h1>
            </div>
            <div className="word" id="word-2">
              <h1>Arquitetura</h1>
            </div>
          </div>
          <div className="divider" />
          <div className="spinner-container">
            <div className="spinner" />
          </div>
          <div className="counter">
            {counts.map((count, i) => (
              <div className="count" key={i}>
                {count.map((digit, j) => (
                  <div className="digit" key={j}>
                    <h1>{digit}</h1>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
```

## 6. CSS do carregador extraído

Estes valores locais servem para a reprodução; em uma aplicação com tema, mantê-los em tokens sem mudar o valor computado.

```css
:root {
  --base-100: #f2ede6;
  --base-300: #998f82;
  --base-350: #80776c;
  --base-400: #665f56;
  --base-500: #141313;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Manrope Variable', sans-serif; }
h1 { letter-spacing: -.25rem; font-size: 5rem; font-weight: 500; line-height: 1.05; }
@media (width <= 1000px) { h1 { letter-spacing: -.1rem; font-size: 3rem; } }
.loader{z-index:100000;pointer-events:all;width:100vw;height:100svh;position:fixed;top:0;left:0;overflow:hidden}
.loader .overlay{width:100%;height:100%;color:var(--base-100);display:flex;position:absolute;top:0}
.loader .block{background:var(--base-500);width:100%;height:100%}
.loader .intro-logo{gap:.5rem;display:flex;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.loader #word-1{color:var(--base-100);padding-right:.25rem;position:relative;left:0}
.loader #word-2{color:var(--base-100);padding-right:.25rem;position:relative;left:.5rem}
.loader .word h1{color:var(--base-300);letter-spacing:-.05rem;font-size:2rem}
.loader .divider{transform-origin:top;background-color:#f2ede620;width:1px;height:100%;position:absolute;top:0;left:50%;transform:translate(-50%)}
.loader .spinner-container{position:absolute;bottom:10%;left:50%;transform:translate(-50%)}
.loader .spinner{border:1.4px solid var(--base-350);border-top-color:#f2ede60d;border-radius:50%;width:50px;height:50px;animation:1s linear infinite spin}
.loader .counter{z-index:2;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.loader .count{display:flex;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.loader .digit{flex:1;padding-top:1rem}
.loader .count .digit h1{color:var(--base-400);font-size:15rem;font-weight:400}
.loader .line,.loader .word,.loader .count .digit{clip-path:polygon(0 0,100% 0,100% 100%,0% 100%)}
.loader .line h1,.loader .line p,.loader .count .digit h1{will-change:transform;position:relative;transform:translateY(120%)}
.loader #word-1 h1{transform:translateY(-120%)}
.loader #word-2 h1{transform:translateY(120%)}
.loader .block{clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 100%)}
.loader .divider{will-change:transform;transform:scaleY(0)}
@keyframes spin { to { transform: rotate(360deg); } }
@media (width <= 1000px) {
  .loader .counter .count .digit h1 { font-size: 7rem; }
  .loader .counter .count .digit { padding-top: .25rem; }
}
```

Carregar a fonte **Manrope Variable** antes da comparação visual. Considerar `1rem = 16px` apenas quando o tamanho computado da raiz for 16px. Não usar fonte de substituição para aprovar alinhamento da marca e do contador. A linha, por outro lado, continua com 1 CSS px, independente de `rem`.

## 7. Timeline real extraída

Executar apenas no navegador, depois da montagem do carregador. No site atual esse trecho está em um efeito de layout; GSAP e CustomEase já foram registrados. `setLoaderAnimating` controla o bloqueio de scroll usando Lenis, não a geometria da linha.

```ts
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const tl = gsap.timeline({ delay: 0.3, defaults: { ease: "hop" } });
    const countEls = document.querySelectorAll(".count");

    countEls.forEach((count, index) => {
      const digits = count.querySelectorAll(".digit h1");
      tl.to(digits, { y: "0%", duration: 1, stagger: 0.075 }, index * 1);
      if (index < countEls.length) {
        tl.to(digits, { y: "-100%", duration: 1, stagger: 0.075 }, index * 1 + 1);
      }
    });

    tl.to(".spinner", { opacity: 0, duration: 0.3 });
    tl.to(".word h1", { y: "0%", duration: 1 }, "<");
    tl.to(".divider", {
      scaleY: "100%",
      duration: 1,
      onComplete: () => gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 }),
    });
    tl.to("#word-1 h1", { y: "100%", duration: 1, delay: 0.3 });
    tl.to("#word-2 h1", { y: "-100%", duration: 1 }, "<");
    tl.to(
      ".block",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        stagger: 0.1,
        delay: 0.75,
        onStart: () => {
          gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" });
        },
        onComplete: () => {
          gsap.set(".loader", { pointerEvents: "none" });
          setLoaderAnimating(false);
        },
      },
      "<",
    );

```

Em implementação sem React, substituir somente `setLoaderAnimating(false)` por uma função que libere o scroll (por exemplo, `lenis.start()` na instância existente). Parar Lenis antes do início. Não trocar as propriedades animadas, os tempos, os delays ou as posições relativas `"<"`.

O último par de dígitos também sai: a condição do código é `index < countEls.length`, verdadeira para todos os índices válidos. Não mudar para `length - 1`, pois isso deixaria o último número na tela.

## 8. Teste isolado da linha

Para ajustar apenas a linha, reutilize o CSS acima e o seguinte trecho com a estrutura já montada. Este teste **não substitui** a timeline completa.

```js
gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
gsap.set(".loader .divider", { scaleY: 0, opacity: 1 });
gsap.to(".loader .divider", {
  scaleY: "100%",
  duration: 1,
  ease: "hop",
  onComplete: () => gsap.to(".loader .divider", {
    opacity: 0,
    duration: 0.3,
    delay: 0.3,
  }),
});
```

## 9. Checklist para outra IA

- [ ] Usar elemento DOM real de 1px, altura de 100% e origem no topo.
- [ ] Preservar a cor com alfa hexadecimal `20`, não confundir com 20% de opacidade.
- [ ] Preservar a cascata de `transform` e `left: 50%`.
- [ ] Não aplicar a curva `hop` do menu no lugar da curva da página.
- [ ] Fazer a linha aparecer depois da entrada da marca, não durante o contador.
- [ ] Animar escala, não `height`, e não crescimento a partir do centro.
- [ ] Manter o fade separado da timeline principal e sobreposto à saída das palavras.
- [ ] Não criar abertura horizontal ou substituir os painéis por uma transição genérica.
- [ ] Comparar capturas no mesmo viewport, DPR, fonte e instante da animação.
- [ ] Conferir a linha em início, meio e fim do crescimento e durante o fade; não aprovar só o frame final.
- [ ] Confirmar que, ao final, cliques e scroll voltam a funcionar.

## 10. Limites da verificação deste documento

Medidas, cores, seletores, JSX e timeline foram conferidos contra os arquivos atuais do projeto. Os tempos da tabela foram calculados pela composição da timeline e dos staggers. Este documento não contém uma nova captura visual nem uma garantia de igualdade com o site externo: serve como especificação fiel do carregador implementado.
