import React from 'react';

/**
 * SiteFrames: 4 faixas periféricas de 10px e 4 cantos côncavos com curva Bézier cúbica
 * proporcionando a estética de moldura de dispositivo (bezel) de alta fidelidade.
 */
export const SiteFrames = React.memo(function SiteFrames() {
  return (
    <div className="site-frames-root" aria-hidden="true">
      {/* 4 Bordas lineares de 10px da moldura externa */}
      <div className="site-frame site-frame--top" />
      <div className="site-frame site-frame--bottom" />
      <div className="site-frame site-frame--left" />
      <div className="site-frame site-frame--right" />

      {/* 4 cantos côncavos de transição com curva Bézier invertida */}
      <svg
        className="site-corner site-corner--top-left text-frame"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <path
          d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="site-corner site-corner--top-right text-frame"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <path
          d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="site-corner site-corner--bottom-left text-frame"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <path
          d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="site-corner site-corner--bottom-right text-frame"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <path
          d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
});
