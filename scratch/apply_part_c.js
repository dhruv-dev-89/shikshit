const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

// ============================================================================
// A. CSS for become-a-member.html ("Join the Journey" Theme)
// ============================================================================
const memberThemeCss = `
/* ==========================================================================
   THEME: "Join the Journey" (Become a Member Page)
   Scoped under body.page-member
   ========================================================================== */

/* Aurora Background Wash */
body.page-member {
  background: linear-gradient(135deg, #FDFBFF 0%, #F5F3FF 35%, #FDF2F8 70%, #FFF7ED 100%) !important;
  min-height: 100vh;
  position: relative;
}

/* Fixed Ambient Layer (Behind content, pointer-events none) */
.member-ambient-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  aria-hidden: true;
}

/* 3-4 Large Blurred Gradient Blobs */
.member-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  pointer-events: none;
  will-change: transform;
}

.member-blob-1 {
  top: -10%;
  left: -5%;
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(192, 38, 211, 0.15) 60%, transparent 80%);
  animation: memberBlobDrift1 32s ease-in-out infinite alternate;
}

.member-blob-2 {
  top: 40%;
  right: -8%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.30) 0%, rgba(255, 233, 224, 0.20) 60%, transparent 80%);
  animation: memberBlobDrift2 38s ease-in-out infinite alternate;
}

.member-blob-3 {
  bottom: -5%;
  left: 20%;
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(254, 215, 170, 0.25) 60%, transparent 80%);
  animation: memberBlobDrift3 28s ease-in-out infinite alternate;
}

@keyframes memberBlobDrift1 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(60px, 80px, 0) scale(1.08); }
  100% { transform: translate3d(-40px, 120px, 0) scale(0.95); }
}

@keyframes memberBlobDrift2 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-80px, -60px, 0) scale(1.12); }
  100% { transform: translate3d(50px, -100px, 0) scale(0.92); }
}

@keyframes memberBlobDrift3 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(70px, -70px, 0) scale(1.06); }
  100% { transform: translate3d(-60px, 40px, 0) scale(1.1); }
}

/* Upward Drifting Learning Shapes (Grad caps, books, pencils, stars) */
.member-floating-shape {
  position: absolute;
  color: rgba(124, 58, 237, 0.22);
  fill: currentColor;
  pointer-events: none;
  animation: memberShapeFloatUp linear infinite;
  will-change: transform, opacity;
}

.member-floating-shape:nth-child(1) { left: 8%; width: 28px; height: 28px; animation-duration: 22s; animation-delay: 0s; }
.member-floating-shape:nth-child(2) { left: 24%; width: 34px; height: 34px; animation-duration: 26s; animation-delay: -6s; color: rgba(236, 72, 153, 0.22); }
.member-floating-shape:nth-child(3) { left: 45%; width: 22px; height: 22px; animation-duration: 18s; animation-delay: -12s; color: rgba(192, 38, 211, 0.24); }
.member-floating-shape:nth-child(4) { left: 62%; width: 30px; height: 30px; animation-duration: 28s; animation-delay: -4s; color: rgba(124, 58, 237, 0.20); }
.member-floating-shape:nth-child(5) { left: 78%; width: 26px; height: 26px; animation-duration: 20s; animation-delay: -16s; color: rgba(236, 72, 153, 0.22); }
.member-floating-shape:nth-child(6) { left: 90%; width: 32px; height: 32px; animation-duration: 24s; animation-delay: -8s; color: rgba(124, 58, 237, 0.25); }

@keyframes memberShapeFloatUp {
  0% {
    transform: translateY(110vh) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: 0.65;
  }
  85% {
    opacity: 0.65;
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
    opacity: 0;
  }
}

/* Mobile: Show about half as many shapes */
@media (max-width: 768px) {
  .member-floating-shape:nth-child(even) {
    display: none !important;
  }
  .member-blob {
    filter: blur(60px);
    opacity: 0.45;
  }
}

/* Membership Cards: Animated Gradient Border, Soft Shadow & Flip-in Stagger */
body.page-member .membership-card {
  position: relative !important;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s ease,
              border-color 0.4s ease !important;
  border: 1.5px solid rgba(124, 58, 237, 0.12) !important;
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  overflow: hidden !important;
}

body.page-member .membership-card:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 48px rgba(124, 58, 237, 0.16) !important;
  border-color: rgba(192, 38, 211, 0.4) !important;
}

/* Floating Icon Pods */
body.page-member .member-icon-pod {
  animation: memberIconPodFloat 6s ease-in-out infinite alternate !important;
}

@keyframes memberIconPodFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
}

/* Form Card: Gradient Hairline, Focus Glow, Button Shine */
body.page-member #membership-form .bg-white {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(124, 58, 237, 0.14) !important;
  box-shadow: 0 16px 44px rgba(11, 11, 59, 0.08) !important;
}

/* Gradient Hairline sweeping along top edge */
body.page-member #membership-form .bg-white::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #7C3AED, #C026D3, #EC4899, #7C3AED);
  background-size: 200% auto;
  animation: memberHairlineSweep 6s linear infinite;
}

@keyframes memberHairlineSweep {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* Input Focus Glow */
body.page-member form input:focus,
body.page-member form select:focus,
body.page-member form textarea:focus {
  border-color: #7C3AED !important;
  box-shadow: 0 0 0 3.5px rgba(124, 58, 237, 0.18) !important;
  outline: none !important;
}

/* Submit Button Shine Sweep */
body.page-member form button[type="submit"] {
  position: relative !important;
  overflow: hidden !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3) !important;
}

body.page-member form button[type="submit"]::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

body.page-member form button[type="submit"]:hover::before {
  left: 140%;
}

body.page-member form button[type="submit"]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 32px rgba(124, 58, 237, 0.42) !important;
}

/* Why Choose Tiles: cascade & subtle float */
body.page-member .why-choose-icon-pod {
  transition: transform 0.35s ease !important;
  animation: whyChooseFloat 6s ease-in-out infinite alternate;
}

@keyframes whyChooseFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}

/* Tab Hidden Pause */
body.page-animations-paused *,
body.page-animations-paused *::before,
body.page-animations-paused *::after {
  animation-play-state: paused !important;
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  body.page-member .member-blob,
  body.page-member .member-floating-shape,
  body.page-member .member-icon-pod,
  body.page-member .why-choose-icon-pod,
  body.page-member #membership-form .bg-white::before,
  body.page-member form button[type="submit"]::before {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
`;

// ============================================================================
// B. CSS for donate.html ("Light of Learning" Theme)
// ============================================================================
const donateThemeCss = `/**
 * Shikshit Design System - Scoped Styles for Donate Page
 * Theme: "Light of Learning"
 * Scope: body.page-donate
 */

/* Sunrise Gradient Background */
body.page-donate {
  background: linear-gradient(135deg, #FFF7ED 0%, #F5F3FF 40%, #FDF2F8 80%, #FFF7ED 100%) !important;
  background-size: 200% 200% !important;
  animation: donateSunriseShift 40s ease-in-out infinite alternate !important;
  min-height: 100vh;
  position: relative;
}

@keyframes donateSunriseShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Fixed Ambient Layer */
.donate-ambient-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  aria-hidden: true;
}

/* Large Blurred Sunrise Blobs */
.donate-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  pointer-events: none;
  will-change: transform;
}

.donate-blob-1 {
  top: -8%;
  left: -5%;
  width: 580px;
  height: 580px;
  background: radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, rgba(236, 72, 153, 0.18) 60%, transparent 80%);
  animation: donateBlobDrift1 36s ease-in-out infinite alternate;
}

.donate-blob-2 {
  top: 35%;
  right: -6%;
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, rgba(237, 233, 254, 0.5) 0%, rgba(251, 207, 232, 0.25) 60%, transparent 80%);
  animation: donateBlobDrift2 30s ease-in-out infinite alternate;
}

.donate-blob-3 {
  bottom: -6%;
  left: 25%;
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(236, 72, 153, 0.20) 60%, transparent 80%);
  animation: donateBlobDrift3 34s ease-in-out infinite alternate;
}

@keyframes donateBlobDrift1 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(80px, 60px, 0) scale(1.08); }
  100% { transform: translate3d(-50px, 100px, 0) scale(0.94); }
}

@keyframes donateBlobDrift2 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-70px, -80px, 0) scale(1.1); }
  100% { transform: translate3d(60px, -60px, 0) scale(0.92); }
}

@keyframes donateBlobDrift3 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(60px, -70px, 0) scale(1.05); }
  100% { transform: translate3d(-70px, 50px, 0) scale(1.08); }
}

/* Rising Glowing Orbs & Floating Hearts */
.donate-floating-orb {
  position: absolute;
  color: rgba(236, 72, 153, 0.25);
  fill: currentColor;
  pointer-events: none;
  animation: donateOrbRise linear infinite;
  will-change: transform, opacity;
}

.donate-floating-orb:nth-child(1) { left: 10%; width: 24px; height: 24px; animation-duration: 22s; animation-delay: 0s; }
.donate-floating-orb:nth-child(2) { left: 26%; width: 32px; height: 32px; animation-duration: 28s; animation-delay: -7s; color: rgba(251, 146, 60, 0.25); }
.donate-floating-orb:nth-child(3) { left: 48%; width: 20px; height: 20px; animation-duration: 19s; animation-delay: -14s; color: rgba(168, 85, 247, 0.25); }
.donate-floating-orb:nth-child(4) { left: 68%; width: 28px; height: 28px; animation-duration: 25s; animation-delay: -5s; color: rgba(236, 72, 153, 0.25); }
.donate-floating-orb:nth-child(5) { left: 85%; width: 26px; height: 26px; animation-duration: 21s; animation-delay: -18s; color: rgba(251, 146, 60, 0.25); }
.donate-floating-orb:nth-child(6) { left: 92%; width: 30px; height: 30px; animation-duration: 26s; animation-delay: -10s; color: rgba(168, 85, 247, 0.25); }

@keyframes donateOrbRise {
  0% {
    transform: translateY(110vh) scale(0.8);
    opacity: 0;
  }
  15% {
    opacity: 0.7;
  }
  85% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-10vh) scale(1.2);
    opacity: 0;
  }
}

/* Mobile: show half shapes */
@media (max-width: 768px) {
  .donate-floating-orb:nth-child(even) {
    display: none !important;
  }
  .donate-blob {
    filter: blur(60px);
    opacity: 0.45;
  }
}

/* Hero Enhancements: Glass stickers float, headline shimmer */
body.page-donate .floating-icon {
  animation: donateIconFloat 5s ease-in-out infinite alternate !important;
}

@keyframes donateIconFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}

/* Donation Card: Frosted Glass with Conic Gradient Border */
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

body.page-donate #donate-form .bg-white {
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 28px !important;
  border: 1px solid rgba(124, 58, 237, 0.16) !important;
  box-shadow: 0 20px 50px rgba(11, 11, 59, 0.08) !important;
  position: relative !important;
}

/* Amount Chips: Spring scale, ripple, gradient fill on existing .selected class */
body.page-donate .amount-button {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.25s ease,
              background-color 0.2s ease,
              color 0.2s ease !important;
  border-radius: 14px !important;
  position: relative !important;
  overflow: hidden !important;
}

body.page-donate .amount-button:hover {
  transform: translateY(-2px) scale(1.03) !important;
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.15) !important;
}

/* Selected amount button (Existing class used by payment scripts) */
body.page-donate .amount-button.selected {
  background: linear-gradient(135deg, #7C3AED 0%, #C026D3 60%, #EC4899 100%) !important;
  color: #FFFFFF !important;
  border-color: transparent !important;
  transform: scale(1.05) !important;
  box-shadow: 0 8px 24px rgba(192, 38, 211, 0.35) !important;
}

/* Donate Button (#donateButton): Pulsing heart, breathing glow, shine sweep */
body.page-donate #donateButton {
  background: linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #EC4899 100%) !important;
  position: relative !important;
  overflow: hidden !important;
  box-shadow: 0 10px 30px rgba(192, 38, 211, 0.38) !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  border-radius: 9999px !important;
}

body.page-donate #donateButton::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

body.page-donate #donateButton:hover::before {
  left: 140%;
}

body.page-donate #donateButton:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 14px 40px rgba(192, 38, 211, 0.5) !important;
}

/* Heart Icon pulsing inside button */
body.page-donate #donateButton svg {
  animation: donateHeartPulse 2s ease-in-out infinite !important;
}

@keyframes donateHeartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Payment Loading Shimmer */
body.page-donate #paymentLoading {
  animation: paymentLoadingPulse 1.5s ease-in-out infinite alternate !important;
}

@keyframes paymentLoadingPulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Soft animated entrance for success and error states */
body.page-donate #paymentSuccess,
body.page-donate #paymentError {
  animation: paymentStateFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes paymentStateFadeIn {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Trust Strip & Intervention Cards Gentle Shimmer */
body.page-donate .intervention-icon {
  transition: transform 0.3s ease !important;
}

body.page-donate .intervention-card:hover .intervention-icon {
  transform: scale(1.08) rotate(3deg) !important;
}

/* Tab Hidden Pause */
body.page-animations-paused *,
body.page-animations-paused *::before,
body.page-animations-paused *::after {
  animation-play-state: paused !important;
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  body.page-donate,
  body.page-donate .donate-blob,
  body.page-donate .donate-floating-orb,
  body.page-donate .floating-icon,
  body.page-donate #donateButton::before,
  body.page-donate #donateButton svg,
  body.page-donate #paymentLoading,
  body.page-donate #paymentSuccess,
  body.page-donate #paymentError {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
`;

// Ambient layer HTML snippets
const memberAmbientHtml = `  <!-- Ambient Background Layer (Theme: "Join the Journey") -->
  <div class="member-ambient-layer" aria-hidden="true">
    <div class="member-blob member-blob-1"></div>
    <div class="member-blob member-blob-2"></div>
    <div class="member-blob member-blob-3"></div>
    <!-- Floating Learning Shapes -->
    <svg class="member-floating-shape" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
    <svg class="member-floating-shape" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
    <svg class="member-floating-shape" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    <svg class="member-floating-shape" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
    <svg class="member-floating-shape" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
    <svg class="member-floating-shape" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
  </div>`;

const donateAmbientHtml = `  <!-- Ambient Background Layer (Theme: "Light of Learning") -->
  <div class="donate-ambient-layer" aria-hidden="true">
    <div class="donate-blob donate-blob-1"></div>
    <div class="donate-blob donate-blob-2"></div>
    <div class="donate-blob donate-blob-3"></div>
    <!-- Rising Glowing Orbs and Floating Hearts -->
    <svg class="donate-floating-orb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
    <svg class="donate-floating-orb" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    <svg class="donate-floating-orb" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    <svg class="donate-floating-orb" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    <svg class="donate-floating-orb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
    <svg class="donate-floating-orb" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
  </div>`;

for (const folder of folders) {
  // 1. Update css/shikshit/member.css
  const memberCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'member.css');
  let memCss = fs.readFileSync(memberCssPath, 'utf8');
  if (!memCss.includes('THEME: "Join the Journey"')) {
    memCss += '\n' + memberThemeCss;
    fs.writeFileSync(memberCssPath, memCss, 'utf8');
    console.log(`Updated member.css in ${folder}`);
  }

  // 2. Write css/shikshit/donate.css
  const donateCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'donate.css');
  fs.writeFileSync(donateCssPath, donateThemeCss, 'utf8');
  console.log(`Wrote donate.css in ${folder}`);

  // 3. Update become-a-member.html
  const memberHtmlPath = path.join(__dirname, '..', folder, 'become-a-member.html');
  let memberHtml = fs.readFileSync(memberHtmlPath, 'utf8');
  if (!memberHtml.includes('class="member-ambient-layer"')) {
    memberHtml = memberHtml.replace(
      /<body([^>]*)>/i,
      '<body$1>\n' + memberAmbientHtml
    );
  }
  if (!memberHtml.includes('js/shikshit/inner.js')) {
    memberHtml = memberHtml.replace(
      /<\/body>/i,
      '  <script src="js/shikshit/inner.js"></script>\n</body>'
    );
  }
  fs.writeFileSync(memberHtmlPath, memberHtml, 'utf8');
  console.log(`Updated become-a-member.html in ${folder}`);

  // 4. Update donate.html
  const donateHtmlPath = path.join(__dirname, '..', folder, 'donate.html');
  let donateHtml = fs.readFileSync(donateHtmlPath, 'utf8');
  
  // Ensure body has class="page-donate"
  if (!donateHtml.includes('class="page-donate"')) {
    donateHtml = donateHtml.replace(/<body>/i, '<body class="page-donate">');
  }

  // Link donate.css in head
  if (!donateHtml.includes('css/shikshit/donate.css')) {
    donateHtml = donateHtml.replace(
      /<\/head>/i,
      '  <link rel="stylesheet" href="css/shikshit/donate.css">\n</head>'
    );
  }

  // Add ambient layer right after body
  if (!donateHtml.includes('class="donate-ambient-layer"')) {
    donateHtml = donateHtml.replace(
      /<body[^>]*>/i,
      '$&\n' + donateAmbientHtml
    );
  }

  // Add inner.js before closing body
  if (!donateHtml.includes('js/shikshit/inner.js')) {
    donateHtml = donateHtml.replace(
      /<\/body>/i,
      '  <script src="js/shikshit/inner.js"></script>\n</body>'
    );
  }
  fs.writeFileSync(donateHtmlPath, donateHtml, 'utf8');
  console.log(`Updated donate.html in ${folder}`);
}

console.log('Part C HTML & CSS files applied successfully.');
