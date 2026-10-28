import React from 'react';

// Ícone oficial Pix Banco Central extraído fielmente da imagem enviada pelo usuário
export function PixIcon({ size = 19 }: { className?: string; size?: number }) {
  return (
    <img
      src="/assets/pix-official.png"
      alt="Pix"
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
        display: 'block',
      }}
    />
  );
}

// Ícones de bandeiras de cartões (Mastercard / Visa / Elo)
export function CardBadges() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        borderRadius: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        flexShrink: 0,
      }}
    >
      {/* Mastercard Interlocking Circles */}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} title="Mastercard">
        <span
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: '#EB001B',
            opacity: 0.9,
            display: 'inline-block',
          }}
        />
        <span
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: '#F79E1B',
            opacity: 0.85,
            marginLeft: '-5px',
            display: 'inline-block',
          }}
        />
      </span>
      {/* Visa Wordmark */}
      <span
        style={{
          fontSize: '10px',
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.05em',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'sans-serif',
          lineHeight: 1,
          flexShrink: 0,
        }}
        title="Visa"
      >
        VISA
      </span>
      {/* Elo */}
      <span
        style={{
          fontSize: '8px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'rgba(255, 255, 255, 0.9)',
          padding: '1px 3px',
          borderRadius: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          lineHeight: 1,
          flexShrink: 0,
        }}
        title="Elo"
      >
        ELO
      </span>
    </div>
  );
}

// Ícone WhatsApp oficial
export function WhatsAppIcon({ size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0, display: 'block' }}
      aria-label="WhatsApp"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.712 1.456h.005c6.554 0 11.89-5.336 11.893-11.894 0-3.177-1.237-6.164-3.48-8.411" />
    </svg>
  );
}

// Ícone Plane vetorizado de alta nitidez
export function PlaneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '16px', height: '16px', flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

// Lista dos 3 itens com design rigorosamente alinhado ao design system Bemiê
export const TRUST_BENEFITS = [
  {
    id: 'entrega',
    icon: (
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <PlaneIcon />
      </div>
    ),
    content: (
      <span className="bemie-trust-text">
        Entrega rápida e segura em{' '}
        <strong className="bemie-trust-bold">todo o Brasil</strong>{' '}
        com envio <em className="bemie-trust-serif">prioritário</em>
      </span>
    ),
  },
  {
    id: 'pagamento',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 189, 174, 0.16)',
            border: '1px solid rgba(0, 189, 174, 0.38)',
            color: '#00BDAE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PixIcon size={15} />
        </div>
        <CardBadges />
      </div>
    ),
    content: (
      <span className="bemie-trust-text">
        Pagamentos via{' '}
        <strong className="bemie-trust-bold">Pix</strong> ·{' '}
        <strong className="bemie-trust-bold">Crédito</strong> em até 2x sem juros ·{' '}
        <em className="bemie-trust-serif">Débito</em>
      </span>
    ),
  },
  {
    id: 'whatsapp',
    icon: (
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(37, 211, 102, 0.16)',
            border: '1px solid rgba(37, 211, 102, 0.38)',
            color: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WhatsAppIcon size={14} />
        </div>
        {/* Pulsing online status indicator verde */}
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            display: 'flex',
            width: '8px',
            height: '8px',
          }}
        >
          <span
            className="animate-ping"
            style={{
              position: 'absolute',
              display: 'inline-flex',
              height: '100%',
              width: '100%',
              borderRadius: '9999px',
              backgroundColor: '#25D366',
              opacity: 0.75,
            }}
          />
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              borderRadius: '9999px',
              width: '8px',
              height: '8px',
              backgroundColor: '#25D366',
            }}
          />
        </span>
      </div>
    ),
    content: (
      <span className="bemie-trust-text">
        Atendimento instantâneo via{' '}
        <strong className="bemie-trust-bold">WhatsApp</strong> com suporte{' '}
        <em className="bemie-trust-serif">humano e dedicado</em>
      </span>
    ),
  },
];

// 4 repetições por faixa para loop 100% contínuo e sem gaps em qualquer resolução
const SEAMLESS_BENEFITS = [
  ...TRUST_BENEFITS,
  ...TRUST_BENEFITS,
  ...TRUST_BENEFITS,
  ...TRUST_BENEFITS,
];

export const TrustMarquee = React.memo(function TrustMarquee() {
  return (
    <div
      className="bemie-trust-marquee-wrapper group"
      role="region"
      aria-label="Vantagens e garantias Bemiê"
    >
      {/* ======================================================== */}
      {/* EFEITO EMBAÇADO / FADE NAS BORDAS (ESQUERDA E DIREITA)  */}
      {/* ======================================================== */}
      <div className="bemie-trust-mask-left" aria-hidden="true" />
      <div className="bemie-trust-mask-right" aria-hidden="true" />

      {/* TRACK DO CARROSSEL EM LOOP DUPLO PERFEITO */}
      <div className="bemie-trust-track">
        {/* Faixa Principal */}
        <div className="bemie-trust-animate">
          {SEAMLESS_BENEFITS.map((item, index) => (
            <div key={`track1-${item.id}-${index}`} className="bemie-trust-item">
              {item.icon}
              {item.content}
              <span className="bemie-trust-dot" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Faixa Espelho (Clone idêntico para loop infinito imperceptível) */}
        <div aria-hidden="true" className="bemie-trust-animate">
          {SEAMLESS_BENEFITS.map((item, index) => (
            <div key={`track2-${item.id}-${index}`} className="bemie-trust-item">
              {item.icon}
              {item.content}
              <span className="bemie-trust-dot" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TrustMarquee;
