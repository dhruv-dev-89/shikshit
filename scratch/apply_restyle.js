const fs = require('fs');
const path = require('path');

// 1. Prepare the HTML replacement for product-services.html
const productsSectionHtml = `  <!-- ======================================================================
       3. PRODUCT & SERVICES: Six Category Cards with Inner Sub-Grids
       Restyled with 3-column CSS Grid, 60px gradient circles, 01-06 numerals,
       light 2-column sub-items, amount chips, and interactive motion.
       ====================================================================== -->
  <section class="shikshit-section products-services-section" id="products-services">
    <div class="shikshit-container">
      <div class="shikshit-section-header editorial-reveal">
        <div class="shikshit-chip">Solutions &amp; Offerings 📚</div>
        <h2 class="products-section-heading">
          <span class="heading-line"><span class="heading-word">Product</span> <span class="heading-word">&amp;</span> <span class="heading-word">Services</span></span>
          <svg class="editorial-heading-underline" viewBox="0 0 280 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 12C75 4 190 3 276 10" stroke="url(#sigHeadingGrad)" stroke-width="4.5" stroke-linecap="round"/>
            <defs>
              <linearGradient id="sigHeadingGrad" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
                <stop stop-color="#7C3AED"/>
                <stop offset="0.5" stop-color="#C026D3"/>
                <stop offset="1" stop-color="#EC4899"/>
              </linearGradient>
            </defs>
          </svg>
        </h2>
        <p class="shikshit-section-subtitle">
          Comprehensive educational solutions and services designed to support students at every stage of their academic journey.
        </p>
      </div>

      <div class="services-editorial-grid">

        <!-- Card 1: Scholarship Program -->
        <div class="service-editorial-card editorial-reveal service-card" id="scholarship-program" data-card="01" tabindex="0">
          <div class="card-border-glow" aria-hidden="true"></div>
          <div class="service-card-header">
            <div class="service-card-icon icon-grad-1" aria-hidden="true">
              <span class="card-header-emoji">📚</span>
            </div>
            <div>
              <h3 class="service-card-title">Scholarship Program</h3>
              <div class="service-card-subtitle">Available Scholarships</div>
            </div>
          </div>
          <div class="card-accent-line" aria-hidden="true"></div>
          <div class="service-inner-grid">
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🎯</div>
              <div class="item-body">
                <h5>Academic Excellence</h5>
                <p>Merit-based scholarships for students with outstanding achievements.</p>
                <span class="service-amount-pill">Up to Rs 25,000</span>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🌍</div>
              <div class="item-body">
                <h5>International Students</h5>
                <p>Dedicated funding opportunities for international scholars.</p>
                <span class="service-amount-pill">Up to Rs 15,000</span>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">📋</div>
              <div class="item-body">
                <h5>STEM Majors</h5>
                <p>Special scholarships for Science, Tech, Engineering &amp; Math.</p>
                <span class="service-amount-pill">Up to Rs 20,000</span>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">📋</div>
              <div class="item-body">
                <h5>Research Grants</h5>
                <p>Funding for students in innovative research projects.</p>
                <span class="service-amount-pill">Up to Rs 10,000</span>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🏆</div>
              <div class="item-body">
                <h5>Leadership Awards</h5>
                <p>Recognition for exceptional leadership qualities.</p>
                <span class="service-amount-pill">Up to Rs 12,000</span>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🎯</div>
              <div class="item-body">
                <h5>Need-Based Aid</h5>
                <p>Financial assistance based on demonstrated need.</p>
                <span class="service-amount-pill">Varies</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Awareness Program -->
        <div class="service-editorial-card editorial-reveal service-card" id="awareness-programs" data-card="02" tabindex="0">
          <div class="card-border-glow" aria-hidden="true"></div>
          <div class="service-card-header">
            <div class="service-card-icon icon-grad-2" aria-hidden="true">
              <span class="card-header-emoji">💡</span>
            </div>
            <div>
              <h3 class="service-card-title">Awareness Program</h3>
              <div class="service-card-subtitle">Our Awareness Initiatives</div>
            </div>
          </div>
          <div class="card-accent-line" aria-hidden="true"></div>
          <div class="service-inner-grid">
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🌍</div>
              <div class="item-body">
                <h5>Environmental Awareness</h5>
                <p>Learn about climate change, sustainability, and how to protect our planet.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">💚</div>
              <div class="item-body">
                <h5>Mental Health</h5>
                <p>Understanding mental health, breaking stigmas, and promoting well-being.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">👥</div>
              <div class="item-body">
                <h5>Social Inclusion</h5>
                <p>Creating an inclusive society by understanding diversity and equality.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">💻</div>
              <div class="item-body">
                <h5>Digital Wellness</h5>
                <p>Promoting safe internet practices and balanced technology usage.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Olympiads -->
        <div class="service-editorial-card editorial-reveal service-card" id="olympiads" data-card="03" tabindex="0">
          <div class="card-border-glow" aria-hidden="true"></div>
          <div class="service-card-header">
            <div class="service-card-icon icon-grad-3" aria-hidden="true">
              <span class="card-header-emoji">🏆</span>
            </div>
            <div>
              <h3 class="service-card-title">Olympiads</h3>
              <div class="service-card-subtitle">Competitive Academic Challenges</div>
            </div>
          </div>
          <div class="card-accent-line" aria-hidden="true"></div>
          <div class="service-inner-grid">
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">📐</div>
              <div class="item-body">
                <h5>Mathematics Olympiad</h5>
                <p>Challenge analytical and mathematical problem-solving skills nationally.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🔬</div>
              <div class="item-body">
                <h5>Science Olympiad</h5>
                <p>Test deep conceptual understanding across physics, chemistry, biology.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">💻</div>
              <div class="item-body">
                <h5>Coding Olympiad</h5>
                <p>Algorithmic programming and competitive computational thinking contests.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">📖</div>
              <div class="item-body">
                <h5>English Language Olympiad</h5>
                <p>Comprehensive vocabulary, grammar, and communicative skills assessment.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: Financial-Aid Program -->
        <div class="service-editorial-card editorial-reveal service-card" id="financial-aid" data-card="04" tabindex="0">
          <div class="card-border-glow" aria-hidden="true"></div>
          <div class="service-card-header">
            <div class="service-card-icon icon-grad-4" aria-hidden="true">
              <span class="card-header-emoji">🤝</span>
            </div>
            <div>
              <h3 class="service-card-title">Financial-Aid Program</h3>
              <div class="service-card-subtitle">Direct Student Support Schemes</div>
            </div>
          </div>
          <div class="card-accent-line" aria-hidden="true"></div>
          <div class="service-inner-grid">
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🎓</div>
              <div class="item-body">
                <h5>Tuition Fee Grants</h5>
                <p>Direct assistance covering academic term fees for deserving candidates.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">📚</div>
              <div class="item-body">
                <h5>Book &amp; Resource Stipends</h5>
                <p>Assistance for essential textbooks, study guides, and lab equipment.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">⚡</div>
              <div class="item-body">
                <h5>Emergency Educational Aid</h5>
                <p>Immediate support during sudden family hardships or medical crises.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🏠</div>
              <div class="item-body">
                <h5>Hostel &amp; Travel Subsidies</h5>
                <p>Help with living and accommodation costs for rural students.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 5: Technical Training -->
        <div class="service-editorial-card editorial-reveal service-card" id="technical-training" data-card="05" tabindex="0">
          <div class="card-border-glow" aria-hidden="true"></div>
          <div class="service-card-header">
            <div class="service-card-icon icon-grad-5" aria-hidden="true">
              <span class="card-header-emoji">💻</span>
            </div>
            <div>
              <h3 class="service-card-title">Technical Training</h3>
              <div class="service-card-subtitle">Industry-Ready Skill Development</div>
            </div>
          </div>
          <div class="card-accent-line" aria-hidden="true"></div>
          <div class="service-inner-grid">
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🌐</div>
              <div class="item-body">
                <h5>Full-Stack Web Development</h5>
                <p>Hands-on modern web tech, front-end, back-end, and cloud deployments.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">📊</div>
              <div class="item-body">
                <h5>Data Science &amp; AI</h5>
                <p>Practical Python, machine learning workflows, and data analytics.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🛡️</div>
              <div class="item-body">
                <h5>Cyber Security Fundamentals</h5>
                <p>Defense techniques, ethical hacking, and certified training.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">☁️</div>
              <div class="item-body">
                <h5>Cloud Computing Essentials</h5>
                <p>Core infrastructure, DevOps pipelines, and cloud platform mastery.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 6: Diploma Courses (Balanced shorter card: 2 items) -->
        <div class="service-editorial-card editorial-reveal service-card card-diploma" id="diploma-courses" data-card="06" tabindex="0">
          <div class="card-border-glow" aria-hidden="true"></div>
          <div class="service-card-header">
            <div class="service-card-icon icon-grad-6" aria-hidden="true">
              <span class="card-header-emoji">📜</span>
            </div>
            <div>
              <h3 class="service-card-title">Diploma Courses</h3>
              <div class="service-card-subtitle">Accredited Certification &amp; Diplomas</div>
            </div>
          </div>
          <div class="card-accent-line" aria-hidden="true"></div>
          <div class="service-inner-grid">
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🎓</div>
              <div class="item-body">
                <h5>Professional Diplomas</h5>
                <p>Certified programs with placement and article-ship support.</p>
              </div>
            </div>
            <div class="service-inner-item" tabindex="0">
              <div class="item-icon-circle" aria-hidden="true">🌟</div>
              <div class="item-body">
                <h5>Honorary Doctorate</h5>
                <p>Recognition of exemplary contributions to education and community development.</p>
              </div>
            </div>
          </div>

          <!-- Soft decorative balance element for 2-item shorter card -->
          <div class="diploma-balance-ornament" aria-hidden="true">
            <div class="diploma-ornament-glow"></div>
            <div class="diploma-ornament-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>UGC Recognized &amp; Skill Aligned Certification</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>`;

function updateFile(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf8');

  // Replace from start of scholarship section ("<!-- Scholarship Program Section -->" or '<section id="scholarship-program"')
  // up to before the video carousel ("<!-- Video Section -->")
  const beforeVideoRegex = /(?:<!-- Scholarship Program Section -->\s*)?<section id="scholarship-program"[\s\S]*?(?=<!-- Video Section -->|<section class="video-carousel")/i;

  if (beforeVideoRegex.test(content)) {
    content = content.replace(beforeVideoRegex, productsSectionHtml + '\n\n  ');
    console.log(`Replaced first 5 sections before Video Section in ${htmlPath}`);
  } else {
    console.error(`Could not match beforeVideoRegex in ${htmlPath}`);
  }

  // Remove the old legacy Diploma Courses section (from "<!-- Diploma Courses Section -->" to before "<!-- ======================================================================\n         5. CLOSING CTA BAND")
  const oldDiplomaRegex = /(?:<!-- Diploma Courses Section -->\s*)?<section id="diploma-courses"[\s\S]*?(?=<!-- ======================================================================\s*5\.\s*CLOSING CTA BAND|<div class="products-cta-band")/i;

  if (oldDiplomaRegex.test(content)) {
    content = content.replace(oldDiplomaRegex, '');
    console.log(`Removed old Diploma Courses section in ${htmlPath}`);
  } else {
    console.warn(`Could not find old Diploma Courses section in ${htmlPath} (might already be removed)`);
  }

  fs.writeFileSync(htmlPath, content, 'utf8');
}

const p1 = path.join(__dirname, '..', 'public_html', 'product-services.html');
const p2 = path.join(__dirname, '..', 'public_html (77)', 'product-services.html');

updateFile(p1);
updateFile(p2);
console.log('Finished updating product-services.html in both folders.');
