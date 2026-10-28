/**
 * Shikshit Articles & Blog Data and Component Generator
 * Centralized data structure for published editorial articles across Medium, Dev.to, Substack, and Tumblr.
 */

const SHIKSHIT_ARTICLES = [
  {
    id: 'article-1',
    title: 'Education Relief and Humanitarian Aid: Why Children Need Both',
    url: 'https://medium.com/@deeksha_62703/education-relief-and-humanitarian-aid-why-children-need-both-dd3b3a1eefc7',
    platform: 'Medium',
    platformClass: 'platform-medium',
    image: 'images/blog/blog-education-relief.jpg',
    alt: 'Children receiving educational support and humanitarian aid',
    description: 'In times of crisis and displacement, humanitarian aid provides immediate survival while educational relief protects a child’s future. Discover why children urgently need both to maintain learning continuity.',
    readTime: '5 min read'
  },
  {
    id: 'article-2',
    title: 'After the Nepal Floods: How Shikshit Is Helping Children Get Back to Learning',
    url: 'https://dev.to/shikshit02/after-the-nepal-floods-how-shikshit-is-helping-children-get-back-to-learning-23og',
    platform: 'Dev.to',
    platformClass: 'platform-devto',
    image: 'images/blog/blog-nepal-recovery.jpg',
    alt: 'Educational recovery and children returning to learning after floods',
    description: 'Devastating floods swept away classrooms and school supplies across vulnerable communities. Here is how Shikshit mobilized relief to help children safely return to active learning.',
    readTime: '4 min read'
  },
  {
    id: 'article-3',
    title: "After the Flood: Rebuilding a Child's Future",
    url: 'https://shiskhit.substack.com/p/after-the-flood-rebuilding-a-childs',
    platform: 'Substack',
    platformClass: 'platform-substack',
    image: 'images/blog/blog-rebuilding-future.jpg',
    alt: 'Rebuilding schools and educational infrastructure after natural disasters',
    description: 'Natural disasters leave long-lasting challenges for young minds. We examine the essential work of reconstructing classrooms, restoring stability, and nurturing a hopeful academic journey.',
    readTime: '6 min read'
  },
  {
    id: 'article-4',
    title: 'Shikshit Blog',
    url: 'https://www.tumblr.com/blog/shikshit',
    platform: 'Tumblr',
    platformClass: 'platform-tumblr',
    image: 'images/blog/blog-community-development.jpg',
    alt: 'Education, community initiatives, and child development',
    description: 'Explore regular dispatches, volunteer experiences, and insightful updates highlighting our community workshops, scholarship outreach, and grassroots child development initiatives.',
    readTime: 'Editorial Hub'
  },
  {
    id: 'article-5',
    title: 'Breaking the Cycle of Poverty Through Education',
    url: 'https://shiskhit.substack.com/p/breaking-the-cycle-of-poverty-through?r=91gtji&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    platform: 'Substack',
    platformClass: 'platform-substack',
    image: 'images/blog/blog-breaking-poverty.jpg',
    alt: 'Children studying and educational empowerment creating a better future',
    description: 'Education is the ultimate equalizer. Discover how targeted scholarships, skill-building opportunities, and academic mentorship dismantle structural barriers for deserving students.',
    readTime: '5 min read'
  },
  {
    id: 'article-6',
    title: 'Every Child Deserves a Safe and Supportive Learning Environment',
    url: 'https://medium.com/@deeksha_62703/every-child-deserves-a-safe-and-supportive-learning-environment-d1f342e5d2d',
    platform: 'Medium',
    platformClass: 'platform-medium',
    image: 'images/blog/blog-safe-learning.jpg',
    alt: 'Children learning in a safe, inclusive, and supportive classroom environment',
    description: 'True education requires more than textbooks—it thrives when students feel secure, respected, and heard. Why creating safe learning spaces is essential for holistic child development.',
    readTime: '4 min read'
  }
];

/**
 * Reusable Card Component Renderer
 * @param {Object} article - Article item from SHIKSHIT_ARTICLES
 * @returns {string} HTML markup string
 */
function renderArticleCard(article) {
  return `
    <article class="article-card editorial-reveal" id="${article.id}">
      <div class="article-media">
        <span class="article-platform-badge">
          <span class="platform-dot ${article.platformClass}"></span>
          ${article.platform}
        </span>
        <img src="${article.image}" alt="${article.alt}" class="article-img" loading="lazy">
      </div>
      <div class="article-body">
        <h3 class="article-title">
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">
            ${article.title}
          </a>
        </h3>
        <p class="article-desc">
          ${article.description}
        </p>
        <div class="article-footer">
          <span class="article-read-time">${article.readTime}</span>
          <a href="${article.url}" class="article-btn" target="_blank" rel="noopener noreferrer" aria-label="Read Article: ${article.title} (opens in a new tab)">
            Read Article
            <span class="article-btn-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </article>
  `;
}

// Export for module/script usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SHIKSHIT_ARTICLES, renderArticleCard };
}

