// Become a Member Page Animations JavaScript

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBecomeAMemberAnimations();
});

// Main initialization function
function initBecomeAMemberAnimations() {
    console.log("Initializing Become a Member animations");
    
    // Initialize all animation components
    initFloatingScholarshipIcons();
    initMembershipCardAnimations();
    initFormAnimations();
    initScrollAnimations();
    initVideoAnimations();
    initAdvisoryBoardAnimations();
    initBenefitCardAnimations();
    initStaggerAnimations();
    
    // Initialize intersection observer for scroll-triggered animations
    initIntersectionObserver();
}

// 1. Enhanced Floating Scholarship Icons
function initFloatingScholarshipIcons() {
    console.log("Initializing floating scholarship icons");
    
    const icons = document.querySelectorAll('.scholarship-icon');
    
    icons.forEach((icon, index) => {
        // Add random delay to make animations more natural
        const delay = Math.random() * 2;
        icon.style.animationDelay = `${delay}s`;
        
        // Add hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.animationPlayState = 'paused';
            icon.style.transform = 'scale(1.5)';
            icon.style.opacity = '0.3';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.animationPlayState = 'running';
            icon.style.transform = '';
            icon.style.opacity = '';
        });
    });
}

// 2. Membership Card Animations
function initMembershipCardAnimations() {
    console.log("Initializing membership card animations");
    
    const membershipCards = document.querySelectorAll('.membership-card');
    
    membershipCards.forEach((card, index) => {
        // Add stagger effect
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('stagger-animation');
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            // Add glow effect to icon
            const icon = card.querySelector('svg');
            if (icon) {
                icon.classList.add('scholarship-icon-pulse');
            }
            
            // Add subtle shake to price
            const price = card.querySelector('.text-3xl');
            if (price) {
                price.style.animation = 'scholarshipPulse 0.5s ease-in-out';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('svg');
            if (icon) {
                icon.classList.remove('scholarship-icon-pulse');
            }
            
            const price = card.querySelector('.text-3xl');
            if (price) {
                price.style.animation = '';
            }
        });
        
        // Add click animation
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// 3. Form Animations
function initFormAnimations() {
    console.log("Initializing form animations");
    
    const formInputs = document.querySelectorAll('input, textarea, select');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Animate form inputs
    formInputs.forEach((input, index) => {
        input.classList.add('form-input-animated');
        
        // Add focus animations
        input.addEventListener('focus', () => {
            input.style.borderColor = '#7c3aed';
            input.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
        
        // Add typing animation
        input.addEventListener('input', () => {
            input.style.transform = 'scale(1.02)';
            setTimeout(() => {
                input.style.transform = '';
            }, 100);
        });
    });
    
    // Animate submit button
    if (submitButton) {
        submitButton.classList.add('btn-animated');
        
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add loading animation
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;
            
            // Simulate form submission
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                showSuccessMessage();
            }, 2000);
        });
    }
}

// 4. Scroll Animations
function initScrollAnimations() {
    console.log("Initializing scroll animations");
    
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        section.classList.add('section-reveal');
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// 5. Video Animations
function initVideoAnimations() {
    console.log("Initializing video animations");
    
    const videoContainer = document.querySelector('.video-container, [style*="aspect-ratio"]');
    const video = document.querySelector('video');
    
    if (videoContainer) {
        videoContainer.classList.add('video-container');
        
        // Add hover effects
        videoContainer.addEventListener('mouseenter', () => {
            if (video) {
                video.style.transform = 'scale(1.05)';
            }
        });
        
        videoContainer.addEventListener('mouseleave', () => {
            if (video) {
                video.style.transform = '';
            }
        });
    }
    
    // Ensure video autoplays properly
    if (video) {
        video.addEventListener('loadeddata', () => {
            video.play().catch(e => {
                console.log("Video autoplay prevented:", e);
            });
        });
    }
}

// 6. Advisory Board Animations
function initAdvisoryBoardAnimations() {
    console.log("Initializing advisory board animations");
    
    const advisoryCards = document.querySelectorAll('.advisory-card, .bg-white.rounded-2xl.p-6');
    
    advisoryCards.forEach((card, index) => {
        card.classList.add('advisory-card', 'stagger-animation');
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add image load animation
        const img = card.querySelector('img');
        if (img) {
            img.classList.add('image-load');
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            const name = card.querySelector('h3');
            if (name) {
                name.style.color = '#7c3aed';
                name.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const name = card.querySelector('h3');
            if (name) {
                name.style.color = '';
                name.style.transform = '';
            }
        });
    });
}

// 7. Benefit Card Animations
function initBenefitCardAnimations() {
    console.log("Initializing benefit card animations");
    
    const benefitCards = document.querySelectorAll('.benefit-card, .grid.grid-cols-2 > div');
    
    benefitCards.forEach((card, index) => {
        card.classList.add('benefit-card', 'stagger-animation');
        card.style.animationDelay = `${index * 0.15}s`;
        
        // Add icon rotation on hover
        const icon = card.querySelector('svg');
        if (icon) {
            icon.classList.add('icon-rotate');
        }
        
        // Add glow effect
        card.addEventListener('mouseenter', () => {
            card.classList.add('glow-effect');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('glow-effect');
        });
    });
}

// 8. Stagger Animations
function initStaggerAnimations() {
    console.log("Initializing stagger animations");
    
    // Apply stagger animation to various elements
    const staggerElements = document.querySelectorAll('.membership-card, .advisory-card, .benefit-card');
    
    staggerElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('stagger-animation');
    });
}

// 9. Intersection Observer for Scroll-triggered Animations
function initIntersectionObserver() {
    console.log("Initializing intersection observer");
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add specific animations based on element type
                if (entry.target.classList.contains('membership-card')) {
                    entry.target.style.animation = 'staggerFadeIn 0.6s ease forwards';
                }
                
                if (entry.target.classList.contains('advisory-card')) {
                    entry.target.style.animation = 'staggerFadeIn 0.6s ease forwards';
                }
                
                if (entry.target.classList.contains('benefit-card')) {
                    entry.target.style.animation = 'staggerFadeIn 0.6s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.membership-card, .advisory-card, .benefit-card, section');
    animatedElements.forEach(el => observer.observe(el));
}

// 10. Success Message Animation
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Application submitted successfully!
            </div>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Animate in
    setTimeout(() => {
        successMessage.firstElementChild.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        successMessage.firstElementChild.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 300);
    }, 3000);
}

// 11. Mobile-specific Optimizations
function initMobileOptimizations() {
    if (window.innerWidth <= 768) {
        console.log("Applying mobile optimizations");
        
        // Reduce animation intensity on mobile
        const style = document.createElement('style');
        style.textContent = `
            .membership-card:hover {
                transform: translateY(-5px) scale(1.01) !important;
            }
            .advisory-card:hover {
                transform: translateY(-3px) scale(1.005) !important;
            }
            .benefit-card:hover {
                transform: translateY(-3px) scale(1.005) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize mobile optimizations
window.addEventListener('load', initMobileOptimizations);

// Re-initialize on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        initMobileOptimizations();
    }
});

// Export functions for external use
window.becomeAMemberAnimations = {
    init: initBecomeAMemberAnimations,
    showSuccess: showSuccessMessage
};
