/**
 * Shikshit Blogs Page Interactive Filters & Motion
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Interactive Platform Filter Tabs
  const filterButtons = document.querySelectorAll('.blogs-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const spotlightCard = document.querySelector('.spotlight-card');

  if (filterButtons.length && blogCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const platform = this.getAttribute('data-filter');

        // Update active filter button
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter cards with smooth opacity transition
        blogCards.forEach(card => {
          const cardPlatform = card.getAttribute('data-platform');
          if (platform === 'all' || cardPlatform === platform) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.classList.add('is-hidden');
          }
        });

        // Spotlight card visibility
        if (spotlightCard) {
          const spotlightPlatform = spotlightCard.getAttribute('data-platform');
          if (platform === 'all' || spotlightPlatform === platform) {
            spotlightCard.classList.remove('is-hidden');
            spotlightCard.style.opacity = '1';
          } else {
            spotlightCard.classList.add('is-hidden');
          }
        }
      });
    });
  }

  // 2. Parallax mouse tilt on spotlight card (desktop only)
  if (spotlightCard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    spotlightCard.addEventListener('mousemove', function (e) {
      const rect = spotlightCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      spotlightCard.style.transform = `perspective(1000px) rotateY(${x * 0.015}deg) rotateX(${-y * 0.015}deg) translateY(-4px)`;
    });

    spotlightCard.addEventListener('mouseleave', function () {
      spotlightCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  }
});

