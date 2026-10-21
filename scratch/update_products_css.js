const fs = require('fs');
const path = require('path');

const targetPaths = [
  path.join(__dirname, '..', 'public_html', 'css', 'shikshit', 'products.css'),
  path.join(__dirname, '..', 'public_html (77)', 'css', 'shikshit', 'products.css')
];

for (const targetFile of targetPaths) {
  let content = fs.readFileSync(targetFile, 'utf8');

  // 1. Ensure html scroll-padding-top: 110px exists
  if (!content.includes('scroll-padding-top: 110px')) {
    content = `/* Shikshit Products Page Base Scoping */
html {
  scroll-padding-top: 110px;
}

` + content;
  }

  // 2. Replace Hero & Marquee section (from "0. FLOATING WHITE-GLASS PILL NAVBAR" or "1. PRODUCTS & SERVICES HERO" up to before "2. STICKY PILL-SHAPED SECTION INDEX")
  const heroStartRegex = /\/\* -{50,}\r?\n\s*(?:0\.\s*FLOATING WHITE-GLASS PILL NAVBAR|1\.\s*PRODUCTS & SERVICES HERO)[\s\S]*?(?=\/\* -{50,}\r?\n\s*2\.\s*STICKY PILL-SHAPED SECTION INDEX)/;

  const newHeroAndMarquee = `/* --------------------------------------------------------------------------
   0. FLOATING WHITE-GLASS PILL NAVBAR (Defect Fix 2)
   -------------------------------------------------------------------------- */
body.page-products #scroll-progress-bar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 0%;
  height: 3px !important;
  background: var(--signature-gradient) !important;
  z-index: 10000 !important;
  box-shadow: none !important;
}

body.page-products .shikshit-header {
  position: sticky !important;
  top: 14px !important;
  z-index: 1000 !important;
  width: 100% !important;
  padding: 0 16px !important;
  margin-top: 14px !important;
  margin-bottom: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none !important;
  overflow: visible !important;
}

body.page-products .shikshit-header::before,
body.page-products .shikshit-header::after {
  display: none !important;
}

body.page-products .shikshit-navbar {
  pointer-events: auto !important;
  position: relative !important;
  width: calc(100% - 32px) !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
  height: 64px !important;
  padding: 10px 28px !important;
  background: rgba(255, 255, 255, 0.90) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 999px !important;
  border: 1px solid rgba(124, 58, 237, 0.14) !important;
  box-shadow: 0 10px 30px rgba(11, 11, 59, 0.08) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  transition: height 0.25s ease, padding 0.25s ease, background 0.25s ease, box-shadow 0.25s ease !important;
  overflow: visible !important;
}

body.page-products .shikshit-navbar::before,
body.page-products .shikshit-navbar::after {
  display: none !important;
}

body.page-products .shikshit-logo {
  height: 52px !important;
  width: auto !important;
  margin: 0 !important;
  object-fit: contain !important;
  display: block !important;
  filter: drop-shadow(0 2px 4px rgba(11, 11, 59, 0.08)) !important;
  transition: height 0.25s ease !important;
}

/* Header & Navbar Shrink After Scroll */
@supports (animation-timeline: scroll()) {
  body.page-products .shikshit-navbar {
    animation: navShrink linear both;
    animation-timeline: scroll(root block);
    animation-range: 0px 80px;
  }
  body.page-products .shikshit-logo {
    animation: logoShrink linear both;
    animation-timeline: scroll(root block);
    animation-range: 0px 80px;
  }
}

@keyframes navShrink {
  to {
    height: 56px;
    padding-top: 6px;
    padding-bottom: 6px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 12px 32px rgba(11, 11, 59, 0.12);
  }
}

@keyframes logoShrink {
  to {
    height: 44px;
  }
}

body.page-products .shikshit-header.scrolled .shikshit-navbar,
body.page-products .shikshit-navbar.scrolled {
  height: 56px !important;
  padding: 6px 22px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 12px 32px rgba(11, 11, 59, 0.12) !important;
}

body.page-products .shikshit-header.scrolled .shikshit-logo,
body.page-products .shikshit-navbar.scrolled .shikshit-logo {
  height: 44px !important;
}

/* Desktop vs Mobile Nav Visibility (Strictly Never Together) */
@media (min-width: 980px) {
  body.page-products .mobile-menu-toggle {
    display: none !important;
  }
  body.page-products .shikshit-nav-menu {
    display: flex !important;
    align-items: center !important;
    gap: 28px !important;
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body.page-products .shikshit-nav-actions {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
  }
}

@media (max-width: 979px) {
  body.page-products .shikshit-nav-menu {
    display: none !important;
  }
  body.page-products .shikshit-nav-actions {
    display: none !important;
  }
  body.page-products .mobile-menu-toggle {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 4px !important;
    width: 44px !important;
    height: 44px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(124, 58, 237, 0.2) !important;
    border-radius: 12px !important;
    padding: 0 !important;
    cursor: pointer !important;
  }
}

body.page-products .mobile-menu-toggle .hamburger-line {
  display: block !important;
  width: 22px !important;
  height: 2.5px !important;
  background-color: var(--navy) !important;
  border-radius: 2px !important;
  margin: 0 !important;
}

/* Navbar Buttons & Secondary White */
body.page-products .shikshit-nav-actions .btn-partner,
body.page-products .btn-secondary-white {
  color: var(--navy) !important;
  background: #FFFFFF !important;
  border: 1px solid rgba(124, 58, 237, 0.18) !important;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.08) !important;
}

body.page-products .shikshit-nav-actions .btn-partner:hover,
body.page-products .btn-secondary-white:hover {
  color: var(--violet) !important;
  border-color: rgba(124, 58, 237, 0.35) !important;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.16) !important;
  transform: translateY(-2px) !important;
}

/* Smooth Scroll Margin for Sections */
body.page-products section[id],
body.page-products #scholarship-program,
body.page-products #awareness-programs,
body.page-products #olympiads,
body.page-products #financial-aid,
body.page-products #technical-training,
body.page-products #video-ads,
body.page-products #diploma-courses {
  scroll-margin-top: 155px !important;
}

/* --------------------------------------------------------------------------
   1. PRODUCTS & SERVICES HERO (Defect Fix 3 & Fix 4)
   -------------------------------------------------------------------------- */
body.page-products .products-hero {
  position: relative;
  z-index: 1;
  padding: 56px 0 36px; /* comfortable top padding below sticky navbar (at least 56px) */
  overflow: visible; /* allows full-bleed child ribbons to extend past viewport edges */
}

.products-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
  gap: 36px;
  align-items: center; /* vertically centered against photo collage */
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}

.products-hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
  text-align: left !important;
}

.products-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: var(--radius-pill);
  padding: 8px 20px;
  color: var(--violet);
  font-weight: 700;
  font-size: 0.92rem;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.08);
}

.products-hero-title {
  text-align: left !important;
  font-size: clamp(2.3rem, 4.4vw, 3.9rem);
  font-weight: 800;
  color: var(--navy);
  line-height: 1.14;
  letter-spacing: -0.035em;
  margin-bottom: 20px;
}

body.page-products .products-hero-title .gradient-text,
body.page-products .hero-sig-phrase {
  background: var(--signature-gradient) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  color: transparent !important;
  display: inline-block !important;
  position: relative !important;
}

body.page-products .editorial-sig-underline {
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 14px;
  pointer-events: none;
  overflow: visible;
}

.products-hero-desc {
  font-size: clamp(1.02rem, 1.2vw, 1.15rem);
  line-height: 1.7;
  color: var(--ink);
  margin-bottom: 30px !important; /* 28 to 32px space between paragraph and pill row */
  max-width: 640px;
  text-align: left !important;
}

/* Category Feature Pills Row (Fix 3: All 4 on 1 Row at Desktop) */
.products-hero-tags {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 10px !important;
  margin-bottom: 32px !important; /* 32px between the pills and the buttons */
  justify-content: flex-start !important;
}

.products-tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  border: 1px solid rgba(124, 58, 237, 0.14);
  border-radius: var(--radius-pill);
  padding: 6px 11px !important; /* reduced slightly so all 4 fit on one row at desktop */
  font-size: 12.5px !important;
  font-weight: 600;
  color: var(--navy);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.06);
  transition: transform 0.25s ease, border-color 0.25s ease;
  white-space: nowrap;
}

.products-tag-pill:hover {
  transform: translateY(-2px);
  border-color: rgba(124, 58, 237, 0.35);
}

.products-tag-pill svg {
  color: var(--violet);
  flex-shrink: 0;
}

/* Buttons ("Apply Now", "Explore Services") (Fix 3: 52px height, 14px gap, aligned baseline) */
.products-hero-cta {
  display: flex !important;
  align-items: baseline !important;
  gap: 14px !important;
  flex-wrap: wrap !important;
}

.products-hero-cta .btn-pill {
  height: 52px !important;
  min-height: 52px !important;
  max-height: 52px !important;
  border-radius: 999px !important;
  padding: 0 26px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}

/* Hero Right Visuals: Rebuilt Photo Collage as CSS Grid with Controlled Overlap <= 24px (Fix 4) */
.products-hero-visual {
  position: relative;
  width: 100%;
  max-width: 530px;
  height: 460px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 285px 235px;
  column-gap: -20px; /* Controlled overlap <= 24px */
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.products-arch-frame {
  grid-column: 1;
  width: 285px;
  height: 400px;
  border-radius: 28px !important;
  overflow: hidden;
  border: 5px solid #FFFFFF !important;
  box-shadow: 0 20px 48px rgba(124, 58, 237, 0.16) !important;
  position: relative;
  top: 0;
  left: 0;
  background: var(--lav-50);
  transform: rotate(-3deg);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
  animation: collageFloat1 6s ease-in-out infinite alternate;
  z-index: 1;
}

.products-arch-frame:hover {
  transform: rotate(-3deg) translateY(-8px) scale(1.02);
  box-shadow: 0 28px 56px rgba(124, 58, 237, 0.24) !important;
}

.products-arch-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  object-position: center 25% !important;
  display: block;
}

.products-blob-frame {
  grid-column: 2;
  margin-left: -20px; /* Controlled overlap <= 24px */
  margin-top: 60px;
  width: 235px;
  height: 270px;
  border-radius: 28px !important;
  overflow: hidden;
  border: 5px solid #FFFFFF !important;
  box-shadow: 0 20px 48px rgba(192, 38, 211, 0.18) !important;
  position: relative;
  right: auto;
  bottom: auto;
  background: #FFFFFF;
  transform: rotate(3deg);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
  animation: collageFloat2 6s ease-in-out infinite alternate 1.5s;
  z-index: 2;
}

.products-blob-frame:hover {
  transform: rotate(3deg) translateY(-8px) scale(1.02);
  box-shadow: 0 28px 56px rgba(192, 38, 211, 0.26) !important;
}

.products-blob-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  object-position: center 20% !important;
  display: block;
}

@keyframes collageFloat1 {
  0% { transform: translateY(0) rotate(-3deg); }
  100% { transform: translateY(-8px) rotate(-3deg); }
}

@keyframes collageFloat2 {
  0% { transform: translateY(0) rotate(3deg); }
  100% { transform: translateY(8px) rotate(3deg); }
}

/* Badges & Labels sit bottom-left inside their cards, solid frosted-white, never clipped */
.products-arch-tag {
  position: absolute !important;
  bottom: 16px !important;
  left: 16px !important;
  right: auto !important;
  transform: none !important;
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(124, 58, 237, 0.18) !important;
  border-radius: 999px !important;
  padding: 7px 16px !important;
  color: var(--navy) !important;
  font-size: 12.5px !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
  pointer-events: none !important;
  white-space: nowrap !important;
  z-index: 5 !important;
}

.products-arch-tag svg {
  color: var(--violet) !important;
  flex-shrink: 0;
}

.products-blob-tag {
  position: absolute !important;
  bottom: 16px !important;
  left: 16px !important;
  right: auto !important;
  transform: none !important;
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(124, 58, 237, 0.18) !important;
  border-radius: 999px !important;
  padding: 6px 14px !important;
  color: var(--navy) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 6px !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12) !important;
  pointer-events: none !important;
  z-index: 5 !important;
}

.products-blob-tag svg {
  color: #F59E0B !important;
  flex-shrink: 0;
}

.products-stat-badge {
  position: absolute !important;
  top: 15px !important;
  right: 0 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1px solid rgba(124, 58, 237, 0.16) !important;
  border-radius: 20px !important;
  padding: 14px 20px !important;
  box-shadow: 0 16px 36px rgba(124, 58, 237, 0.14) !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  z-index: 10 !important;
  animation: gentleFloat 5s ease-in-out infinite alternate !important;
}

@keyframes gentleFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}

.products-stat-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--signature-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 20px;
  flex-shrink: 0;
}

.products-stat-badge-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.2;
}

.products-stat-badge-sub {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
}

/* --------------------------------------------------------------------------
   1. FULL-BLEED DUAL RIBBON MARQUEE (Defect Fix 1)
   -------------------------------------------------------------------------- */
body.page-products .products-hero-bands {
  position: relative !important;
  width: 100vw !important;
  margin-left: calc(50% - 50vw) !important;
  margin-right: calc(50% - 50vw) !important;
  margin-top: 40px !important;
  height: 170px !important;
  padding: 24px 0 !important;
  overflow: hidden !important;
  z-index: 10 !important;
  pointer-events: auto !important;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important;
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important;
}

body.page-products .ribbon {
  position: absolute !important;
  left: -6% !important;
  right: -6% !important;
  width: 112% !important;
  max-width: none !important;
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  overflow: hidden !important;
  user-select: none !important;
}

body.page-products .ribbon-gradient {
  top: 30px !important;
  transform: rotate(-1.8deg) !important;
  background: var(--signature-gradient) !important;
  color: #FFFFFF !important;
  box-shadow: 0 16px 40px rgba(192, 38, 211, 0.35) !important;
  z-index: 2 !important;
  max-width: none !important;
}

body.page-products .ribbon-white {
  top: 66px !important; /* offset 36px vertically (24 to 40px requirement) */
  transform: rotate(1.5deg) !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  color: var(--navy) !important;
  box-shadow: 0 12px 32px rgba(124, 58, 237, 0.12) !important;
  border-top: 1.5px solid rgba(124, 58, 237, 0.15) !important;
  border-bottom: 1.5px solid rgba(124, 58, 237, 0.15) !important;
  z-index: 1 !important;
  max-width: none !important;
}

body.page-products .ribbon-track {
  display: flex !important;
  align-items: center !important;
  width: max-content !important;
  background: transparent !important;
  will-change: transform !important;
}

body.page-products .track-left {
  animation: mqRibbonLeft 40s linear infinite !important;
}

body.page-products .track-right {
  animation: mqRibbonRight 55s linear infinite !important;
}

@keyframes mqRibbonLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes mqRibbonRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

body.page-products .products-hero-bands:hover .ribbon-track {
  animation-play-state: paused !important;
}

body.page-products .track-half {
  display: inline-flex !important;
  align-items: center !important;
  gap: 28px !important;
  white-space: nowrap !important;
  font-weight: 800 !important;
  font-size: 1.08rem !important;
  letter-spacing: -0.01em !important;
  padding-right: 28px !important;
}

body.page-products .track-half span:nth-child(even) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.25rem !important;
  line-height: 1 !important;
  opacity: 0.85 !important;
}

body.page-products .ribbon-gradient .track-half span:nth-child(even) {
  color: #FBCFE8 !important;
}

body.page-products .ribbon-white .track-half span:nth-child(even) {
  color: var(--violet) !important;
}

@media (prefers-reduced-motion: reduce) {
  body.page-products .ribbon-track {
    animation: none !important;
    transform: none !important;
    justify-content: center !important;
    width: 100% !important;
  }
}

`;

  if (heroStartRegex.test(content)) {
    content = content.replace(heroStartRegex, newHeroAndMarquee);
    console.log(`Replaced Hero & Marquee section in ${targetFile}`);
  } else {
    console.warn(`Could not match heroStartRegex in ${targetFile}`);
  }

  // 3. Update Responsive Breakpoints at bottom
  const responsiveRegex = /\/\* -{50,}\r?\n\s*7\.\s*RESPONSIVE BREAKPOINTS[\s\S]*$/;
  const newResponsive = `/* --------------------------------------------------------------------------
   7. RESPONSIVE BREAKPOINTS (360, 768, 980, 1024, 1440, 1920px)
   -------------------------------------------------------------------------- */
@media (max-width: 1024px) {
  body.page-products .footer-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 32px !important;
  }

  .products-hero-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: left;
  }

  .products-hero-content {
    align-items: flex-start;
  }

  .products-hero-tags {
    justify-content: flex-start;
  }

  .products-hero-cta {
    justify-content: flex-start;
  }

  .products-hero-visual {
    height: 420px;
    margin-top: 10px;
  }

  .products-arch-frame {
    width: 250px;
    height: 360px;
  }

  .products-blob-frame {
    width: 200px;
    height: 230px;
    margin-top: 50px;
  }

  .products-stat-badge {
    right: 0;
    top: 10px;
  }
}

@media (max-width: 768px) {
  body.page-products .footer-grid {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }

  body.page-products section {
    padding: 50px 16px !important;
  }

  .sticky-section-index {
    top: 76px;
    padding: 8px 12px;
  }

  .index-pill {
    padding: 7px 14px;
    font-size: 12.5px;
  }

  body.page-products .products-hero {
    padding: 44px 0 24px;
  }

  body.page-products .products-hero-bands {
    height: 150px;
    margin-top: 24px;
  }

  body.page-products .ribbon {
    height: 52px;
  }

  body.page-products .track-half {
    font-size: 0.98rem;
    gap: 20px;
    padding-right: 20px;
  }

  body.page-products .ribbon-gradient {
    top: 22px;
    transform: rotate(-1.8deg);
  }

  body.page-products .ribbon-white {
    top: 58px;
    transform: rotate(1.5deg);
  }

  .products-cta-card {
    padding: 44px 24px;
    border-radius: 28px;
  }

  .video-item video {
    height: 200px !important;
  }
}

@media (max-width: 480px) {
  body.page-products .shikshit-navbar {
    height: 58px !important;
    padding: 8px 16px !important;
  }

  body.page-products .shikshit-logo {
    height: 44px !important;
  }

  .products-hero-visual {
    height: 360px;
    grid-template-columns: 180px 140px;
    column-gap: -15px;
  }

  .products-arch-frame {
    width: 180px;
    height: 290px;
  }

  .products-blob-frame {
    width: 140px;
    height: 190px;
    margin-left: -15px;
    margin-top: 40px;
  }

  .products-stat-badge {
    display: none;
  }

  body.page-products .products-hero-bands {
    height: 140px;
    margin-top: 18px;
  }

  body.page-products .ribbon {
    height: 48px;
  }

  body.page-products .track-half {
    font-size: 0.9rem;
    gap: 16px;
    padding-right: 16px;
  }

  body.page-products .ribbon-gradient {
    top: 18px;
    transform: rotate(-1.6deg);
  }

  body.page-products .ribbon-white {
    top: 54px;
    transform: rotate(1.4deg);
  }
}

/* Reduced Motion Safety */
@media (prefers-reduced-motion: reduce) {
  .products-blob-1,
  .products-blob-2,
  .products-blob-3,
  .products-hero-bands .ribbon-track,
  .products-stat-badge,
  .products-arch-frame,
  .products-blob-frame {
    animation: none !important;
    transform: none !important;
  }
  .scholarship-card,
  .video-item,
  .scroll-reveal-item {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

  if (responsiveRegex.test(content)) {
    content = content.replace(responsiveRegex, newResponsive);
    console.log(`Replaced Responsive section in ${targetFile}`);
  } else {
    console.warn(`Could not match responsiveRegex in ${targetFile}`);
  }

  // 4. Exempt products-hero from section > div > div:first-child max-width
  content = content.replace(
    /body\.page-products section > div > div:first-child/g,
    'body.page-products section:not(.products-hero) > div > div:first-child'
  );

  fs.writeFileSync(targetFile, content, 'utf8');
}

console.log('Finished updating products.css in both targets.');
