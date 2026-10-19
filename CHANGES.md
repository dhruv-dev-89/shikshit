# Shikshit Website Revamp — Phase 1 Changelog

## 1. Modified (Design & Structural Revamp Only)

- **`index.html` (Homepage)**:
  - Eliminated 740 inline style attributes and 103 KB of raw embedded `<style>` blocks.
  - Linked to new modular, light-themed CSS stylesheets in `css/shikshit/` without modifying any shared or frozen legacy styles.
  - Removed broken video placeholders (`video1.mp4`–`video6.mp4` and `thumb1.jpg`–`thumb6.jpg`) and replaced them with an optimized player referencing verified asset `images/videoNS_Mass.mp4` with `preload="none"`.
  - Re-architected into 13 semantic, light-themed sections:
    1. **Sticky Header:** Clean white background (`#FFFFFF`), border (`#E2E8F0`), brand logo, navigation links, and "Apply Scholarship" primary CTA.
    2. **Hero Section:** Responsive two-column desktop / stacked mobile layout on subtle lavender (`#F5F3FF`) to white gradient, featuring real educational imagery (`images/coursesimg.jpg`), headline, copy, and verified student avatars (`client1.webp`–`client4.webp`).
    3. **Compact Trust Metrics:** 4 compact cards displaying verified figures (5,000+ scholarships, 15,000+ students, 50+ partners, 98% feedback).
    4. **About Shikshit (Mission & Vision):** Balanced cards using original image assets (`images/mission.webp`, `images/vision.webp`).
    5. **NS-MAS Scholarship Highlight:** Distinctive, light-themed lavender card (`#F5F3FF`) with deep purple border (`#6B46C1`) and heading (`#4C1D95`), providing key facts and direct CTAs to frozen `ns-mas.html`, `how-it-works.html`, and `scholarship.html`.
    6. **Programs & Services (6 Cards):** Scholarship Programs, Financial Assistance, Technical Training, Certification & Diplomas, Educational Awareness, and Academic Olympiads.
    7. **Educational Journey (4 Steps):** Step-by-step process (Discover, Check Eligibility, Submit Application, Access Support).
    8. **Educational Activities & Gallery Preview:** 8-card varied editorial gallery featuring `acc1.jpg` through `acc_8.jpg` with descriptive alt tags and CTA to `gallery.html`.
    9. **Video Showcase:** Lazy-loaded video player (`videoNS_Mass.mp4`) with `preload="none"` and poster.
    10. **Leadership & Advisory Council:** 8 verified profiles (`team1.webp` through `team8.webp`).
    11. **Student Testimonials:** 3 verified 5-star review cards with student avatars (`client1.webp`–`client3.webp`).
    12. **Institutional Partners Marquee:** Smooth, pause-on-hover logo ticker featuring `org1.png`–`org12.png`, `_forbes.png`, `edugorilla.jpeg`, `urbanpro.jpeg`, and `gooverseas.webp`.
    13. **Frequently Asked Questions:** Exactly 6 original FAQ entries matching the `FAQPage` JSON-LD schema, featuring an accessible, keyboard-operable accordion toggle.
    14. **Final Call to Action:** Light lavender card (`#F5F3FF`) with purple CTAs.
    15. **Footer:** Inclusion of `components/sikshitfooter.html` with resilient light-theme fallback.
    16. **Floating Action Hub:** Preserved hooks for `#whatsapp-btn`, `#support-btn`, and `#donate-btn`.

---

## 2. New Additions (Phase 1 Design System)

- **`css/shikshit/tokens.css`**:
  - Exact light-theme design tokens:
    - Primary purple: `#6B46C1`
    - Primary hover: `#7C3AED`
    - Deep purple: `#4C1D95`
    - Education blue: `#2563EB`
    - Restrained cyan accent: `#06B6D4`
    - Success green: `#059669`
    - Main background: `#FFFFFF`
    - Soft background: `#F8FAFC`
    - Lavender background: `#F5F3FF`
    - Pale cyan background: `#ECFEFF`
    - Primary text: `#0F172A`
    - Secondary text: `#475569`
    - Borders: `#E2E8F0`
  - Typography tokens for `Outfit` and `Plus Jakarta Sans` using fluid `clamp()`.
- **`css/shikshit/base.css`**: CSS reset, skip link, accessible `:focus-visible` styling, responsive container utilities, and `@media (prefers-reduced-motion)` support.
- **`css/shikshit/components.css`**: Styles for the sticky header, navigation, buttons, cards, badges, trust metrics, FAQ accordion, partners ticker, and floating action hub.
- **`css/shikshit/pages.css`**: Homepage layout grids, hero section, mission/vision, NS-MAS highlight, activities gallery, and final CTA.
- **`js/shikshit/main.js`**: Sticky header scroll listener, mobile navigation drawer toggle, animated counters via `IntersectionObserver`, and accessible FAQ accordion toggle.
- **`server.js`**: Local static HTTP development server with range request support for video streaming.

---

## 3. Frozen Files Verified Unchanged (SHA-256 Checksum Match)

All of the following files were verified against `../public_html_backup/` and remain 100% byte-identical:
- `ns-mas.html`: SHA-256 Verified
- `scholarship.html`: SHA-256 Verified
- `privacypolicy.html`: SHA-256 Verified
- `termsandservice.html`: SHA-256 Verified
- `registration.html`: SHA-256 Verified
- `how-it-works.html`: SHA-256 Verified
- `product-services.html`: SHA-256 Verified
- `components/nsmas_navbar.html`: SHA-256 Verified
- `components/nsmas-floating-button.html`: SHA-256 Verified
- `components/footer.html`: SHA-256 Verified
- `css/home.css`: SHA-256 Verified
- `css/review-cards.css`: SHA-256 Verified
- `css/scholarship-animations.css`: SHA-256 Verified
- `css/sikshitnavbar.css`: SHA-256 Verified
- `css/responsive.css`: SHA-256 Verified
- `css/heading-styles.css`: SHA-256 Verified
- `css/mobile-menu-fix.css`: SHA-256 Verified
- `css/floating-buttons.css`: SHA-256 Verified
- `js/home.js`: SHA-256 Verified
- `js/scholarship-animations.js`: SHA-256 Verified
- `js/script.js`: SHA-256 Verified
- `js/hamburger-menu-fix.js`: SHA-256 Verified
