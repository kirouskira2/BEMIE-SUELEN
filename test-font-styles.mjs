import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const applyStraightCard = (isMobile) => {
    const media = document.querySelector('.site-hero-media.numana-hero-media');
    const caption = document.querySelector('.numana-hero-caption');
    const copy = document.querySelector('.numana-hero-copy');
    const btn = caption.querySelector('.numana-hero-btn');

    if (isMobile && media) {
      media.style.setProperty('height', 'clamp(240px, 34svh, 285px)', 'important');
      media.style.setProperty('min-height', '240px', 'important');
      media.style.setProperty('max-height', '285px', 'important');
    }

    caption.style.cssText = `
      position: absolute !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      bottom: ${isMobile ? '6px' : '1.25rem'} !important;
      right: auto !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      gap: ${isMobile ? '3px' : '8px'} !important;
      width: max-content !important;
      max-width: calc(100% - 24px) !important;
      z-index: 10 !important;
    `;

    copy.style.cssText = `
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      gap: ${isMobile ? '1px' : '3px'} !important;
      background: rgba(255, 252, 248, 0.88) !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      border: 1px solid rgba(123, 82, 56, 0.28) !important;
      border-radius: 0px !important;
      padding: ${isMobile ? '4px 14px' : '8px 24px'} !important;
      box-shadow: 0 8px 24px rgba(45, 26, 15, 0.08) !important;
    `;

    const eyebrow = copy.querySelector('.numana-hero-eyebrow');
    if (eyebrow) {
      eyebrow.style.cssText = `
        font-family: 'Manrope', sans-serif !important;
        font-size: ${isMobile ? '7px' : '8.5px'} !important;
        font-weight: 500 !important;
        letter-spacing: 0.22em !important;
        text-transform: uppercase !important;
        color: #8c6248 !important;
        line-height: 1.1 !important;
      `;
    }

    const brandGroup = copy.querySelector('.numana-hero-brand-group');
    if (brandGroup) {
      brandGroup.style.cssText = `
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 0px !important;
      `;
    }

    const tag = copy.querySelector('.numana-hero-brand-tag');
    if (tag) {
      tag.style.cssText = `
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-size: ${isMobile ? '11px' : '16px'} !important;
        font-weight: 600 !important;
        letter-spacing: 0.18em !important;
        text-transform: uppercase !important;
        color: #2b180d !important;
        line-height: 1.1 !important;
      `;
    }

    const city = copy.querySelector('.numana-hero-city');
    if (city) {
      city.style.cssText = `
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-size: ${isMobile ? '8.5px' : '11.5px'} !important;
        font-style: italic !important;
        font-weight: 600 !important;
        letter-spacing: 0.32em !important;
        text-transform: uppercase !important;
        color: #7b5238 !important;
        line-height: 1.1 !important;
      `;
    }

    const sub = copy.querySelector('.numana-hero-sub');
    if (sub) {
      sub.style.cssText = `
        font-family: 'Manrope', sans-serif !important;
        font-size: ${isMobile ? '6.8px' : '8.5px'} !important;
        font-weight: 600 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        color: #4a3325 !important;
        margin: 0 !important;
        line-height: 1.15 !important;
      `;
    }

    if (btn) {
      btn.style.cssText = `
        border-radius: 0px !important;
        padding: ${isMobile ? '3px 12px' : '6px 18px'} !important;
        font-family: 'Manrope', sans-serif !important;
        font-size: ${isMobile ? '7.5px' : '9.5px'} !important;
        font-weight: 600 !important;
        letter-spacing: 0.14em !important;
        background: #1c1510 !important;
        color: #f3e9dc !important;
        border: 1px solid #1c1510 !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        box-shadow: 0 4px 14px rgba(28, 21, 16, 0.2) !important;
      `;
    }
  };

  // Desktop
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/?autostart=1', { waitUntil: 'networkidle2' });
  await page.evaluate(applyStraightCard, false);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'straight-card-desktop.png' });

  // Mobile 390
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/?autostart=1', { waitUntil: 'networkidle2' });
  await page.evaluate(applyStraightCard, true);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'straight-card-mobile-390.png' });

  console.log('Saved straight card screenshots');
  await browser.close();
}

run().catch(console.error);
