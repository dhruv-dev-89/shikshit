// Scholarship Animations - Custom animations for the scholarship page

// Function to initialize all scholarship animations
function initScholarshipAnimations() {
    console.log("Initializing scholarship animations");

    // Initialize all animations
    createFloatingScholarshipIcons();
    initScholarshipConfetti();
    initScholarshipProgress();
    initScholarshipCountdown();
    initEligibilityChecker();
    initScholarshipCardShimmer();
}

// Function to initialize scholarship animations without countdown
function initScholarshipAnimationsWithoutCountdown() {
    console.log("Initializing scholarship animations (without countdown)");

    // Initialize animations excluding countdown
    createFloatingScholarshipIcons();
    initScholarshipConfetti();
    initScholarshipProgress();
    // initScholarshipCountdown(); // REMOVED - No more "days left" animations
    initEligibilityChecker();
    initScholarshipCardShimmer();
}

// 1. Floating Scholarship Icons Animation
function createFloatingScholarshipIcons() {
    console.log("Creating floating scholarship icons");

    // Icons to float around the page
    const icons = [
        { icon: 'graduation-cap', color: '#7c3aed' },
        { icon: 'book-open', color: '#4f46e5' },
        { icon: 'academic-cap', color: '#8b5cf6' },
        { icon: 'cash', color: '#6366f1' },
        { icon: 'library', color: '#a78bfa' },
        { icon: 'pencil', color: '#c4b5fd' }
    ];

    // Create container for floating icons if it doesn't exist
    let floatingContainer = document.querySelector('.floating-scholarship-icons');
    if (!floatingContainer) {
        floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-scholarship-icons fixed inset-0 pointer-events-none z-0 overflow-hidden';
        document.body.appendChild(floatingContainer);
    }

    // Clear existing icons
    floatingContainer.innerHTML = '';

    // Create floating icons
    for (let i = 0; i < 15; i++) {
        const iconData = icons[Math.floor(Math.random() * icons.length)];
        const icon = document.createElement('div');

        // Random position and animation properties
        const size = Math.random() * 20 + 10; // 10-30px
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 5; // 0-5s delay
        const duration = Math.random() * 10 + 10; // 10-20s duration

        // Set icon styles
        icon.className = `absolute opacity-10 z-0 pointer-events-none`;
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        icon.style.left = `${left}%`;
        icon.style.top = '-50px';
        icon.style.color = iconData.color;
        icon.style.animation = `floatScholarshipIcon ${duration}s linear ${delay}s infinite`;

        // Set icon content based on type
        switch (iconData.icon) {
            case 'graduation-cap':
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>`;
                break;
            case 'book-open':
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>`;
                break;
            case 'academic-cap':
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path fill="#fff" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>`;
                break;
            case 'cash':
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>`;
                break;
            case 'library':
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>`;
                break;
            case 'pencil':
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>`;
                break;
        }

        // Add to container
        floatingContainer.appendChild(icon);
    }
}

// 2. Scholarship Confetti Effect
function initScholarshipConfetti() {
    console.log("Initializing scholarship confetti effect");

    // Get all scholarship cards
    const scholarshipCards = document.querySelectorAll('.scholarship-card');

    scholarshipCards.forEach(card => {
        // Create confetti container for this card
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container absolute inset-0 pointer-events-none overflow-hidden opacity-0 transition-opacity duration-500';
        card.style.position = 'relative';
        card.appendChild(confettiContainer);

        // Add event listeners
        card.addEventListener('mouseenter', () => {
            // Show confetti container
            confettiContainer.style.opacity = '1';

            // Create confetti particles
            createConfettiParticles(confettiContainer);
        });

        card.addEventListener('mouseleave', () => {
            // Hide confetti container
            confettiContainer.style.opacity = '0';

            // Clear confetti after animation completes
            setTimeout(() => {
                confettiContainer.innerHTML = '';
            }, 500);
        });
    });
}

// Helper function to create confetti particles
function createConfettiParticles(container) {
    // Clear existing particles
    container.innerHTML = '';

    // Confetti colors
    const colors = ['#7c3aed', '#4f46e5', '#6366f1', '#8b5cf6', '#c4b5fd', '#fcd34d', '#f59e0b'];

    // Create particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');

        // Random properties
        const size = Math.random() * 8 + 4; // 4-12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 0.5; // 0-0.5s delay
        const duration = Math.random() * 1 + 1; // 1-2s duration
        const rotation = Math.random() * 360; // 0-360deg

        // Set particle styles
        particle.className = 'absolute rounded-sm';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${left}%`;
        particle.style.top = '0';
        particle.style.transform = `rotate(${rotation}deg)`;
        particle.style.animation = `confettiDrop ${duration}s ease-in ${delay}s`;

        // Add to container
        container.appendChild(particle);
    }
}

// 3. Scholarship Application Progress Animation
function initScholarshipProgress() {
    console.log("Initializing scholarship progress animation");

    // Find the "How It Works" section
    const howItWorksSection = document.querySelector('.hero-section .lg\\:col-span-5');

    if (howItWorksSection) {
        // Find all step elements
        const steps = howItWorksSection.querySelectorAll('.flex.items-start.space-x-2');

        // Add animation classes
        steps.forEach((step, index) => {
            step.classList.add('scholarship-step');
            step.setAttribute('data-step', index + 1);

            // Add hover effect
            step.addEventListener('mouseenter', () => {
                // Highlight current step
                step.classList.add('scholarship-step-active');

                // Update progress
                updateScholarshipProgress(index + 1);

                // Special animations for specific steps
                if (index === 2) { // Step 3 - Upload Documents
                    const uploadAnimation = step.querySelector('.document-upload-animation');
                    if (uploadAnimation) {
                        uploadAnimation.classList.add('uploading');
                    }
                }

                if (index === 4) { // Step 5 - Verification
                    const statusAnimation = step.querySelector('.application-status');
                    if (statusAnimation) {
                        statusAnimation.classList.add('in-progress');
                        setTimeout(() => {
                            statusAnimation.classList.add('completed');
                        }, 1000);
                    }
                }

                if (index === 5) { // Step 6 - Disbursement
                    const awardAnimation = step.querySelector('.scholarship-award');
                    if (awardAnimation) {
                        awardAnimation.style.animation = 'celebrate 1s ease-in-out';
                    }
                }
            });

            step.addEventListener('mouseleave', () => {
                // Remove highlight
                step.classList.remove('scholarship-step-active');

                // Reset progress
                resetScholarshipProgress();

                // Reset special animations
                if (index === 2) { // Step 3 - Upload Documents
                    const uploadAnimation = step.querySelector('.document-upload-animation');
                    if (uploadAnimation) {
                        uploadAnimation.classList.remove('uploading');
                    }
                }

                if (index === 4) { // Step 5 - Verification
                    const statusAnimation = step.querySelector('.application-status');
                    if (statusAnimation) {
                        statusAnimation.classList.remove('in-progress', 'completed');
                    }
                }

                if (index === 5) { // Step 6 - Disbursement
                    const awardAnimation = step.querySelector('.scholarship-award');
                    if (awardAnimation) {
                        awardAnimation.style.animation = 'none';
                    }
                }
            });
        });
    }
}

// Helper function to update scholarship progress
function updateScholarshipProgress(currentStep) {
    const steps = document.querySelectorAll('.scholarship-step');

    steps.forEach((step, index) => {
        const stepNumber = index + 1;

        if (stepNumber < currentStep) {
            // Completed steps
            step.classList.add('scholarship-step-completed');
            step.classList.remove('scholarship-step-active', 'scholarship-step-upcoming');
        } else if (stepNumber === currentStep) {
            // Current step
            step.classList.add('scholarship-step-active');
            step.classList.remove('scholarship-step-completed', 'scholarship-step-upcoming');
        } else {
            // Upcoming steps
            step.classList.add('scholarship-step-upcoming');
            step.classList.remove('scholarship-step-completed', 'scholarship-step-active');
        }
    });
}

// Helper function to reset scholarship progress
function resetScholarshipProgress() {
    const steps = document.querySelectorAll('.scholarship-step');

    steps.forEach(step => {
        step.classList.remove('scholarship-step-completed', 'scholarship-step-active', 'scholarship-step-upcoming');
    });
}

// 4. Scholarship Countdown Timer Animation
function initScholarshipCountdown() {
    console.log("Initializing scholarship countdown timer");

    // Find all scholarship cards
    const scholarshipCards = document.querySelectorAll('.scholarship-card');

    scholarshipCards.forEach((card, index) => {
        // Create countdown container
        const countdownContainer = document.createElement('div');
        countdownContainer.className = 'countdown-container hidden absolute top-2 right-2 bg-indigo-100 rounded-lg px-2 py-1 text-xs font-medium text-indigo-800 z-20 transform transition-transform duration-300';

        // Set random deadline (for demo purposes)
        const days = 10 + (index * 5); // Different deadline for each card
        countdownContainer.innerHTML = `<span class="countdown-value">${days}</span> days left`;

        // Add to card
        card.appendChild(countdownContainer);

        // Show countdown on hover
        card.addEventListener('mouseenter', () => {
            countdownContainer.classList.remove('hidden');
            countdownContainer.classList.add('scale-in');

            // Animate countdown
            animateCountdown(countdownContainer.querySelector('.countdown-value'), days);
        });

        card.addEventListener('mouseleave', () => {
            countdownContainer.classList.add('hidden');
            countdownContainer.classList.remove('scale-in');
        });
    });
}

// Helper function to animate countdown
function animateCountdown(element, targetValue) {
    let currentValue = 0;
    const duration = 1000; // 1 second
    const increment = targetValue / (duration / 16); // 60fps

    // Clear any existing animation
    if (element.countdownInterval) {
        clearInterval(element.countdownInterval);
    }

    // Start animation
    element.countdownInterval = setInterval(() => {
        currentValue += increment;

        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(element.countdownInterval);
        }

        element.textContent = Math.floor(currentValue);
    }, 16);
}

// 5. Eligibility Checker Animation
function initEligibilityChecker() {
    console.log("Initializing eligibility checker animation");

    // Find scholarship cards
    const scholarshipCards = document.querySelectorAll('.scholarship-card');

    scholarshipCards.forEach(card => {
        // Find eligibility criteria list
        const eligibilityList = card.querySelector('ul');

        if (eligibilityList) {
            // Add animation class
            eligibilityList.classList.add('eligibility-list');

            // Find all criteria items
            const criteriaItems = eligibilityList.querySelectorAll('li');

            // Add animation to each item
            criteriaItems.forEach(item => {
                item.classList.add('eligibility-item');

                // Add checkmark animation on hover
                item.addEventListener('mouseenter', () => {
                    item.classList.add('eligibility-checking');

                    // Simulate checking (random result for demo)
                    setTimeout(() => {
                        item.classList.remove('eligibility-checking');

                        // Random eligibility result (for demo)
                        if (Math.random() > 0.3) {
                            item.classList.add('eligibility-met');
                            item.classList.remove('eligibility-not-met');
                        } else {
                            item.classList.add('eligibility-not-met');
                            item.classList.remove('eligibility-met');
                        }
                    }, 800);
                });

                // Reset on mouse leave
                item.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        item.classList.remove('eligibility-checking', 'eligibility-met', 'eligibility-not-met');
                    }, 500);
                });
            });
        }
    });
}

// 6. Scholarship Card Shimmer Effect
function initScholarshipCardShimmer() {
    console.log("Initializing scholarship card shimmer effect");

    // Find all scholarship cards
    const scholarshipCards = document.querySelectorAll('.scholarship-card');

    scholarshipCards.forEach(card => {
        // Create shimmer element
        const shimmer = document.createElement('div');
        shimmer.className = 'absolute inset-0 overflow-hidden opacity-0 pointer-events-none';

        // Create shimmer effect
        const shimmerEffect = document.createElement('div');
        shimmerEffect.className = 'absolute top-0 -left-3/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform skew-x-12';

        // Add to card
        shimmer.appendChild(shimmerEffect);
        card.appendChild(shimmer);

        // Add animation on hover
        card.addEventListener('mouseenter', () => {
            shimmer.style.opacity = '1';
            shimmerEffect.style.animation = 'shimmer 1.5s infinite';
        });

        card.addEventListener('mouseleave', () => {
            shimmer.style.opacity = '0';
            shimmerEffect.style.animation = 'none';
        });
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded in scholarship-animations.js");
    // Wait for a short delay to ensure all elements are loaded
    setTimeout(initScholarshipAnimationsWithoutCountdown, 500);
});

// Initialize animations when window is fully loaded
window.addEventListener('load', function() {
    console.log("Window Loaded in scholarship-animations.js");
    // Reinitialize animations to catch any dynamically loaded elements
    setTimeout(initScholarshipAnimationsWithoutCountdown, 1000);

    // Force apply animations to elements that might have been missed
    forceApplyAnimations();

    // Mobile-specific fix for 375px and smaller screens
    if (window.innerWidth <= 375) {
        setTimeout(forceMobileVisibility, 1500);
    }
});

// Function to force apply animations to elements
function forceApplyAnimations() {
    console.log("Force applying animations to elements");

    // Apply floating animation to elements with float-animation class
    document.querySelectorAll('.float-animation').forEach(el => {
        el.style.animation = 'floatUpDown 4s ease-in-out infinite';
    });

    // Apply float icon animation to elements with animate-float class
    document.querySelectorAll('.animate-float').forEach(el => {
        el.style.animation = 'floatIcon 3s ease-in-out infinite';
    });

    // Apply card glow effect to elements with card-glow-effect class
    document.querySelectorAll('.card-glow-effect').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'cardGlow 2s ease-in-out infinite';
        });
        el.addEventListener('mouseleave', () => {
            el.style.animation = 'none';
        });
    });

    // Apply slide-in animations
    document.querySelectorAll('.slide-in-left').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }
    });

    document.querySelectorAll('.slide-in-right').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }
    });

    document.querySelectorAll('.slide-in-up').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });

    // Apply animation to scholarship cards
    document.querySelectorAll('.scholarship-card').forEach((card, index) => {
        card.classList.add('scholarship-card-animated');
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Mobile-specific function to force visibility on small screens
function forceMobileVisibility() {
    console.log("Forcing mobile visibility for 375px screens");

    // Disable all background animations on mobile
    if (window.innerWidth <= 767) {
        // Stop all blob animations
        document.querySelectorAll('.animate-blob, .animate-blob-morph').forEach(el => {
            el.style.animation = 'none';
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        });

        // Stop all floating elements
        document.querySelectorAll('.floating-element, .floating-scholarship-icons').forEach(el => {
            el.style.animation = 'none';
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        });

        // Stop all gradient animations
        document.querySelectorAll('.gradient-shift, .pulse-glow').forEach(el => {
            el.style.animation = 'none';
            el.style.background = 'transparent';
        });

        // Remove all absolute positioned background elements
        document.querySelectorAll('.hero-section .absolute').forEach(el => {
            if (!el.querySelector('h1, h2, h3, p, button, a, input, video')) {
                el.style.display = 'none';
            }
        });
    }

    // Force all hero section content to be visible
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // Force main containers to be visible
        const containers = heroSection.querySelectorAll('.container, .max-w-7xl, .relative.z-20, .lg\\:col-span-7, .lg\\:col-span-5');
        containers.forEach(container => {
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            container.style.position = 'relative';
            container.style.zIndex = '20';
        });

        // Force all text elements to be visible
        const textElements = heroSection.querySelectorAll('h1, h2, h3, p, span, a, button');
        textElements.forEach(element => {
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.position = 'relative';
            element.style.zIndex = '25';
        });

        // Force slide-in elements to be visible immediately
        const slideElements = heroSection.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
        slideElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.animation = 'none';
            element.style.visibility = 'visible';
            element.style.display = 'block';
            element.style.position = 'relative';
            element.style.zIndex = '25';
        });

        // Force grid layouts to work
        const grids = heroSection.querySelectorAll('.grid');
        grids.forEach(grid => {
            grid.style.display = 'flex';
            grid.style.flexDirection = 'column';
            grid.style.gap = '1.5rem';
            grid.style.visibility = 'visible';
            grid.style.opacity = '1';
        });

        // Force video section to be visible
        const videoSection = heroSection.querySelector('#video-section, .video-enhanced-container');
        if (videoSection) {
            videoSection.style.display = 'block';
            videoSection.style.visibility = 'visible';
            videoSection.style.opacity = '1';
            videoSection.style.position = 'relative';
            videoSection.style.zIndex = '25';
        }

        // Force "How It Works" section to be visible
        const howItWorks = heroSection.querySelector('.relative.bg-white\\/10.backdrop-blur-sm.rounded-xl');
        if (howItWorks) {
            howItWorks.style.display = 'block';
            howItWorks.style.visibility = 'visible';
            howItWorks.style.opacity = '1';
            howItWorks.style.position = 'relative';
            howItWorks.style.zIndex = '25';
        }

        // Force buttons to be visible
        const buttons = heroSection.querySelectorAll('a, button');
        buttons.forEach(button => {
            button.style.display = 'inline-block';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
            button.style.position = 'relative';
            button.style.zIndex = '25';
        });

        console.log("Mobile visibility forced for all hero section elements");
    }
}

// Add resize event listener to handle screen size changes
window.addEventListener('resize', function() {
    if (window.innerWidth <= 375) {
        setTimeout(forceMobileVisibility, 100);
    }
});

// Add orientation change listener for mobile devices
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        if (window.innerWidth <= 375) {
            forceMobileVisibility();
        }
    }, 500);
});
