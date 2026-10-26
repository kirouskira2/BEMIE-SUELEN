import React from 'react';
import { Copy } from './Copy';

interface CtaWindowProps {
  img: string;
  header: string;
  callout: string;
  description?: string;
}

export const CtaWindow = React.memo(function CtaWindow({
  img,
  header,
  callout,
  description,
}: CtaWindowProps) {
  return (
    <section className="cta-window" data-transition="fade-in-up">
      <div className="container">
        <div className="cta-window-img-wrapper">
          <img
            src={img}
            alt="Coleção Bemiê Moda Praia"
            className="lazyload fade-in lazyloaded"
            referrerPolicy="no-referrer"
          />
          <div className="placeholder-fade" aria-hidden="true" />
        </div>
        <div className="cta-window-img-overlay" />
        <div className="cta-window-header">
          <Copy delay={0.1}>
            <h1>{header}</h1>
          </Copy>
        </div>
        <div className="cta-window-footer">
          <div className="cta-window-callout">
            <Copy delay={0.1}>
              <h3>{callout}</h3>
            </Copy>
          </div>
          {description && (
            <div className="cta-window-description">
              <Copy delay={0.1}>
                <p>{description}</p>
              </Copy>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
