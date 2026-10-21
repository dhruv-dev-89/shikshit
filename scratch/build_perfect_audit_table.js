const fs = require('fs');

const items = JSON.parse(fs.readFileSync('scratch/svg_analysis.json', 'utf8'));
const fullHtml = fs.readFileSync('public_html/become-a-member.html', 'utf8');
const lines = fullHtml.split('\n');

const audit = [
  // 1-3 Navbar Links
  {
    index: 1,
    line: 641,
    location: "Navbar (Desktop & Mobile)",
    rep: "NS-MAS Home Link",
    style: "Outline (0 0 24 24)",
    size: "16x16 (CSS .nav-icon)",
    color: "currentColor (.nav-icon)",
    problems: "Missing explicit width=\"16\" height=\"16\" attributes; missing explicit fill=\"none\"; relies entirely on shared css/sikshitnavbar.css"
  },
  {
    index: 2,
    line: 649,
    location: "Navbar (Desktop & Mobile)",
    rep: "Products & Services Link (Book)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (CSS .nav-icon)",
    color: "currentColor (.nav-icon)",
    problems: "Missing explicit width=\"16\" height=\"16\" attributes; missing explicit fill=\"none\"; relies entirely on shared css/sikshitnavbar.css"
  },
  {
    index: 3,
    line: 657,
    location: "Navbar (Desktop & Mobile)",
    rep: "Apply Now Link (Document)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (CSS .nav-icon)",
    color: "currentColor (.nav-icon)",
    problems: "Missing explicit width=\"16\" height=\"16\" attributes; missing explicit fill=\"none\"; relies entirely on shared css/sikshitnavbar.css"
  },
  // 4-5 Navbar Buttons
  {
    index: 4,
    line: 669,
    location: "Navbar CTA Button",
    rep: "Become a Member Button (Users)",
    style: "Outline (0 0 24 24)",
    size: "16x16",
    color: "currentColor",
    problems: "Missing explicit stroke-width on element; needs proper centering with button label"
  },
  {
    index: 5,
    line: 675,
    location: "Navbar CTA Button",
    rep: "Donate Us Button (Heart)",
    style: "Outline (0 0 24 24)",
    size: "16x16",
    color: "currentColor",
    problems: "Missing explicit stroke-width on element; needs proper centering with button label"
  },
  // 6-9 Floating Background Icons
  {
    index: 6,
    line: 716,
    location: "Hero Floating Decor 1 (Top-Left)",
    rep: "Graduation Cap Decor",
    style: "Solid (0 0 20 20)",
    size: "64x64 (w-16 h-16)",
    color: "text-white (opacity via CSS)",
    problems: "Missing width=\"64\" height=\"64\" fallback; cap path reused redundantly; risk of clipping on mobile viewports; pointer-events not set to none"
  },
  {
    index: 7,
    line: 722,
    location: "Hero Floating Decor 2 (Top-Right)",
    rep: "Checkmark Circle Decor",
    style: "Outline path in Solid viewBox (0 0 20 20)",
    size: "48x48 (w-12 h-12)",
    color: "text-white (opacity via CSS)",
    problems: "Missing width=\"48\" height=\"48\" fallback; mismatched outline stroke path inside fill=\"currentColor\" viewBox=\"0 0 20 20\"; pointer-events not set to none"
  },
  {
    index: 8,
    line: 728,
    location: "Hero Floating Decor 3 (Bottom-Left)",
    rep: "Document / Certificate Decor",
    style: "Solid (0 0 20 20)",
    size: "56x56 (w-14 h-14)",
    color: "text-white (opacity via CSS)",
    problems: "Missing width=\"56\" height=\"56\" fallback; heavy solid fill lacks visual harmony with modern outline design tokens; pointer-events not set to none"
  },
  {
    index: 9,
    line: 734,
    location: "Hero Floating Decor 4 (Bottom-Right)",
    rep: "List / View Rows Decor",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-white (opacity via CSS)",
    problems: "Missing width=\"40\" height=\"40\" fallback; generic horizontal stripes path; pointer-events not set to none"
  },
  // 10-11 Hero Heading Accents
  {
    index: 10,
    line: 746,
    location: "Hero Heading Left Accent",
    rep: "Graduation Cap Pod",
    style: "Solid (0 0 20 20)",
    size: "40px-80px responsive",
    color: "text-white",
    problems: "Missing explicit width/height fallback; redundant cap reuse; container has conflicting responsive width classes that cause layout shift if CDN delayed"
  },
  {
    index: 11,
    line: 754,
    location: "Hero Heading Right Accent",
    rep: "Certificate / Document Pod",
    style: "Solid (0 0 20 20)",
    size: "40px-80px responsive",
    color: "text-white",
    problems: "Missing explicit width/height fallback; heavy solid fill; container has conflicting responsive width classes"
  },
  // 12 Hero CTA
  {
    index: 12,
    line: 766,
    location: "Hero CTA Button",
    rep: "\"Join Our Community Today\" Arrow",
    style: "Outline (0 0 24 24)",
    size: "16x16 / 20x20 responsive",
    color: "currentColor",
    problems: "Missing width=\"20\" height=\"20\" fallback; arrow does not have smooth hover slide animation"
  },
  // 13-14 Plans Heading Accents
  {
    index: 13,
    line: 789,
    location: "\"Membership Plans\" Heading Left Accent",
    rep: "Graduation Cap Pod",
    style: "Solid (0 0 20 20)",
    size: "80x80 (w-20 h-20)",
    color: "text-purple-600",
    problems: "Missing width=\"80\" height=\"80\" fallback; oversized solid cap; redundant repetition of cap icon"
  },
  {
    index: 14,
    line: 800,
    location: "\"Membership Plans\" Heading Right Accent",
    rep: "Badge / Rosette Pod",
    style: "Solid (0 0 20 20)",
    size: "80x80 (w-20 h-20)",
    color: "text-blue-600",
    problems: "Missing width=\"80\" height=\"80\" fallback; heavy solid rosette shape; missing outline parity"
  },
  // 15-18 Key Benefits Banner Checkmarks
  {
    index: 15,
    line: 815,
    location: "Key Benefits Banner",
    rep: "Checkmark: \"Lifetime Access\"",
    style: "Solid (0 0 20 20)",
    size: "20x20 (w-5 h-5)",
    color: "text-green-500",
    problems: "Missing width=\"20\" height=\"20\" fallback; not vertically centered with text on mobile; missing draw-in motion"
  },
  {
    index: 16,
    line: 821,
    location: "Key Benefits Banner",
    rep: "Checkmark: \"Recognition Certificate\"",
    style: "Solid (0 0 20 20)",
    size: "20x20 (w-5 h-5)",
    color: "text-green-500",
    problems: "Missing width=\"20\" height=\"20\" fallback; not vertically centered with text on mobile; missing draw-in motion"
  },
  {
    index: 17,
    line: 827,
    location: "Key Benefits Banner",
    rep: "Checkmark: \"Scholarship Opportunities\"",
    style: "Solid (0 0 20 20)",
    size: "20x20 (w-5 h-5)",
    color: "text-green-500",
    problems: "Missing width=\"20\" height=\"20\" fallback; not vertically centered with text on mobile; missing draw-in motion"
  },
  {
    index: 18,
    line: 833,
    location: "Key Benefits Banner",
    rep: "Checkmark: \"Network Access\"",
    style: "Solid (0 0 20 20)",
    size: "20x20 (w-5 h-5)",
    color: "text-green-500",
    problems: "Missing width=\"20\" height=\"20\" fallback; not vertically centered with text on mobile; missing draw-in motion"
  },
  // 19-24 Membership Tier Cards
  {
    index: 19,
    line: 850,
    location: "Membership Card 1",
    rep: "Individual Membership Card Icon",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-purple-600",
    problems: "Missing width=\"40\" height=\"40\" fallback; graduation-cap path reused inappropriately for \"Individual\" (should be User / Profile); solid style clashes with outline cards"
  },
  {
    index: 20,
    line: 868,
    location: "Membership Card 2",
    rep: "Institutional Membership Card Icon",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-blue-600",
    problems: "Missing width=\"40\" height=\"40\" fallback; graduation-cap path reused inappropriately for \"Institution\" (should be Academic Building / Library)"
  },
  {
    index: 21,
    line: 887,
    location: "Membership Card 3",
    rep: "Student Membership Card Icon",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-greeni-600 (Typo)",
    problems: "Typo class \"text-greeni-600\" renders icon completely invisible/uncoloured; missing width=\"40\" height=\"40\" fallback; solid style clashes with outline family"
  },
  {
    index: 22,
    line: 922,
    location: "Special Membership Card 4",
    rep: "Patron / Corporate Card Icon",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-orange-600",
    problems: "Missing width=\"40\" height=\"40\" fallback; graduation-cap path reused inappropriately for corporate/patron (should be Building / Briefcase)"
  },
  {
    index: 23,
    line: 942,
    location: "Special Membership Card 5",
    rep: "Lifetime Member Card Icon",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-teal-600",
    problems: "Missing width=\"40\" height=\"40\" fallback; graduation-cap path reused inappropriately for lifetime (should be Shield / Star badge)"
  },
  {
    index: 24,
    line: 963,
    location: "Special Membership Card 6",
    rep: "Honorary Member Card Icon",
    style: "Solid (0 0 20 20)",
    size: "40x40 (w-10 h-10)",
    color: "text-indigo-600",
    problems: "Missing width=\"40\" height=\"40\" fallback; graduation-cap path reused inappropriately for honorary (should be Award / Ribbon / Crown)"
  },
  // 25-34 Application Form
  {
    index: 25,
    line: 1012,
    location: "Application Form Header",
    rep: "Application Form Pod Icon",
    style: "Outline (0 0 24 24)",
    size: "32x32 (w-8 h-8)",
    color: "text-purple-600",
    problems: "Missing width=\"32\" height=\"32\" fallback; missing stroke-width=\"1.75\"; needs subtle float and inner highlight"
  },
  {
    index: 26,
    line: 1024,
    location: "Application Form Label",
    rep: "Full Name Label Icon (User)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (w-4 h-4)",
    color: "text-purple-600",
    problems: "Missing width=\"18\" height=\"18\" fallback; undersized at 16px instead of 18px standard; vertical alignment offset with label text"
  },
  {
    index: 27,
    line: 1035,
    location: "Application Form Label",
    rep: "Email Address Label Icon (Mail)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (w-4 h-4)",
    color: "text-purple-600",
    problems: "Missing width=\"18\" height=\"18\" fallback; undersized at 16px instead of 18px standard; vertical alignment offset with label text"
  },
  {
    index: 28,
    line: 1046,
    location: "Application Form Label",
    rep: "Phone Number Label Icon (Phone)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (w-4 h-4)",
    color: "text-purple-600",
    problems: "Missing width=\"18\" height=\"18\" fallback; undersized at 16px instead of 18px standard; vertical alignment offset with label text"
  },
  {
    index: 29,
    line: 1057,
    location: "Application Form Label",
    rep: "Institution / Org Label Icon (Building)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (w-4 h-4)",
    color: "text-purple-600",
    problems: "Missing width=\"18\" height=\"18\" fallback; undersized at 16px instead of 18px standard; vertical alignment offset with label text"
  },
  {
    index: 30,
    line: 1068,
    location: "Application Form Label",
    rep: "City / Location Label Icon (Map Pin)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (w-4 h-4)",
    color: "text-purple-600",
    problems: "Missing width=\"18\" height=\"18\" fallback; undersized at 16px instead of 18px standard; vertical alignment offset with label text"
  },
  {
    index: 31,
    line: 1080,
    location: "Application Form Label",
    rep: "Membership Type Label Icon (Badge)",
    style: "Outline (0 0 24 24)",
    size: "16x16 (w-4 h-4)",
    color: "text-purple-600",
    problems: "Missing width=\"18\" height=\"18\" fallback; undersized at 16px instead of 18px standard; vertical alignment offset with label text"
  },
  {
    index: 32,
    line: 1094,
    location: "Application Form Field",
    rep: "Select Dropdown Chevron Icon",
    style: "Outline (0 0 24 24)",
    size: "20x20 (w-5 h-5)",
    color: "currentColor (gray-400)",
    problems: "Missing width=\"20\" height=\"20\" fallback; lacks absolute vertical centering inside select field container; risks overlapping selected option text"
  },
  {
    index: 33,
    line: 1102,
    location: "Application Form Submit Button",
    rep: "Paper Airplane Icon (Leading)",
    style: "Outline (0 0 24 24)",
    size: "20x20 (w-5 h-5)",
    color: "currentColor",
    problems: "Missing width=\"20\" height=\"20\" fallback; rotation transition lacks hardware-accelerated transform timing"
  },
  {
    index: 34,
    line: 1106,
    location: "Application Form Submit Button",
    rep: "Arrow Right Icon (Trailing)",
    style: "Outline (0 0 24 24)",
    size: "20x20 (w-5 h-5)",
    color: "currentColor",
    problems: "Missing width=\"20\" height=\"20\" fallback; slide transition lacks hardware-accelerated transform timing"
  },
  // 35-38 "Why Choose Shikshit" Feature Tiles
  {
    index: 35,
    line: 1134,
    location: "\"Why Choose\" Tile 1",
    rep: "Equal Opportunity Icon (Sparkles / Shield)",
    style: "Solid (0 0 20 20)",
    size: "28x28 (w-7 h-7)",
    color: "text-white",
    problems: "Missing width=\"28\" height=\"28\" fallback; heavy solid fill lacks visual clarity; holder lacks consistent 56px/64px grid centering"
  },
  {
    index: 36,
    line: 1149,
    location: "\"Why Choose\" Tile 2",
    rep: "Comprehensive Support Icon (Card / Finance)",
    style: "Solid (0 0 20 20)",
    size: "28x28 (w-7 h-7)",
    color: "text-white",
    problems: "Missing width=\"28\" height=\"28\" fallback; solid fill; holder lacks consistent 56px/64px grid centering"
  },
  {
    index: 37,
    line: 1165,
    location: "\"Why Choose\" Tile 3",
    rep: "Quality Education Icon (Briefcase / School)",
    style: "Solid (0 0 20 20)",
    size: "28x28 (w-7 h-7)",
    color: "text-white",
    problems: "Missing width=\"28\" height=\"28\" fallback; solid fill; holder lacks consistent 56px/64px grid centering"
  },
  {
    index: 38,
    line: 1181,
    location: "\"Why Choose\" Tile 4",
    rep: "Community Focus Icon (Globe / Network)",
    style: "Solid (0 0 20 20)",
    size: "28x28 (w-7 h-7)",
    color: "text-white",
    problems: "Missing width=\"28\" height=\"28\" fallback; solid fill; holder lacks consistent 56px/64px grid centering"
  },
  // 39-41 Removed Floating Action Hub Icons
  {
    index: 39,
    line: 1355,
    location: "Floating Action Hub (Removed)",
    rep: "WhatsApp Button Icon",
    style: "Outline (0 0 24 24)",
    size: "24x24",
    color: "#whatsapp-btn",
    problems: "Removed from page in previous authorized task (hub relocated to contact.html as Quick Connect section). Skipped per prompt rule."
  },
  {
    index: 40,
    line: 1363,
    location: "Floating Action Hub (Removed)",
    rep: "Call / Support Button Icon",
    style: "Outline (0 0 24 24)",
    size: "24x24",
    color: "#support-btn",
    problems: "Removed from page in previous authorized task (hub relocated to contact.html as Quick Connect section). Skipped per prompt rule."
  },
  {
    index: 41,
    line: 1371,
    location: "Floating Action Hub (Removed)",
    rep: "Donate Heart Button Icon",
    style: "Outline (0 0 24 24)",
    size: "24x24",
    color: "#donate-btn",
    problems: "Removed from page in previous authorized task (hub relocated to contact.html as Quick Connect section). Skipped per prompt rule."
  }
];

let mdFinal = '| # | Line | Location | Representation | Style & ViewBox | Intended Size | Colour Class | Problems Found |\n';
mdFinal += '|:---:|:---:|:---|:---|:---|:---:|:---|:---|\n';

audit.forEach(a => {
  mdFinal += `| ${a.index} | L${a.line} | ${a.location} | ${a.rep} | ${a.style} | ${a.size} | \`${a.color}\` | ${a.problems} |\n`;
});

fs.writeFileSync('scratch/full_audit_table.md', mdFinal);
console.log('Final audit table generated');
