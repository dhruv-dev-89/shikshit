const fs = require('fs');

['public_html/css/shikshit/donate.css', 'public_html (77)/css/shikshit/donate.css'].forEach(p => {
  let css = fs.readFileSync(p, 'utf8');
  
  // Ensure intervention cards are guaranteed visible
  css = css.replace(
    /body\.page-donate \.intervention-card \{[\s\S]*?body\.page-donate \.intervention-card:hover/m,
    `body.page-donate .intervention-card {
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

body.page-donate .intervention-card:hover`
  );

  // Update scroll reveal section
  css = css.replace(
    /\.scroll-reveal-item \{[\s\S]*?\.scroll-reveal-item\.is-visible \{[^}]*\}/m,
    `body.page-donate .scroll-reveal-item {
  opacity: 1 !important;
  visibility: visible !important;
}

body.page-donate .scroll-reveal-ready {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

body.page-donate .scroll-reveal-ready.is-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}`
  );

  fs.writeFileSync(p, css, 'utf8');
  console.log('Updated ' + p);
});

['public_html/css/shikshit/member.css', 'public_html (77)/css/shikshit/member.css'].forEach(p => {
  let css = fs.readFileSync(p, 'utf8');

  css = css.replace(
    /\.scroll-reveal-item \{[\s\S]*?\.scroll-reveal-item\.is-visible \{[^}]*\}/m,
    `body.page-member .scroll-reveal-item {
  opacity: 1 !important;
  visibility: visible !important;
}

body.page-member .scroll-reveal-ready {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

body.page-member .scroll-reveal-ready.is-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}`
  );

  fs.writeFileSync(p, css, 'utf8');
  console.log('Updated ' + p);
});
