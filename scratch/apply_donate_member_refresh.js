const fs = require('fs');

// 1. Create polished, warm, professional donate.css
const donateCssContent = `/**
 * Shikshit Design System - Scoped Styles for Donate Page
 * Theme: "Warm Philanthropic Trust & Impact"
 * Scope: body.page-donate
 * Brand Cohesive: Royal Violet + Warm Rose-Coral + Amber Trust + Emerald Verification
 */

/* ==========================================================================
   1. GLOBAL PAGE CANVAS & AMBIENT LAYER
   ========================================================================== */
body.page-donate {
  background: #FDFBFD !important;
  color: #1E293B !important;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11" !important;
  min-height: 100vh;
  position: relative;
}

/* Subtle, non-distracting ambient backdrop */
.donate-ambient-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background: radial-gradient(circle at 15% 15%, rgba(254, 243, 199, 0.45) 0%, transparent 40%),
              radial-gradient(circle at 85% 30%, rgba(253, 232, 242, 0.45) 0%, transparent 45%),
              radial-gradient(circle at 50% 85%, rgba(245, 243, 255, 0.5) 0%, transparent 50%);
}

/* Static blurred warm orbs - NO endless drifting or screen pollution */
.donate-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  opacity: 0.6;
}

.donate-blob-1 {
  top: -5%;
  left: -4%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(244, 63, 94, 0.12) 65%, transparent 80%);
}

.donate-blob-2 {
  top: 38%;
  right: -5%;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, rgba(244, 63, 94, 0.12) 60%, transparent 80%);
}

.donate-blob-3 {
  bottom: 0%;
  left: 20%;
  width: 580px;
  height: 580px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(124, 58, 237, 0.1) 60%, transparent 80%);
}

/* Disable old floating orbs so they don't clutter the screen */
.donate-floating-orb {
  display: none !important;
}

/* ==========================================================================
   2. HERO SECTION ENHANCEMENTS
   ========================================================================== */
body.page-donate .hero-gradient {
  background: linear-gradient(135deg, #0B0B3B 0%, #1E1B4B 32%, #4C1D95 72%, #6D28D9 100%) !important;
  position: relative;
  overflow: hidden;
  padding-top: 5rem !important;
  padding-bottom: 5.5rem !important;
}

body.page-donate .hero-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 20%, rgba(244, 63, 94, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

body.page-donate .hero-gradient h1 {
  color: #FFFFFF !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.25) !important;
}

body.page-donate .hero-gradient p {
  color: rgba(255, 255, 255, 0.92) !important;
  font-size: 1.2rem !important;
  line-height: 1.6 !important;
}

/* ATG Trust Seal / Badge */
body.page-donate .hero-gradient .bg-white\\/10,
body.page-donate .hero-gradient [class*="bg-white/"] {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1.5px solid rgba(245, 158, 11, 0.45) !important;
  border-radius: 20px !important;
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

body.page-donate .hero-gradient .text-yellow-400,
body.page-donate .hero-gradient .text-yellow-300 {
  color: #FBBF24 !important;
  filter: drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4)) !important;
}

/* Hero CTA Button "Start Donating Now" */
body.page-donate .hero-gradient a[href*="donate-form"],
body.page-donate .hero-gradient a.inline-flex {
  background: #FFFFFF !important;
  color: #581C87 !important;
  font-weight: 700 !important;
  border-radius: 9999px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
}

body.page-donate .hero-gradient a[href*="donate-form"]:hover,
body.page-donate .hero-gradient a.inline-flex:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3) !important;
  color: #4C1D95 !important;
}

/* ==========================================================================
   3. DONATION FORM SECTION (#donate-form)
   ========================================================================== */
body.page-donate #donate-form {
  background: #F8FAFC !important;
  position: relative;
}

/* Left Column Heading & Story */
body.page-donate #donate-form h2 {
  color: #0F172A !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  line-height: 1.25 !important;
}

body.page-donate #donate-form p {
  color: #334155 !important;
  font-size: 1.03rem !important;
  line-height: 1.75 !important;
}

/* 4 Impact Metric Cards */
body.page-donate #donate-form .grid.grid-cols-2 > div {
  background: #FFFFFF !important;
  border: 1px solid #E2E8F0 !important;
  border-radius: 16px !important;
  padding: 1.25rem !important;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
}

body.page-donate #donate-form .grid.grid-cols-2 > div:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 12px 28px -4px rgba(124, 58, 237, 0.1) !important;
  border-color: rgba(124, 58, 237, 0.3) !important;
}

body.page-donate #donate-form .grid.grid-cols-2 h4 {
  color: #0F172A !important;
  font-weight: 800 !important;
  font-size: 1.15rem !important;
}

body.page-donate #donate-form .grid.grid-cols-2 p {
  color: #475569 !important;
  font-size: 0.88rem !important;
  line-height: 1.5 !important;
}

/* ==========================================================================
   4. DONATION FORM CARD (#donationForm)
   ========================================================================== */
body.page-donate #donate-form .bg-white {
  background: #FFFFFF !important;
  border-radius: 24px !important;
  border: 1.5px solid #E2E8F0 !important;
  box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.1) !important;
  padding: 2.25rem !important;
  position: relative !important;
}

/* Card Header */
body.page-donate #donate-form h3 {
  color: #0F172A !important;
  font-weight: 800 !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase !important;
  font-size: 1.2rem !important;
  margin-bottom: 1.5rem !important;
  position: relative;
  display: inline-block;
}

body.page-donate #donate-form h3::after {
  content: "";
  display: block;
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, #E11D48, #7C3AED);
  border-radius: 9999px;
  margin-top: 6px;
}

/* Form Labels */
body.page-donate #donationForm label {
  color: #1E293B !important;
  font-weight: 600 !important;
  font-size: 0.88rem !important;
  margin-bottom: 0.45rem !important;
  display: block !important;
}

/* Form Inputs */
body.page-donate #donationForm input[type="text"],
body.page-donate #donationForm input[type="email"],
body.page-donate #donationForm input[type="tel"],
body.page-donate #donationForm input[type="number"],
body.page-donate #donationForm .custom-input {
  background: #FFFFFF !important;
  border: 1.5px solid #CBD5E1 !important;
  border-radius: 12px !important;
  padding: 0.85rem 1rem !important;
  font-size: 0.96rem !important;
  color: #0F172A !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

body.page-donate #donationForm input:focus,
body.page-donate #donationForm .custom-input:focus {
  border-color: #7C3AED !important;
  box-shadow: 0 0 0 3.5px rgba(124, 58, 237, 0.16) !important;
  background-color: #FAF5FF !important;
  outline: none !important;
}

/* Preset Amount Chips (500, 3000, 6000, 12000) */
body.page-donate .amount-button {
  background: #F8FAFC !important;
  border: 1.5px solid #E2E8F0 !important;
  color: #1E293B !important;
  font-weight: 700 !important;
  font-size: 1.05rem !important;
  border-radius: 12px !important;
  padding: 0.85rem 0.5rem !important;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease !important;
  cursor: pointer !important;
}

body.page-donate .amount-button:hover {
  border-color: #C084FC !important;
  background: #FAF5FF !important;
  transform: translateY(-2px) !important;
  color: #6D28D9 !important;
}

/* Selected Amount Chip (Active via existing payment logic) */
body.page-donate .amount-button.selected {
  background: linear-gradient(135deg, #7C3AED 0%, #C026D3 100%) !important;
  color: #FFFFFF !important;
  border-color: transparent !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 8px 22px rgba(124, 58, 237, 0.35) !important;
}

/* Payment Method Grid */
body.page-donate .payment-methods h4 {
  color: #1E293B !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  margin-top: 1rem !important;
  margin-bottom: 0.75rem !important;
}

body.page-donate .payment-method-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 0.75rem !important;
  max-width: 100% !important;
}

@media (max-width: 640px) {
  body.page-donate .payment-method-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

body.page-donate .payment-method {
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 14px !important;
  background: #FFFFFF !important;
  padding: 0.85rem 0.5rem !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  min-height: 80px !important;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
}

body.page-donate .payment-method:hover {
  border-color: #C084FC !important;
  background: #FAF5FF !important;
  transform: translateY(-2px) !important;
}

body.page-donate .payment-method.selected {
  border-color: #7C3AED !important;
  background: #FAF5FF !important;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.16) !important;
  transform: translateY(-2px) !important;
}

body.page-donate .payment-method.selected span,
body.page-donate .payment-method.selected div {
  color: #6D28D9 !important;
  font-weight: 700 !important;
}

/* Impact Calculation Preview Bar */
body.page-donate #donate-form .bg-gray-50,
body.page-donate #donate-form [class*="bg-gray-50"] {
  background: #F8FAFC !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 16px !important;
  padding: 1rem 1.25rem !important;
  margin-top: 1.25rem !important;
  margin-bottom: 1.25rem !important;
}

body.page-donate #donationAmount {
  color: #7C3AED !important;
  font-weight: 800 !important;
  font-size: 1.6rem !important;
}

/* Submit Donation Button (#donateButton) */
body.page-donate #donateButton {
  background: linear-gradient(135deg, #E11D48 0%, #C026D3 50%, #7C3AED 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: 14px !important;
  padding: 1.1rem 1.5rem !important;
  font-weight: 800 !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  box-shadow: 0 10px 28px rgba(225, 29, 72, 0.35) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.6rem !important;
  width: 100% !important;
}

body.page-donate #donateButton:hover {
  transform: translateY(-2px) scale(1.01) !important;
  box-shadow: 0 14px 36px rgba(225, 29, 72, 0.45) !important;
}

body.page-donate #donateButton:active {
  transform: translateY(0) scale(0.99) !important;
}

/* ==========================================================================
   5. SHIKSHA ON GROUND & INTERVENTIONS
   ========================================================================== */
body.page-donate .py-16.lg\\:py-24.bg-white {
  background: #FFFFFF !important;
}

body.page-donate .py-16.lg\\:py-24.bg-white h2 {
  color: #0F172A !important;
  font-weight: 800 !important;
  letter-spacing: 0.04em !important;
}

/* Intervention Section */
body.page-donate .interventions-section {
  background: #F8FAFC !important;
}

body.page-donate .interventions-section h2 {
  color: #0F172A !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
}

body.page-donate .interventions-section h2 u {
  text-decoration-color: #E11D48 !important;
  text-underline-offset: 8px !important;
}

/* 8 Intervention Cards */
body.page-donate .intervention-card {
  background: #FFFFFF !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 20px !important;
  padding: 1.75rem 1.25rem !important;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

body.page-donate .intervention-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 16px 36px rgba(124, 58, 237, 0.12) !important;
  border-color: rgba(124, 58, 237, 0.3) !important;
}

body.page-donate .intervention-icon {
  width: 56px !important;
  height: 56px !important;
  border-radius: 16px !important;
  display: grid !important;
  place-items: center !important;
  margin-bottom: 1rem !important;
  transition: transform 0.25s ease !important;
}

body.page-donate .intervention-card:hover .intervention-icon {
  transform: scale(1.1) rotate(2deg) !important;
}

body.page-donate .intervention-title,
body.page-donate .intervention-card p {
  color: #1E293B !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  line-height: 1.5 !important;
}

/* ==========================================================================
   6. PURPOSEFUL MOTION & ACCESSIBLE SCROLL REVEALS
   ========================================================================== */
.scroll-reveal-item {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) !important;
  will-change: opacity, transform;
}

.scroll-reveal-item.is-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* ==========================================================================
   7. PREFERS-REDUCED-MOTION
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  body.page-donate,
  body.page-donate *,
  body.page-donate *::before,
  body.page-donate *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
    scroll-behavior: auto !important;
  }
}
`;

// 2. Create polished, distinct, professional member.css
const memberCssContent = `/**
 * Shikshit Design System - Scoped Styles for Become a Member Page
 * Theme: "Empowering Education Community & Prestigious Network"
 * Scope: body.page-member
 * Distinct Palette: Electric Sapphire + Cobalt Blue + Deep Navy + Emerald/Teal
 */

/* ==========================================================================
   1. GLOBAL CANVAS & AMBIENT BACKDROP
   ========================================================================== */
body.page-member {
  background: #F8FAFD !important;
  color: #0F172A !important;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11" !important;
  min-height: 100vh;
  position: relative;
}

/* Ambient gradient backdrop without distracting floating shapes */
.member-ambient-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background: radial-gradient(circle at 10% 12%, rgba(219, 234, 254, 0.55) 0%, transparent 40%),
              radial-gradient(circle at 88% 35%, rgba(204, 251, 241, 0.5) 0%, transparent 45%),
              radial-gradient(circle at 50% 88%, rgba(238, 242, 255, 0.6) 0%, transparent 50%);
}

.member-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  opacity: 0.55;
}

.member-blob-1 {
  top: -6%;
  left: -4%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(79, 70, 229, 0.1) 60%, transparent 80%);
}

.member-blob-2 {
  top: 35%;
  right: -5%;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, rgba(37, 99, 235, 0.12) 60%, transparent 80%);
}

.member-blob-3 {
  bottom: 0%;
  left: 20%;
  width: 580px;
  height: 580px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(13, 148, 136, 0.1) 60%, transparent 80%);
}

/* Disable endless floating shapes */
.member-floating-shape {
  display: none !important;
}

/* ==========================================================================
   2. HERO SECTION
   ========================================================================== */
body.page-member .hero-gradient {
  background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 35%, #1E40AF 70%, #2563EB 100%) !important;
  position: relative;
  overflow: hidden;
  padding-top: 5rem !important;
  padding-bottom: 5.5rem !important;
}

body.page-member .hero-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.2) 0%, transparent 60%);
  pointer-events: none;
}

body.page-member .hero-gradient h1 {
  color: #FFFFFF !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.25) !important;
}

body.page-member .hero-gradient p {
  color: #E0E7FF !important;
  font-size: 1.2rem !important;
  line-height: 1.6 !important;
}

/* Hero CTA Button "Join Our Community Today" */
body.page-member .hero-gradient a[href*="membership-form"],
body.page-member .hero-gradient a.inline-flex {
  background: #FFFFFF !important;
  color: #1E3A8A !important;
  font-weight: 700 !important;
  border-radius: 9999px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
}

body.page-member .hero-gradient a[href*="membership-form"]:hover,
body.page-member .hero-gradient a.inline-flex:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3) !important;
  color: #1D4ED8 !important;
}

/* ==========================================================================
   3. MEMBERSHIP PLANS SECTION
   ========================================================================== */
body.page-member .py-20.bg-gradient-to-br {
  background: #F8FAFD !important;
}

body.page-member h2 {
  color: #0F172A !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
}

/* Trust Strip Pill */
body.page-member .benefits-card,
body.page-member .py-20 .max-w-4xl.bg-white,
body.page-member .py-20 .rounded-2xl.bg-white {
  background: #FFFFFF !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 20px !important;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05) !important;
  padding: 1rem 1.5rem !important;
}

body.page-member .benefit-item {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-weight: 600 !important;
  color: #1E293B !important;
}

body.page-member .benefit-icon {
  color: #059669 !important;
  filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2)) !important;
}

/* Membership Plan Cards (Individual & Institutional) */
body.page-member .membership-card {
  background: #FFFFFF !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 22px !important;
  padding: 2.25rem 1.75rem !important;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
  position: relative !important;
  text-align: center !important;
}

body.page-member .membership-card:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 48px -6px rgba(37, 99, 235, 0.15) !important;
  border-color: rgba(37, 99, 235, 0.35) !important;
}

/* Icon Pods inside Plan Cards */
body.page-member .member-icon-pod,
body.page-member .membership-card .w-20.h-20 {
  display: grid !important;
  place-items: center !important;
  width: 76px !important;
  height: 76px !important;
  border-radius: 20px !important;
  margin: 0 auto 1.5rem !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  box-shadow: 0 8px 24px -4px rgba(37, 99, 235, 0.12) !important;
}

body.page-member .membership-card:hover .member-icon-pod,
body.page-member .membership-card:hover .w-20.h-20 {
  transform: scale(1.08) rotate(2deg) !important;
}

/* Price Tags */
body.page-member .membership-card .text-3xl,
body.page-member .membership-card .text-4xl,
body.page-member .membership-card [class*="text-purple-600 font-bold"] {
  color: #0F172A !important;
  font-weight: 800 !important;
  font-size: 2.2rem !important;
  letter-spacing: -0.02em !important;
}

/* Plan Titles & Subtitles */
body.page-member .membership-card h3 {
  color: #0F172A !important;
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  margin-bottom: 0.5rem !important;
}

body.page-member .membership-card p {
  color: #475569 !important;
  font-size: 0.9rem !important;
}

/* ==========================================================================
   4. FORM & "WHY CHOOSE US" SECTION (#membership-form)
   ========================================================================== */
body.page-member #membership-form {
  background: #F1F5F9 !important;
  position: relative;
}

/* Membership Form Card */
body.page-member #membership-form .bg-white {
  background: #FFFFFF !important;
  border-radius: 24px !important;
  border: 1.5px solid #E2E8F0 !important;
  box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.12) !important;
  padding: 2.5rem !important;
  position: relative;
  overflow: hidden;
}

/* Top Hairline accent */
body.page-member #membership-form .bg-white::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563EB, #4F46E5, #0D9488);
}

/* Form Labels */
body.page-member #membership-form form label {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-weight: 600 !important;
  color: #1E293B !important;
  font-size: 0.88rem !important;
  margin-bottom: 0.45rem !important;
}

body.page-member #membership-form form label svg {
  color: #2563EB !important;
  width: 17px !important;
  height: 17px !important;
}

/* Form Inputs & Select */
body.page-member #membership-form form input,
body.page-member #membership-form form select,
body.page-member #membership-form form textarea {
  background: #FFFFFF !important;
  border: 1.5px solid #CBD5E1 !important;
  border-radius: 12px !important;
  padding: 0.85rem 1rem !important;
  font-size: 0.95rem !important;
  color: #0F172A !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

body.page-member #membership-form form input:focus,
body.page-member #membership-form form select:focus,
body.page-member #membership-form form textarea:focus {
  border-color: #2563EB !important;
  box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.16) !important;
  background-color: #F8FAFD !important;
  outline: none !important;
}

/* Submit Application Button */
body.page-member #membership-form button[type="submit"] {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #4F46E5 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: 14px !important;
  padding: 1.1rem 1.5rem !important;
  font-weight: 800 !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.35) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.6rem !important;
  width: 100% !important;
}

body.page-member #membership-form button[type="submit"]:hover {
  transform: translateY(-2px) scale(1.01) !important;
  box-shadow: 0 14px 36px rgba(37, 99, 235, 0.45) !important;
}

body.page-member #membership-form button[type="submit"]:active {
  transform: translateY(0) scale(0.99) !important;
}

/* Why Choose Us Tiles */
body.page-member .why-choose-icon-pod {
  border-radius: 14px !important;
  transition: transform 0.25s ease !important;
}

body.page-member .group:hover .why-choose-icon-pod {
  transform: scale(1.08) !important;
}

body.page-member #membership-form .space-y-8 h2 {
  color: #0F172A !important;
  font-weight: 800 !important;
}

body.page-member #membership-form .space-y-8 p {
  color: #334155 !important;
  font-size: 1rem !important;
  line-height: 1.7 !important;
}

/* ==========================================================================
   5. ADVISORY BOARD SECTION
   ========================================================================== */
body.page-member .py-20.bg-gradient-to-b {
  background: #FFFFFF !important;
}

body.page-member .py-20.bg-gradient-to-b .group {
  background: #FFFFFF !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 20px !important;
  padding: 1.75rem !important;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
}

body.page-member .py-20.bg-gradient-to-b .group:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.1) !important;
  border-color: rgba(37, 99, 235, 0.25) !important;
}

body.page-member .py-20.bg-gradient-to-b h3 {
  color: #0F172A !important;
  font-weight: 700 !important;
  font-size: 1.15rem !important;
}

body.page-member .py-20.bg-gradient-to-b p.text-yellow-600 {
  color: #D97706 !important;
  font-weight: 600 !important;
}

/* ==========================================================================
   6. VIDEO ADS SECTION
   ========================================================================== */
body.page-member .video-carousel {
  padding: 3rem 1rem !important;
  background: #F8FAFD !important;
  text-align: center;
}

body.page-member .video-carousel h2 {
  color: #0F172A !important;
  font-weight: 800 !important;
  margin-bottom: 2rem !important;
}

/* ==========================================================================
   7. PURPOSEFUL MOTION & SCROLL REVEALS
   ========================================================================== */
.scroll-reveal-item {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) !important;
  will-change: opacity, transform;
}

.scroll-reveal-item.is-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* ==========================================================================
   8. PREFERS-REDUCED-MOTION
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  body.page-member,
  body.page-member *,
  body.page-member *::before,
  body.page-member *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
    scroll-behavior: auto !important;
  }
}
`;

// Write to public_html and public_html (77)
['public_html/css/shikshit/donate.css', 'public_html (77)/css/shikshit/donate.css'].forEach(p => {
  fs.writeFileSync(p, donateCssContent, 'utf8');
  console.log('Wrote ' + p);
});

['public_html/css/shikshit/member.css', 'public_html (77)/css/shikshit/member.css'].forEach(p => {
  fs.writeFileSync(p, memberCssContent, 'utf8');
  console.log('Wrote ' + p);
});

// Fix footer include path in become-a-member.html (both directories)
['public_html/become-a-member.html', 'public_html (77)/become-a-member.html'].forEach(p => {
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('include-html="sikshitfooter.html"')) {
    html = html.replace('include-html="sikshitfooter.html"', 'include-html="components/sikshitfooter.html"');
    fs.writeFileSync(p, html, 'utf8');
    console.log('Fixed footer path in ' + p);
  } else {
    console.log('Footer path already correct in ' + p);
  }
});
