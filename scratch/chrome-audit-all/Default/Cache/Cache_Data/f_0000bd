// Script for Scholarship Portal

// Function to include HTML components
function includeHTML() {
    console.log("includeHTML function called");
    const elements = document.getElementsByTagName("*");
    let pendingIncludes = 0;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const file = element.getAttribute("include-html");

        if (file) {
            console.log(`Found include-html element for file: ${file}`);
            pendingIncludes++;
            fetch(file)
                .then(response => {
                    if (response.ok) {
                        console.log(`Successfully fetched: ${file}`);
                        return response.text();
                    }
                    throw new Error(`Network response was not ok for: ${file}`);
                })
                .then(data => {
                    console.log(`Processing content for: ${file}`);
                    element.innerHTML = data;
                    element.removeAttribute("include-html");

                    // Initialize navbar functionality if this was the navbar
                    if (file === "navbar.html") {
                        console.log("Navbar included, initializing mobile menu");
                        // Let the navbar initialize itself through its own script
                        // The global toggleMobileMenu function will be available
                    }

                    // Continue including nested components
                    includeHTML();

                    // Decrease pending includes counter
                    pendingIncludes--;

                    // If no more pending includes, dispatch event
                    if (pendingIncludes === 0) {
                        console.log("All HTML components loaded");
                        // Dispatch a custom event when all includes are complete
                        document.dispatchEvent(new CustomEvent('includeHTML:complete'));
                    }
                })
                .catch(error => {
                    console.error(`Error loading component: ${file}`, error);
                    element.innerHTML = `<div style="padding: 20px; color: red; border: 1px solid red;">Error loading ${file}</div>`;

                    // Decrease pending includes counter even on error
                    pendingIncludes--;

                    // If no more pending includes, dispatch event
                    if (pendingIncludes === 0) {
                        console.log("All HTML components loaded (with some errors)");
                        document.dispatchEvent(new CustomEvent('includeHTML:complete'));
                    }
                });
            return;
        }
    }

    // If no includes were found, dispatch the event immediately
    if (pendingIncludes === 0) {
        console.log("No HTML components to load");
        document.dispatchEvent(new CustomEvent('includeHTML:complete'));
    }
}

// Function to initialize mobile menu functionality
function initializeMobileMenu() {
    console.log("Initializing mobile menu from script.js");

    // Prevent multiple initializations
    if (window.mobileMenuInitialized) {
        console.log("Mobile menu already initialized, skipping");
        return;
    }

    // Find mobile menu elements with multiple fallbacks
    const mobileMenuButton = document.getElementById('mobile-menu-button') ||
                            document.getElementById('mobile-menu-toggle') ||
                            document.querySelector('.mobile-menu-button') ||
                            document.querySelector('[aria-label="Toggle mobile menu"]');

    const mobileMenu = document.getElementById('mobile-menu') ||
                      document.getElementById('mobileMenu') ||
                      document.querySelector('.mobile-menu');

    if (!mobileMenuButton || !mobileMenu) {
        console.log("Mobile menu elements not found, will retry later");
        return;
    }

    console.log("Mobile menu elements found, setting up functionality");

    // Function to toggle mobile menu
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log("Mobile menu toggle called");

        // Check current state
        const isHidden = mobileMenu.classList.contains('hidden') ||
                        mobileMenu.style.display === 'none' ||
                        !mobileMenu.offsetHeight;

        if (isHidden) {
            // Show menu
            mobileMenu.classList.remove('hidden');
            mobileMenu.style.display = 'block';
            mobileMenu.style.visibility = 'visible';
            mobileMenu.style.opacity = '1';

            // Toggle icons if they exist
            const menuOpenIcon = document.getElementById('menu-open-icon');
            const menuCloseIcon = document.getElementById('menu-close-icon');
            if (menuOpenIcon && menuCloseIcon) {
                menuOpenIcon.classList.add('hidden');
                menuCloseIcon.classList.remove('hidden');
            }

            // Update aria-expanded
            mobileMenuButton.setAttribute('aria-expanded', 'true');

            // Disable body scrolling
            document.body.style.overflow = 'hidden';

            console.log("Mobile menu opened");
        } else {
            // Hide menu
            mobileMenu.classList.add('hidden');
            mobileMenu.style.display = 'none';
            mobileMenu.style.visibility = 'hidden';
            mobileMenu.style.opacity = '0';

            // Toggle icons if they exist
            const menuOpenIcon = document.getElementById('menu-open-icon');
            const menuCloseIcon = document.getElementById('menu-close-icon');
            if (menuOpenIcon && menuCloseIcon) {
                menuOpenIcon.classList.remove('hidden');
                menuCloseIcon.classList.add('hidden');
            }

            // Update aria-expanded
            mobileMenuButton.setAttribute('aria-expanded', 'false');

            // Enable body scrolling
            document.body.style.overflow = '';

            console.log("Mobile menu closed");
        }
    }

    // Remove any existing event listeners to avoid duplicates
    const newMobileMenuButton = mobileMenuButton.cloneNode(true);
    mobileMenuButton.parentNode.replaceChild(newMobileMenuButton, mobileMenuButton);

    // Add event listeners
    newMobileMenuButton.addEventListener('click', toggleMobileMenu);
    newMobileMenuButton.addEventListener('touchstart', toggleMobileMenu, { passive: false });

    // Make toggle function globally available
    window.toggleMobileMenu = toggleMobileMenu;

    // Close menu when clicking on navigation links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log("Navigation link clicked, closing menu");
            mobileMenu.classList.add('hidden');
            mobileMenu.style.display = 'none';
            document.body.style.overflow = '';

            const menuOpenIcon = document.getElementById('menu-open-icon');
            const menuCloseIcon = document.getElementById('menu-close-icon');
            if (menuOpenIcon && menuCloseIcon) {
                menuOpenIcon.classList.remove('hidden');
                menuCloseIcon.classList.add('hidden');
            }
            newMobileMenuButton.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!newMobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        }
    });

    // Mark as initialized
    window.mobileMenuInitialized = true;
    console.log("Mobile menu successfully initialized!");
}

// Form validation for the "Book a Live Class" form
function validateForm(event) {
    const form = event.target.closest('form');
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const mobile = form.querySelector('input[name="mobile"]').value;

    if (!name || !email || !mobile) {
        alert("Please fill in all required fields");
        event.preventDefault();
        return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        event.preventDefault();
        return false;
    }

    // Simple mobile validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number");
        event.preventDefault();
        return false;
    }

    return true;
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster

    // Format numbers with commas for thousands
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = Math.ceil(target / speed);
        let currentCount = 0;
        let animationFrame;
        let isAnimating = false;

        // Create a more dynamic animation with easing
        const updateCount = () => {
            if (currentCount < target) {
                // Calculate the next value with easing for smoother animation
                const remaining = target - currentCount;
                // Use a dynamic increment that slows down as it approaches the target
                const easingFactor = Math.max(0.1, Math.min(1, remaining / target));
                const nextIncrement = Math.max(1, Math.ceil(increment * easingFactor * 2));

                currentCount += Math.min(nextIncrement, remaining);
                counter.innerText = formatNumber(currentCount);

                // Continue animation
                animationFrame = requestAnimationFrame(updateCount);
            } else {
                counter.innerText = formatNumber(target);
                isAnimating = false;

                // Add highlight effect when counter reaches target
                const counterWrapper = counter.closest('.counter-wrapper');
                if (counterWrapper) {
                    const highlight = counterWrapper.querySelector('.counter-highlight');
                    if (highlight) {
                        highlight.classList.add('animate-pulse-once');
                        setTimeout(() => {
                            highlight.classList.remove('animate-pulse-once');
                        }, 1000);
                    }
                }
            }
        };

        // Start or reset animation
        const startAnimation = () => {
            if (isAnimating) {
                cancelAnimationFrame(animationFrame);
            }

            // Reset counter for re-animation
            currentCount = 0;
            counter.innerText = "0";
            isAnimating = true;

            // Add visual feedback when animation starts
            const suffix = counter.nextElementSibling;
            if (suffix && suffix.classList.contains('counter-suffix')) {
                suffix.classList.add('animate-bounce');
                setTimeout(() => {
                    suffix.classList.remove('animate-bounce');
                }, 1000);
            }

            // Start the animation
            requestAnimationFrame(updateCount);
        };

        // Create an intersection observer that triggers animation when scrolling in and out of view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Animate when entering viewport
                if (entry.isIntersecting) {
                    startAnimation();

                    // Add highlight effect to the counter wrapper
                    const counterWrapper = counter.closest('.counter-wrapper');
                    if (counterWrapper) {
                        const highlight = counterWrapper.querySelector('.counter-highlight');
                        if (highlight) {
                            highlight.style.opacity = '0.2';
                            setTimeout(() => {
                                highlight.style.opacity = '0';
                            }, 1500);
                        }
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-10% 0px -10% 0px' // Trigger slightly before element is fully visible
        });

        observer.observe(counter);
    });
}

// Add hover effects to stat cards
function addStatCardEffects() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add a subtle pulse animation
            card.classList.add('animate-pulse-light');

            // Add a glow effect to the card
            card.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.3)';

            // Find the counter wrapper and add effects
            const counterWrapper = card.querySelector('.counter-wrapper');
            if (counterWrapper) {
                // Make counter slightly larger with a smooth transition
                counterWrapper.classList.add('scale-110');
                counterWrapper.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                // Show the highlight behind the counter
                const highlight = counterWrapper.querySelector('.counter-highlight');
                if (highlight) {
                    highlight.style.opacity = '0.2';
                }
            }

            // Add rotation to the icon
            const iconContainer = card.querySelector('.bg-purple-100, .bg-indigo-100');
            if (iconContainer) {
                iconContainer.style.transform = 'rotate(12deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            // Remove all effects when mouse leaves
            card.classList.remove('animate-pulse-light');
            card.style.boxShadow = '';

            const counterWrapper = card.querySelector('.counter-wrapper');
            if (counterWrapper) {
                counterWrapper.classList.remove('scale-110');

                const highlight = counterWrapper.querySelector('.counter-highlight');
                if (highlight) {
                    highlight.style.opacity = '0';
                }
            }

            // Reset icon rotation
            const iconContainer = card.querySelector('.bg-purple-100, .bg-indigo-100');
            if (iconContainer) {
                iconContainer.style.transform = '';
            }
        });

        // Add click effect for mobile users
        card.addEventListener('click', () => {
            // Trigger a quick animation to show feedback
            const counterValue = card.querySelector('.counter-value');
            if (counterValue) {
                // Add a quick pulse effect
                counterValue.classList.add('animate-ping-once');
                setTimeout(() => {
                    counterValue.classList.remove('animate-ping-once');
                }, 700);
            }
        });
    });
}

// Function to handle the Popular Courses section scrolling and animations
function initializePopularCoursesSection() {
    const coursesContainer = document.querySelector('.lg\\:col-span-7.space-y-8.overflow-y-auto');
    if (!coursesContainer) return;

    // Add scroll animation to course cards
    const courseCards = document.querySelectorAll('.lg\\:col-span-7 .bg-white.rounded-xl');

    // Create an intersection observer for course cards
    const courseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add animation when card enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                // Ensure card is visible
                entry.target.style.opacity = '1';

                // Add a slight delay for staggered animation effect
                const index = Array.from(courseCards).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            } else {
                // Ensure card remains visible even when not in viewport
                entry.target.style.opacity = '1';
            }
        });
    }, {
        root: coursesContainer,
        threshold: 0.3,
        rootMargin: '0px'
    });

    // Observe each course card
    courseCards.forEach(card => {
        courseObserver.observe(card);

        // Add hover effect for course cards
        card.addEventListener('mouseenter', () => {
            // Ensure card is visible
            card.style.opacity = '1';

            // Find the icon container and add rotation effect
            const iconContainer = card.querySelector('.rounded-full');
            if (iconContainer) {
                iconContainer.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            // Ensure card remains visible
            card.style.opacity = '1';

            // Reset icon container effects
            const iconContainer = card.querySelector('.rounded-full');
            if (iconContainer) {
                iconContainer.style.transform = '';
            }
        });
    });

    // Add scroll indicator for the courses container
    let isScrolling = false;
    let scrollTimeout;

    coursesContainer.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            coursesContainer.classList.add('scrolling');
        }

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            coursesContainer.classList.remove('scrolling');
        }, 300);
    });

    // Add animation to the right side image
    const courseImage = document.querySelector('.lg\\:col-span-5 .relative.h-80 img');
    if (courseImage) {
        // Create an intersection observer for the image
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a subtle zoom effect when the image comes into view
                    courseImage.style.transform = 'scale(1.05)';
                    courseImage.style.transition = 'transform 1.5s ease-out';

                    // Reset after animation completes
                    setTimeout(() => {
                        courseImage.style.transform = 'scale(1)';
                        courseImage.style.transition = 'transform 0.8s ease-in-out';
                    }, 1500);
                }
            });
        }, {
            threshold: 0.7
        });

        imageObserver.observe(courseImage.parentElement);
    }
}



// Function to create particle effects - exposed globally
window.createParticleEffect = function(container) {
    if (!container) return;

    const colors = ['#7c3aed', '#4f46e5', '#6366f1', '#8b5cf6', '#c4b5fd'];
    const particleCount = 20;

    // Clear any existing particles
    const existingParticles = container.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());

    // Create new particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Random movement direction
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;

        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animationDelay = `${Math.random() * 2}s`;

        container.appendChild(particle);
    }
}

// Function to create typing animation effect - exposed globally
window.initTypewriterEffect = function(element, texts, speed = 100) {
    if (!element) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            // Deleting text
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing text
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        // Add typing cursor animation
        element.classList.add('typing-animation');

        // Determine typing speed (faster when deleting)
        let typeSpeed = isDeleting ? speed / 2 : speed;

        // If complete word is typed
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of word
            typeSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            // Pause before starting new word
            typeSpeed = 500;
        }

        // Continue typing
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(type, typeSpeed);
    }

    // Start the typing animation
    type();
}

// Function to initialize enhanced FAQ accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSearchInput = document.querySelector('input[placeholder="Search for questions..."]');
    const faqCategoryButtons = document.querySelectorAll('button[class*="rounded-full"]');

    // Function to toggle FAQ item
    function toggleFaq(item, forceOpen = false) {
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        const isActive = item.classList.contains('faq-active');

        // If forcing open or toggling closed -> open
        if (forceOpen || !isActive) {
            // Close all other FAQs first
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('faq-active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    otherContent.style.maxHeight = '0';
                    if (otherIcon) otherIcon.style.transform = '';
                }
            });

            // Open this FAQ
            item.classList.add('faq-active');
            content.style.maxHeight = content.scrollHeight + 'px';
            if (icon) icon.style.transform = 'rotate(180deg)';

            // Add highlight animation
            item.classList.add('shadow-lg');
            setTimeout(() => {
                item.classList.remove('shadow-lg');
            }, 500);
        } else {
            // Close this FAQ
            item.classList.remove('faq-active');
            content.style.maxHeight = '0';
            if (icon) icon.style.transform = '';
        }
    }

    // Set up click handlers for each FAQ item
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            toggleFaq(item);
        });

        // Add hover effect
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('faq-active')) {
                item.classList.add('shadow-md');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('faq-active')) {
                item.classList.remove('shadow-md');
            }
        });
    });

    // Set up search functionality
    if (faqSearchInput) {
        faqSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            faqItems.forEach(item => {
                const question = item.querySelector('h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-content').textContent.toLowerCase();

                // Check if question or answer contains the search term
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';

                    // Highlight matching text if there's a search term
                    if (searchTerm.length > 2) {
                        // Open the FAQ that matches the search
                        toggleFaq(item, true);
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            // If search is cleared, reset display
            if (searchTerm === '') {
                faqItems.forEach(item => {
                    item.style.display = 'block';
                });
            }
        });
    }

    // Set up category filter buttons
    if (faqCategoryButtons.length > 0) {
        faqCategoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                faqCategoryButtons.forEach(btn => {
                    btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-indigo-600', 'text-white');
                    btn.classList.add('bg-white', 'text-indigo-700');
                });

                // Add active class to clicked button
                button.classList.remove('bg-white', 'text-indigo-700');
                button.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-indigo-600', 'text-white');

                // For now, just show all FAQs when any category is clicked
                // In a real implementation, you would filter based on categories
                faqItems.forEach(item => {
                    item.style.display = 'block';
                });
            });
        });
    }

    // Open the first FAQ by default with a slight delay for animation
    setTimeout(() => {
        if (faqItems.length > 0) {
            toggleFaq(faqItems[0], true);
        }
    }, 1000);
}

// Initialize components when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM content loaded - initializing components");

    // Include HTML components
    try {
        includeHTML();
        console.log("includeHTML called from DOMContentLoaded");
    } catch (error) {
        console.error("Error calling includeHTML:", error);
    }

    // Initialize mobile menu after HTML components are loaded
    document.addEventListener('includeHTML:complete', function() {
        console.log("HTML components loaded, initializing mobile menu");
        setTimeout(() => {
            initializeMobileMenu();
        }, 100);
    });

    // Also listen for navbar loaded event
    document.addEventListener('navbar:loaded', function() {
        console.log("Navbar loaded, initializing mobile menu");
        setTimeout(() => {
            initializeMobileMenu();
        }, 50);
    });

    // Add event listener to the form submit button
    const bookingButton = document.getElementById("booking-button");
    if (bookingButton) {
        bookingButton.addEventListener("click", validateForm);
    }
});

// Make includeHTML available globally
window.includeHTML = includeHTML;

// Also initialize when window is fully loaded
window.addEventListener('load', function() {
    console.log("Window loaded, ensuring mobile menu is initialized");
    // Try to initialize mobile menu if not already done
    setTimeout(() => {
        if (!window.mobileMenuInitialized) {
            initializeMobileMenu();
        }
    }, 500);

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize counter animations when DOM is loaded
    setTimeout(() => {
        animateCounters();
        addStatCardEffects();
        initializePopularCoursesSection();

        // Initialize FAQ accordion
        initFaqAccordion();

        // Initialize particle effects for hero section
        const heroParticleContainer = document.querySelector('.hero-particle-container');
        if (heroParticleContainer) {
            createParticleEffect(heroParticleContainer);

            // Recreate particles periodically for continuous effect
            setInterval(() => {
                createParticleEffect(heroParticleContainer);
            }, 6000);
        }

        // Initialize typewriter effect
        const typewriterElement = document.querySelector('.typewriter-text');
        if (typewriterElement) {
            initTypewriterEffect(
                typewriterElement,
                ['Scholarships', 'Academic Support', 'Financial Aid', 'Educational Guidance'],
                100
            );
        }
    }, 500);
});