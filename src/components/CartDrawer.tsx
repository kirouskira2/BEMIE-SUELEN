import React, { useState, useEffect } from 'react';
import { BEMIE_PRODUCTS, STORE_CONFIG } from '../data/siteData';
import {
  calculateProductOffer,
  formatBrl,
  getStockForSize,
  buildWhatsAppOrderUrl,
  formatCep,
  formatBrazilPhone,
} from '../utils/animationMath';

export interface CartItem {
  produtoId: string;
  tamanho: string;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (produtoId: string, tamanho: string, nextQty: number) => void;
  onClearCart: () => void;
  onNavigateCatalog?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
  onNavigateCatalog,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [numero, setNumero] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [complemento, setComplemento] = useState('');
  const [pagamento, setPagamento] = useState<'pix' | 'credito' | 'debito'>('pix');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setErrorMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCepChange = async (rawVal: string) => {
    const formatted = formatCep(rawVal);
    setCep(formatted);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            if (data.logradouro) setEndereco(data.logradouro);
            if (data.bairro) setBairro(data.bairro);
            if (data.localidade) {
              setCidade(data.uf ? `${data.localidade} - ${data.uf}` : data.localidade);
            }
          }
        }
      } catch {
        // Falha silenciosa caso offline; preenchimento manual continua disponível
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  if (!isOpen) return null;

  const detailedItems = cart
    .map((item) => {
      const product = BEMIE_PRODUCTS.find((p) => p.id === item.produtoId);
      if (!product) return null;
      const offer = calculateProductOffer(product);
      const maxStock = getStockForSize(product.tamanhos, item.tamanho);
      return {
        ...item,
        product,
        unitPrice: offer.current,
        maxStock,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = detailedItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  const whatsappUrl = buildWhatsAppOrderUrl(
    STORE_CONFIG.whatsapp,
    detailedItems.map((i) => ({
      nome: i.product.nome,
      cor: i.product.cor,
      tamanho: i.tamanho,
      qty: i.qty,
      unitPrice: i.unitPrice,
    })),
    {
      nome,
      telefone,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      complemento,
      pagamento,
    }
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('Por favor, informe seu nome completo para enviar o pedido.');
      return;
    }
    setErrorMsg('');
  };

  return (
    <div className="bemie-drawer-backdrop" onClick={onClose}>
      <aside
        className="bemie-drawer numana-cart-drawer"
        aria-label="Carrinho de compras Bemiê"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Conectores côncavos que fundem o Sidebar à moldura superior e inferior de 10px */}
        <svg
          className="bemie-drawer-ear bemie-drawer-ear--top text-frame"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="bemie-drawer-ear bemie-drawer-ear--bottom text-frame"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z"
            fill="currentColor"
          />
        </svg>

        <div className="bemie-drawer-header">
          <div className="bemie-drawer-brand">
            <img
              src="/assets/bemie-letters.png"
              alt="Bemiê Moda Praia"
              className="bemie-drawer-brand-img"
            />
            <div>
              <p className="bemie-eyebrow">BEMIÊ MODA PRAIA</p>
              <h3>{step === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}</h3>
            </div>
          </div>
          <button
            type="button"
            className="bemie-drawer-close"
            aria-label="Fechar carrinho"
            onClick={onClose}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M1 1L13 13M13 1L1 13" />
            </svg>
          </button>
        </div>

        {step === 'cart' ? (
          <>
            <div className="bemie-drawer-body">
              {detailedItems.length === 0 ? (
                <div className="bemie-drawer-empty">
                  <p>Seu carrinho está vazio.</p>
                  <p className="bemie-muted">
                    Explore as peças da coleção e adicione seus biquínis favoritos.
                  </p>
                  <button
                    type="button"
                    className="bemie-action-primary"
                    style={{ marginTop: '0.75rem', alignSelf: 'center' }}
                    onClick={() => {
                      onClose();
                      onNavigateCatalog?.();
                    }}
                  >
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                detailedItems.map((item) => (
                  <div
                    className="bemie-cart-row"
                    key={`${item.produtoId}_${item.tamanho}`}
                  >
                    <img
                      src={item.product.photos[0]}
                      alt={item.product.nome}
                      className="bemie-cart-thumb"
                      referrerPolicy="no-referrer"
                    />
                    <div className="bemie-cart-info">
                      <h4>{item.product.nome}</h4>
                      <p className="bemie-muted">
                        Tam: {item.tamanho} · {item.product.cor}
                      </p>
                      <div className="bemie-cart-qty-row">
                        <div className="bemie-qty-controls">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${item.product.nome}`}
                            onClick={() =>
                              onUpdateQty(item.produtoId, item.tamanho, item.qty - 1)
                            }
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${item.product.nome}`}
                            disabled={item.qty >= item.maxStock}
                            onClick={() =>
                              onUpdateQty(item.produtoId, item.tamanho, item.qty + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="bemie-cart-line-price">
                          {formatBrl(item.unitPrice * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {detailedItems.length > 0 && (
              <div className="bemie-drawer-footer">
                <div className="bemie-summary-line">
                  <span>Previsão de entrega</span>
                  <span>{STORE_CONFIG.previsaoEntrega}</span>
                </div>
                <div className="bemie-summary-line total">
                  <span>Total</span>
                  <span>{formatBrl(subtotal)}</span>
                </div>
                <div className="bemie-drawer-btns">
                  <button
                    type="button"
                    className="bemie-action-primary full"
                    onClick={() => setStep('checkout')}
                  >
                    Avançar para dados de entrega
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bemie-action-secondary full"
                  >
                    Enviar direto no WhatsApp {STORE_CONFIG.whatsappDisplay}
                  </a>
                  <button
                    type="button"
                    className="bemie-clear-cart-btn"
                    onClick={onClearCart}
                  >
                    Esvaziar carrinho
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <form className="bemie-drawer-body bemie-checkout-form" onSubmit={handleCheckoutSubmit}>
            {errorMsg && (
              <div className="bemie-form-error" role="alert">
                {errorMsg}
              </div>
            )}
            <div className="bemie-field">
              <label htmlFor="ck-nome">Nome completo *</label>
              <input
                id="ck-nome"
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="bemie-field">
              <label htmlFor="ck-telefone">WhatsApp para contato</label>
              <input
                id="ck-telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatBrazilPhone(e.target.value))}
                placeholder="(81) 90000-0000"
              />
            </div>
            <div className="bemie-field-row">
              <div className="bemie-field">
                <label htmlFor="ck-cep">
                  CEP {isLoadingCep ? '· Buscando…' : ''}
                </label>
                <input
                  id="ck-cep"
                  type="text"
                  inputMode="numeric"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                />
              </div>
              <div className="bemie-field">
                <label htmlFor="ck-numero">Número</label>
                <input
                  id="ck-numero"
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>
            <div className="bemie-field">
              <label htmlFor="ck-endereco">Endereço</label>
              <input
                id="ck-endereco"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, avenida…"
              />
            </div>
            <div className="bemie-field-row">
              <div className="bemie-field">
                <label htmlFor="ck-bairro">Bairro</label>
                <input
                  id="ck-bairro"
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Seu bairro"
                />
              </div>
              <div className="bemie-field">
                <label htmlFor="ck-cidade">Cidade / UF</label>
                <input
                  id="ck-cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Recife - PE"
                />
              </div>
            </div>
            <div className="bemie-field">
              <label htmlFor="ck-complemento">Complemento</label>
              <input
                id="ck-complemento"
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apto, bloco, referência…"
              />
            </div>

            <div className="bemie-field">
              <label>Forma de pagamento</label>
              <div className="bemie-pay-grid">
                {(['pix', 'credito', 'debito'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`bemie-pay-chip ${pagamento === p ? 'active' : ''}`}
                    onClick={() => setPagamento(p)}
                  >
                    {p === 'pix' ? 'Pix' : p === 'credito' ? 'Crédito' : 'Débito'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bemie-drawer-btns">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bemie-action-primary full"
                onClick={(e) => {
                  if (!nome.trim()) {
                    e.preventDefault();
                    setErrorMsg('Por favor, informe seu nome completo para enviar o pedido.');
                    return;
                  }
                  setErrorMsg('');
                  onClearCart();
                }}
              >
                Abrir WhatsApp e Enviar Pedido ({formatBrl(subtotal)})
              </a>
              <button
                type="button"
                className="bemie-action-secondary full"
                onClick={() => setStep('cart')}
              >
                Voltar ao carrinho
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}
