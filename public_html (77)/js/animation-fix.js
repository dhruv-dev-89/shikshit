/**
 * Animation Fix Script
 * Ensures motion and reveals apply smoothly and respect prefers-reduced-motion.
 */
(function() {
    'use strict';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function applyAnimationFixes() {
        if (prefersReducedMotion) {
            // Under reduced motion, make all elements immediately visible without animation
            document.querySelectorAll('.scholarship-card, .float-animation, .animate-float, .slide-in-left, .slide-in-right, .slide-in-up, .animate-fadeIn').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
            return;
        }

        // Apply smooth floating animations
        document.querySelectorAll('.float-animation').forEach(el => {
            if (!el.dataset.animFloat) {
                el.dataset.animFloat = 'true';
                el.style.animation = 'floatUpDown 4s ease-in-out infinite';
            }
        });

        document.querySelectorAll('.animate-float').forEach(el => {
            if (!el.dataset.animFloatIcon) {
                el.dataset.animFloatIcon = 'true';
                el.style.animation = 'floatIcon 3s ease-in-out infinite';
            }
        });

        // Scholarship cards smooth reveal and hover
        document.querySelectorAll('.scholarship-card').forEach((card, index) => {
            if (!card.classList.contains('scholarship-card-animated')) {
                card.classList.add('scholarship-card-animated');
                card.style.animationDelay = (index * 0.08) + 's';
            }
            if (!card.dataset.hoverBound) {
                card.dataset.hoverBound = 'true';
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-6px)';
                    card.style.boxShadow = '0 16px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '';
                });
            }
        });

        // Slide animations
        document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAnimationFixes);
    } else {
        applyAnimationFixes();
    }
    window.addEventListener('load', applyAnimationFixes);
})();
