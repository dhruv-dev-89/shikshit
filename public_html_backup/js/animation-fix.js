/**
 * Animation Fix Script
 * This script ensures that animations are properly applied to elements
 * even if the main animation scripts fail to load or execute.
 */

// Execute immediately when script loads
(function() {
    console.log("Animation fix script loaded");
    
    // Apply animations immediately
    applyAnimationFixes();
    
    // Also apply on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', applyAnimationFixes);
    
    // And on window load
    window.addEventListener('load', applyAnimationFixes);
    
    // Apply animations after a delay to catch any dynamically loaded elements
    setTimeout(applyAnimationFixes, 1000);
    setTimeout(applyAnimationFixes, 2000);
})();

/**
 * Apply animation fixes to elements
 */
function applyAnimationFixes() {
    console.log("Applying animation fixes");
    
    // Fix floating animations
    document.querySelectorAll('.float-animation').forEach(el => {
        el.style.animation = 'floatUpDown 4s ease-in-out infinite';
    });
    
    // Fix float icon animations
    document.querySelectorAll('.animate-float').forEach(el => {
        el.style.animation = 'floatIcon 3s ease-in-out infinite';
    });
    
    // Fix card glow effects
    document.querySelectorAll('.card-glow-effect').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'cardGlow 2s ease-in-out infinite';
        });
        el.addEventListener('mouseleave', () => {
            el.style.animation = 'none';
        });
    });
    
    // Fix slide-in animations
    fixSlideAnimations();
    
    // Fix scholarship cards
    document.querySelectorAll('.scholarship-card').forEach((card, index) => {
        // Add animation class
        card.classList.add('scholarship-card-animated');
        
        // Set animation delay based on index
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Ensure hover effects work
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Fix blob animations
    document.querySelectorAll('.animate-blob').forEach(el => {
        el.style.animation = 'blob 7s infinite';
    });
    
    // Fix bounce animations
    document.querySelectorAll('.animate-bounce').forEach(el => {
        el.style.animation = 'bounce 1.5s infinite';
    });
    
    // Fix fade-in animations
    document.querySelectorAll('.animate-fadeIn').forEach(el => {
        el.style.animation = 'fadeIn 1s ease-out forwards';
    });
    
    // Fix spin animations
    document.querySelectorAll('.animate-spin-slow').forEach(el => {
        el.style.animation = 'spin 15s linear infinite';
    });
}

/**
 * Fix slide-in animations
 */
function fixSlideAnimations() {
    // Fix slide-in-left animations
    document.querySelectorAll('.slide-in-left').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }
    });
    
    // Fix slide-in-right animations
    document.querySelectorAll('.slide-in-right').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }
    });
    
    // Fix slide-in-up animations
    document.querySelectorAll('.slide-in-up').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}
