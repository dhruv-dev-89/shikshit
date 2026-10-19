# Shikshit Website — Comprehensive Pre-Revamp Audit (Step 1)

**Audit Date:** October 17, 2026  
**Auditor:** Senior UI/UX Designer, Front-End Architect & SEO Specialist  
**Workspace:** `public_html` (Pristine backup created at `../public_html_backup/` and verified in Git)

---

## 1. Executive Summary & Repository Health

The `public_html` directory contains a static website consisting of **16 root HTML pages**, **4 reusable HTML components**, **11 CSS stylesheets**, **16 JavaScript files**, and **84 media assets** totaling **~85.2 MB**.

The codebase currently represents a hybrid architecture:
1. **Shikshit Education**: Primary brand focused on skill development courses, educational products, student mentorship, and career guidance.
2. **NS-MAS (National Scholarship – Merit and Assistance Scheme)**: Dedicated scholarship portal initiative.

### Critical Baseline Findings:
- **Frozen File Isolation:** 7 HTML pages, 2 components, 3 CSS stylesheets, and 2 JS files belong strictly to NS-MAS and must remain 100% frozen (byte-identical).
- **Shared File Trap:** Multiple styles (`css/mobile-menu-fix.css`, `css/sikshitnavbar.css`, `css/floating-buttons.css`) and scripts (`js/script.js`, `js/hamburger-menu-fix.js`) are referenced by both NS-MAS and Shikshit pages. To prevent collateral breakage, **all new design tokens, modular styles, and enhancements will be placed in dedicated `css/shikshit/` and `js/shikshit/` directories**.
- **Media Heaviness:** ~80.8 MB (~95%) of the entire 85 MB folder is consumed by four `.mp4` video files and one uncompressed 2.06 MB JPEG. All 4 video files are linked directly inside frozen `ns-mas.html` and cannot be deleted.
- **Rogue / Stray File:** An orphaned 321 KB file named `images/Home.html` exists in the `images/` directory (an old backup of a previous homepage).
- **Defunct Script Tags & Broken Links:** Editable pages (`about-us.html`, `contact.html`, `index.html`) contain 12 broken script and style references pointing to non-existent files.
- **Inline Style Bloat:** `index.html` alone contains **740 inline style attributes** and **103,112 characters of embedded `<style>` blocks** (~34% of the HTML payload).
- **Tailwind CDN Overhead:** Every page currently loads `https://cdn.tailwindcss.com` runtime compiler in production, causing client-side styling recalculations and Cumulative Layout Shift (CLS).

---

## 2. Complete Inventory of Pages (Frozen vs. Editable)

| File Name | Scope Status | Document Title | Purpose & Description | File Size |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | **EDITABLE** | `Shikshit – Educational Products & Skill Development Services` | Main homepage for Shikshit brand: hero, stats, courses, programs, video showcase, reviews, FAQs. | 304,535 B |
| `about-us.html` | **EDITABLE** | `About Us - National Scholarship...` *(Needs correction to Shikshit)* | About Shikshit, history, mission, vision, team members, and core values. | 96,817 B |
| `contact.html` | **EDITABLE** | `Contact Us - National Scholarship...` *(Needs correction to Shikshit)* | Shikshit contact portal with support inquiries, contact info, and message submission form. | 85,357 B |
| `become-a-member.html` | **EDITABLE** | `Become a Member - Sikshit Education & Scholarships` | Institutional & student membership onboarding form with organization details. | 95,117 B |
| `donate.html` | **EDITABLE** | `Donate - Support Education \| Sikshit` | Donation gateway with live Razorpay modal integration (`js/payment-gateway.js`). | 101,254 B |
| `privacy-policy.html` | **EDITABLE** | `Privacy Policy - Shikshit` | Shikshit brand data privacy policy, collection practices, and user rights. | 6,624 B |
| `terms.html` | **EDITABLE** | `Terms & Conditions - Shikshit` | Shikshit platform terms of use, course terms, and user guidelines. | 9,253 B |
| `disclaimer.html` | **EDITABLE** | `Disclaimer - Shikshit` | Educational disclaimer, liability limitation, and informational notices. | 10,593 B |
| `cookie-policy.html` | **EDITABLE** | `Cookie Policy - Shikshit` | Shikshit cookie disclosures, analytics tracking, and user consent details. | 6,730 B |
| `components/sikshitfooter.html`| **EDITABLE** | Reusable Component | Shikshit 4-column footer loaded via XHR/fetch on Shikshit pages. | 25,333 B |
| `ns-mas.html` | **FROZEN (NS-MAS)** | `Scholarship Portal - Find and Apply for Scholarships` | Main NS-MAS scholarship landing page with category grids, timeline, and video players. | 326,645 B |
| `scholarship.html` | **FROZEN (NS-MAS)** | `Scholarships - National Scholarship – Merit and Assistance Scheme Portal` | Scholarship directory, eligibility requirements, and application portal details. | 272,560 B |
| `registration.html` | **FROZEN (NS-MAS)** | `National Scholarship – Merit and Assistance Scheme Registration` | NS-MAS online student scholarship application & registration form. | 30,337 B |
| `how-it-works.html` | **FROZEN (NS-MAS)** | `How It Works - National Scholarship – Merit and Assistance Scheme Portal` | 4-step walkthrough of the scholarship application, verification, and disbursement flow. | 162,916 B |
| `product-services.html`| **FROZEN (NS-MAS)** | `Product & Services - NS-MAS` | NS-MAS educational support services and scholarship products. | 133,121 B |
| `privacypolicy.html` | **FROZEN (NS-MAS)** | `Privacy Policy \| NS-MAS` | Official legal privacy policy for the NS-MAS scholarship program. | 8,608 B |
| `termsandservice.html` | **FROZEN (NS-MAS)** | `NS-MAS Terms of Service` | Official legal terms and conditions for the NS-MAS scholarship program. | 12,124 B |
| `components/nsmas_navbar.html` | **FROZEN (NS-MAS)** | Reusable Component | Navigation bar for NS-MAS pages. | ~8,400 B |
| `components/nsmas-floating-button.html` | **FROZEN (NS-MAS)** | Reusable Component | Quick application floating action button for NS-MAS pages. | ~4,200 B |
| `components/footer.html` | **FROZEN (NS-MAS)** | Reusable Component | Reusable footer loaded across NS-MAS pages. | 16,203 B |

---

## 3. Interactive Behaviors, Forms, Endpoints & Selectors on Editable Pages

Every hook, ID, and JS selector on EDITABLE pages has been cataloged to ensure **100% backward functional compatibility**:

### A. `donate.html` (Razorpay Payment Flow)
- **Form ID:** `#donationForm`
- **Required Inputs & Hooks:**
  - `#donorName`: Donor full name (`required`)
  - `#donorEmail`: Donor email address (`required`, validated by regex)
  - `#donorPhone`: Donor 10-digit Indian mobile number (`required`, validated by `^[6-9]\d{9}$`)
  - `#customAmount`: Custom numeric amount input
  - `.amount-button`: Selectable amount pill buttons (stores value in `data-amount="500|1000|2500|5000"`)
  - `.payment-method`: Selectable payment method tiles (stores `data-method="upi|card|netbanking|wallet"`)
  - `#donationAmount`: Dynamic display label showing `₹X`
  - `#donateButton`: Submit button with `#buttonText` and `#buttonSpinner`
  - `#paymentError` & `#errorMessage`: Notification containers for validation errors
  - `#paymentSuccess`: Success toast container
- **Script Dependencies:**
  - `https://checkout.razorpay.com/v1/checkout.js`
  - `js/payment-gateway.js` (uses config `PAYMENT_CONFIG` and opens `new Razorpay(options).open()`)
  - `js/floating-buttons.js`

### B. `become-a-member.html` (Membership Application)
- **Form Element:** `<form class="space-y-6">`
- **Field Selectors & Names:**
  - `input[type="email"]`: Organization/Member email (`required`)
  - `input[placeholder="Enter your full name"]`: Full name (`required`)
  - `input[placeholder="Enter organization name"]`: Organization name (`required`)
  - `input[type="tel"]`: Contact phone number (`required`)
  - `textarea[placeholder="Enter complete address"]`: Physical address (`required`)
  - `select`: Organization Type dropdown (`school`, `college`, `university`, `ngo`, `individual`)
  - `button[type="submit"]`: Submission CTA
- **Interactive UI Handlers:**
  - `includeHTML()`: Native `XMLHttpRequest` loader searching for `[include-html="..."]`
  - `toggleMobileMenu()`: Menu drawer toggle targeting `#mobileMenu` and `.mobile-menu-toggle`
  - `toggleFAQ(index)`: Accordion toggler toggling `#faq-content-${index}` and rotating `#faq-icon-${index}`
  - `startAutoScroll()`: Continuous horizontal marquee on `.carousel-track` with `.video-item` clones

### C. `contact.html` (Contact Inquiry Form)
- **Form Element:** `<form class="space-y-5">`
- **Field IDs & Names:**
  - `#name` / `name="name"`: Sender's full name
  - `#email` / `name="email"`: Email address
  - `#subject` / `name="subject"`: Subject line
  - `#message` / `name="message"`: Message textarea
  - `#name-error`, `#email-error`, `#subject-error`, `#message-error`: Validation message nodes
  - `#contact-submit-btn`: Submit button trigger
  - `#form-success`: Success message container (`"Thank you for your message! We'll get back to you soon."`)
- **Fix Required in Contact Page:** Currently, `contact.html` erroneously includes `components/nsmas_navbar.html` and `components/footer.html` (NS-MAS components). It will be re-anchored to the unified Shikshit header and `components/sikshitfooter.html`.

### D. `index.html` (Home Page Behaviors)
- **Header & Navigation:**
  - Sticky header with `.navbar`, `.navbar-container`, `.navbar-brand`, `.navbar-logo`, `.brand-title`, `.brand-subtitle`
  - Menu list: `.navbar-nav`, `.nav-item`, `.nav-link`
  - Mobile Drawer: `#mobileMenu`, `.mobile-menu-toggle`, `span.hamburger-line`
- **Floating Action Buttons:**
  - `#whatsapp-btn`: WhatsApp chat trigger (`tel:+917905044451` / wa.me link)
  - `#support-btn`: Instant callback/support trigger
  - `#donate-btn`: Floating direct donate trigger linking to `donate.html`
- **Component Loader:**
  - `<div include-html="components/sikshitfooter.html"></div>` with fallback fetch logic to load footer seamlessly.
- **Structured Data:**
  - JSON-LD `@type: EducationalOrganization` (`https://www.shikshit.in`)
  - JSON-LD `@type: FAQPage` (6 existing Q&As preserved)

---

## 4. Broken References & Technical Debt Found

During the code audit, multiple broken asset paths and ghost script tags were discovered. None of these will be modified in frozen pages, but all will be resolved on EDITABLE pages:

1. **Missing Stylesheets:**
   - `index.html` references `css/components/card-responsive-fixes.css` *(File does not exist in `css/components/`)*.
   - `product-services.html` (Frozen) references `css/style.css` *(File missing; reported but frozen)*.
2. **Missing JavaScript Files in `about-us.html`:**
   `about-us.html` contains 9 consecutive defunct script tags that fail with 404 errors in the console:
   - `js/mobile-menu-fix-new.js`
   - `js/mobile-menu-position-fix.js`
   - `js/mobile-menu-fix.js`
   - `js/mobile-menu-button-fix.js`
   - `js/direct-mobile-menu-fix.js`
   - `js/direct-fix.js`
   - `js/fix-hamburger-menu.js`
   - `js/search-toggle-fix.js`
   - `js/mobile-search-fix.js`
   - Missing component include: `<div include-html="navbar.html">` *(No `navbar.html` exists in root)*.
3. **Missing JavaScript in `contact.html` & `registration.html`:**
   - `contact.html` references `js/responsive-handler.js` *(File missing)*.
   - `registration.html` (Frozen) references `js/responsive-handler.js` *(File missing; reported but frozen)*.
4. **Missing Relative Path in `become-a-member.html`:**
   - Contains `<div include-html="sikshitfooter.html"></div>` instead of `components/sikshitfooter.html`.
5. **Broken Relative Path in `components/sikshitfooter.html`:**
   - Line 97 contains `href="../privacy-policy.html"` (extra `../` that breaks navigation when loaded on root pages).

---

## 5. Duplicate Legal Pages & Disambiguation

There are two distinct sets of legal pages that must remain cleanly separated:

```
├── NS-MAS Scholarship Scheme (FROZEN — DO NOT TOUCH)
│   ├── privacypolicy.html    (Title: "Privacy Policy | NS-MAS", 8.6 KB)
│   └── termsandservice.html  (Title: "NS-MAS Terms of Service", 12.1 KB)
│
└── Shikshit Educational Platform (EDITABLE — SCOPE OF REVAMP)
    ├── privacy-policy.html   (Title: "Privacy Policy - Shikshit", 6.6 KB)
    ├── terms.html            (Title: "Terms & Conditions - Shikshit", 9.2 KB)
    ├── disclaimer.html       (Title: "Disclaimer - Shikshit", 10.5 KB)
    └── cookie-policy.html    (Title: "Cookie Policy - Shikshit", 6.7 KB)
```

**Plan:**
- `privacypolicy.html` and `termsandservice.html` will remain untouched.
- `privacy-policy.html`, `terms.html`, `disclaimer.html`, and `cookie-policy.html` will be transformed from raw unstyled text into clean, modern, readable legal documents with sticky tables of contents, unified header/footer navigation, and WCAG AA contrast.

---

## 6. SEO & Metadata Deficiencies

### A. `robots.txt`
- **Current Content:**
  ```txt
  User-agent: *
  Disallow: 
  Sitemap: https://www.shikshit.in/
  ```
- **Issues:**
  - Trailing space after `Disallow:`.
  - Incomplete Sitemap directive (points to domain root instead of `https://www.shikshit.in/sitemap.xml`).
- **Correction Plan:**
  ```txt
  User-agent: *
  Allow: /
  Sitemap: https://www.shikshit.in/sitemap.xml
  ```

### B. `sitemap.xml`
- **Current State:** Only lists 8 URLs; last modified dates are frozen in August 2025 (`2025-08-14`).
- **Missing Pages:** `about-us.html`, `privacy-policy.html`, `terms.html`, `disclaimer.html`, `cookie-policy.html`, `how-it-works.html`, `privacypolicy.html`, `termsandservice.html`.
- **Expansion Plan:** Update to include all 28+ pages (editable, frozen, new pages, and all 10 blog articles) with accurate `<lastmod>`, `<priority>`, and `<changefreq>`.

### C. On-Page Metadata across Editable Pages
- **Missing Descriptions:** `about-us.html`, `contact.html`, and `become-a-member.html` have **NO** meta descriptions.
- **Mismatched Titles:** `about-us.html` and `contact.html` currently show titles labeled for NS-MAS instead of Shikshit.
- **Missing Canonical Tags:** None of the editable pages except `index.html` possess a `<link rel="canonical">`.
- **Missing Social Cards:** OG (`og:title`, `og:image`, `og:url`) and Twitter Cards are absent across `about-us.html`, `contact.html`, `donate.html`, and legal pages.

---

## 7. Media & Asset Performance Audit (~85.2 MB)

### A. The 5 Heaviest Media Assets

| File Path | File Type | Size (Bytes) | Size (MB) | Where Used | Action Plan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `images/WhatsApp Video 2025-06-09 at 12.10.45_3cbb461d.mp4` | Video (MP4) | 24,466,544 | **23.33 MB** | `ns-mas.html` (Frozen) | **Do not delete.** Retain original. |
| `images/videoNS_Mass.mp4` | Video (MP4) | 23,236,063 | **22.16 MB** | `ns-mas.html` (Frozen) | **Do not delete.** Retain original. |
| `images/VID-20250603-WA0004.mp4` | Video (MP4) | 18,618,885 | **17.76 MB** | `ns-mas.html` (Frozen) | **Do not delete.** Retain original. |
| `images/WhatsApp Video 2025-06-09 at 12.06.54_0fd5514b.mp4` | Video (MP4) | 14,537,321 | **13.86 MB** | `ns-mas.html` (Frozen) | **Do not delete.** Retain original. |
| `images/homeimage.jpg` | Image (JPG) | 2,062,651 | **1.97 MB** | Unused / Backup | **Do not delete.** Create optimized WebP (`homeimage.webp`, ~85 KB) for Shikshit pages. |

*Total Video Weight:* **77.11 MB** (90.5% of entire site).

### B. Rogue / Stray Files in `images/`
- `images/Home.html` (321 KB): A full HTML webpage mistakenly stored inside the image directory. **Will not be deleted** (per Rule 3/6), but documented as an orphan asset.

### C. Performance & Lazy-Loading Strategy (Zero Deletions)
1. **Never delete** any video or image asset.
2. For video players on Shikshit pages (`index.html`), use lightweight poster images (`poster="..."`), `preload="none"`, and lazy-load video containers using `IntersectionObserver` so that video buffers only when scrolled into viewport.
3. Every `<img>` tag on editable pages will receive explicit `width` and `height` dimensions to prevent layout shifts, along with `loading="lazy"` and `decoding="async"`.
4. Hero images will be preloaded with `<link rel="preload" as="image">` for instant Largest Contentful Paint (LCP).

---

## 8. Proposed Design System & Architecture

### A. Palette Derived from `images/sikshitlogo.webp`
- **Primary Brand Color:** `#6B46C1` (Royal Purple — derived directly from Shikshit branding)
- **Primary Light / Hover:** `#7C3AED` (Vibrant Violet)
- **Primary Dark / Active:** `#4C1D95` (Deep Imperial Purple)
- **Accent Color:** `#2563EB` (Bright Royal Blue) & `#06B6D4` (Cyan Energy)
- **Success / Trust:** `#059669` (Emerald Green)
- **Neutral Backgrounds:**
  - Surface White: `#FFFFFF`
  - Subtle Canvas: `#F8FAFC` (Slate 50)
  - Card Background: `#FFFFFF` with glassmorphic borders `rgba(107, 70, 193, 0.08)`
  - Text Primary: `#0F172A` (Slate 900 — high contrast WCAG AAA)
  - Text Secondary: `#475569` (Slate 600 — WCAG AA)

### B. Typography
- **Headings:** `'Outfit', sans-serif` (Google Font with `display=swap`)
- **Body & Data:** `'Plus Jakarta Sans', sans-serif` (Google Font with `display=swap`)

### C. File Architecture (Zero Pollution of Shared Files)
```
public_html/
├── css/
│   ├── shikshit/
│   │   ├── tokens.css     (Design tokens: colors, fluid typography, shadows, radii)
│   │   ├── base.css       (Modern reset, base layout, skip-link, accessibility)
│   │   ├── components.css (Navbar, footer, cards, buttons, badges, accordions, modals)
│   │   └── pages.css      (Page-specific styles for home, about, forms, legal, blog)
│   └── ... (Existing CSS files remain 100% untouched)
├── js/
│   ├── shikshit/
│   │   ├── main.js        (Header sticky state, mobile menu toggle, scroll progress, back-to-top)
│   │   ├── component-loader.js (Robust, cached component fetcher for footer/header)
│   │   └── gallery.js     (Lightweight image grid filter and accessible modal lightbox)
│   └── ... (Existing JS files remain 100% untouched)
```

---

## 9. Next Steps & Execution Plan

1. **Step 2 — Design System:**
   - Create `css/shikshit/tokens.css`, `css/shikshit/base.css`, and `css/shikshit/components.css`.
2. **Step 3 — Home Page Revamp (`index.html`):**
   - Streamline HTML markup (replacing inline styles with tokenized CSS).
   - Re-architect sections: Hero with clear CTA, Trust metrics counter, Services overview, NS-MAS highlight banner (linking to frozen `ns-mas.html`), Interactive journey roadmap, Testimonials carousel, Partner logos grid, 3 Featured articles, FAQ accordion with updated JSON-LD, and Final CTA.
   - **Pause for user review and approval.**
3. **Step 4 — Remaining Editable Pages:**
   - Revamp `about-us.html`, `contact.html`, `become-a-member.html`, `donate.html`, and the 4 legal pages (`privacy-policy.html`, `terms.html`, `disclaimer.html`, `cookie-policy.html`).
4. **Step 5 — New Pages & Blog Hub:**
   - Build `gallery.html`, `blog.html`, `careers.html`, and 10 in-depth blog articles in `blog/` (800–1200 words each with schema markup and internal links).
5. **Step 6 — SEO & Technical Polish:**
   - Update `robots.txt`, `sitemap.xml`, canonical URLs, JSON-LD schemas, and accessibility audits.
6. **Step 7 — QA & Byte-Level Diff Verification:**
   - Confirm forms and Razorpay behave identically.
   - Run checksum verification against `../public_html_backup/` to mathematically prove frozen files are untouched.
