/**
 * Shikshit Blogs Page Interactive Motion & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Parallax mouse tilt on spotlight card (desktop only)
  const spotlightCard = document.querySelector('.spotlight-card');
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
