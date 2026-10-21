// Function to handle mobile viewport height issues
        function fixMobileViewportHeight() {
            // First we get the viewport height and multiply it by 1% to get a value for a vh unit
            let vh = window.innerHeight * 0.01;
            // Then we set the value in the --vh custom property to the root of the document
            document.documentElement.style.setProperty('--vh', `${vh}px`);

            // Apply the height to elements that need it
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                // For all devices, use auto height with min-height to ensure content is visible
                heroSection.style.height = 'auto';
                heroSection.style.minHeight = `calc(var(--vh, 1vh) * 100)`;

                // Remove any max-height constraints
                heroSection.style.maxHeight = 'none';

                // Ensure the content is visible by setting overflow to visible
                heroSection.style.overflow = 'visible';

                // Special handling for iOS
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

                if (isIOS) {
                    heroSection.style.minHeight = '-webkit-fill-available';
                    heroSection.style.height = 'auto';
                }
            }

            // Fix form container height on mobile
            const formContainer = document.querySelector('.scholarship-form-container');
            if (formContainer) {
                formContainer.style.maxHeight = 'none';
                formContainer.style.height = 'auto';
                formContainer.style.overflow = 'visible';
            }

            // Fix the hero section container
            const heroContainer = document.querySelector('.hero-section > div');
            if (heroContainer) {
                heroContainer.style.minHeight = `calc(var(--vh, 1vh) * 100)`;
                heroContainer.style.paddingTop = '1rem';
                heroContainer.style.paddingBottom = '2rem';

                // Special handling for iOS
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

                if (isIOS) {
                    heroContainer.style.minHeight = '-webkit-fill-available';
                }
            }

            // Fix scholarship section on mobile
            if (window.innerWidth <= 640) {
                // Fix scholarship navigation
                const scholarshipNav = document.querySelector('.academic-levels-section .scholarship-nav');
                if (scholarshipNav) {
                    scholarshipNav.style.display = 'flex';
                    scholarshipNav.style.flexWrap = 'nowrap';
                    scholarshipNav.style.flexDirection = 'row';
                    scholarshipNav.style.justifyContent = 'flex-start';
                    scholarshipNav.style.gap = '0.5rem';
                    scholarshipNav.style.overflowX = 'auto';
                    scholarshipNav.style.whiteSpace = 'nowrap';
                    scholarshipNav.style.WebkitOverflowScrolling = 'touch';
                    scholarshipNav.style.scrollbarWidth = 'none';
                    scholarshipNav.style.msOverflowStyle = 'none';
                    scholarshipNav.style.padding = '0.5rem';

                    // Fix navigation links
                    const navLinks = scholarshipNav.querySelectorAll('.nav-item');
                    navLinks.forEach(link => {
                        link.style.width = 'auto';
                        link.style.minWidth = 'auto';
                        link.style.flex = '0 0 auto';
                        link.style.padding = '0.5rem 1rem';
                        link.style.border = '1px solid #e5e7eb';
                        link.style.borderRadius = '0.375rem';
                        link.style.textAlign = 'center';
                        link.style.borderLeftWidth = '1px';
                        link.style.display = 'inline-block';
                        link.style.marginBottom = '0.5rem';
                    });
                }

                // Fix scholarship content sections
                const scholarshipSections = document.querySelectorAll('#undergraduate, #class12, #class11, #class10, #class9, #postgraduate');
                scholarshipSections.forEach(section => {
                    section.style.flexDirection = 'column';

                    // Fix section columns
                    const columns = section.querySelectorAll('.md\\:w-1\\/2');
                    columns.forEach(column => {
                        column.style.width = '100%';
                        column.style.marginBottom = '1.5rem';
                    });

                    // Fix headings
                    const headings = section.querySelectorAll('h3');
                    headings.forEach(heading => {
                        heading.style.fontSize = '1.5rem';
                        heading.style.lineHeight = '1.75rem';
                    });
                });
            }

            // Ensure the body has proper height
            document.body.style.minHeight = `calc(var(--vh, 1vh) * 100)`;

            // Force redraw to ensure changes take effect (but only on non-iOS devices)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            // Special handling for Samsung Galaxy S8+ and similar devices
            const isSamsungGalaxyS8 = /SM-G955/.test(navigator.userAgent) ||
                                     (window.innerWidth === 360 && window.innerHeight === 740) ||
                                     (window.innerWidth === 740 && window.innerHeight === 360);

            if (isSamsungGalaxyS8) {
                // Apply specific fixes for Samsung Galaxy S8+
                if (heroSection) {
                    heroSection.style.height = 'auto';
                    heroSection.style.minHeight = '100vh';
                    heroSection.style.maxHeight = 'none';
                }

                if (heroContainer) {
                    heroContainer.style.minHeight = '100vh';
                    heroContainer.style.paddingTop = '1rem';
                    heroContainer.style.paddingBottom = '1rem';
                }

                if (formContainer) {
                    formContainer.style.height = 'auto';
                    formContainer.style.maxHeight = 'none';
                }

                // Additional fixes for Samsung Galaxy S8+
                const scholarshipSections = document.querySelectorAll('#undergraduate, #class12, #class11, #class10, #class9, #postgraduate');
                scholarshipSections.forEach(section => {
                    section.style.flexDirection = 'column';

                    // Fix section columns
                    const columns = section.querySelectorAll('.md\\:w-1\\/2');
                    columns.forEach(column => {
                        column.style.width = '100%';
                        column.style.marginBottom = '1rem';
                    });

                    // Fix headings
                    const headings = section.querySelectorAll('h3');
                    headings.forEach(heading => {
                        heading.style.fontSize = '1.25rem';
                        heading.style.lineHeight = '1.5rem';
                    });
                });

                // Fix scholarship navigation for Samsung Galaxy S8+
                const scholarshipNav = document.querySelector('.academic-levels-section .scholarship-nav');
                if (scholarshipNav) {
                    scholarshipNav.style.display = 'flex';
                    scholarshipNav.style.flexWrap = 'nowrap';
                    scholarshipNav.style.flexDirection = 'row';
                    scholarshipNav.style.justifyContent = 'flex-start';
                    scholarshipNav.style.gap = '0.25rem';
                    scholarshipNav.style.overflowX = 'auto';
                    scholarshipNav.style.whiteSpace = 'nowrap';
                    scholarshipNav.style.padding = '0.25rem';

                    // Fix navigation links
                    const navLinks = scholarshipNav.querySelectorAll('.nav-item');
                    navLinks.forEach(link => {
                        link.style.width = 'auto';
                        link.style.minWidth = 'auto';
                        link.style.flex = '0 0 auto';
                        link.style.padding = '0.375rem 0.75rem';
                        link.style.fontSize = '0.75rem';
                        link.style.border = '1px solid #e5e7eb';
                        link.style.borderRadius = '0.375rem';
                        link.style.textAlign = 'center';
                        link.style.display = 'inline-block';
                        link.style.marginRight = '0.25rem';
                    });
                }
            }

            if (!isIOS && !isSamsungGalaxyS8) {
                document.body.style.display = 'none';
                void document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }
        }

        // Execute immediately
        fixMobileViewportHeight();

        // Execute when the document is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Run again after DOM is loaded
            fixMobileViewportHeight();

            // Run again after a short delay to ensure all content is loaded
            setTimeout(fixMobileViewportHeight, 100);
            setTimeout(fixMobileViewportHeight, 500);
            setTimeout(fixMobileViewportHeight, 1000);

            // Add event listeners for responsive behavior
            window.addEventListener('resize', fixMobileViewportHeight);
            window.addEventListener('orientationchange', function() {
                // Run multiple times after orientation change to ensure it takes effect
                fixMobileViewportHeight();
                setTimeout(fixMobileViewportHeight, 100);
                setTimeout(fixMobileViewportHeight, 500);
            });

            // Also run when images and other resources finish loading
            window.addEventListener('load', fixMobileViewportHeight);
        });
  

    // <!-- Scholarship Cap Animation Script -->
  
        // Function to enhance the scholarship cap animation
        function enhanceScholarshipCapAnimation() {
            const scholarshipCap = document.querySelector('.scholarship-cap');
            const scholarshipLetter = document.querySelector('.scholarship-letter');

            if (scholarshipCap && scholarshipLetter) {
                // Make the cap bounce when hovered
                scholarshipLetter.addEventListener('mouseenter', function() {
                    scholarshipCap.style.animation = 'capFloat 1s ease-in-out infinite';

                    // Create and add more confetti on hover
                    for (let i = 0; i < 15; i++) { // Increased number of confetti
                        const confetti = document.createElement('div');
                        confetti.classList.add('confetti');

                        // Wider spread of confetti
                        confetti.style.left = Math.random() * 80 - 10 + 'px';

                        // Varied animation delays for more natural effect
                        confetti.style.animationDelay = Math.random() * 1.5 + 's';

                        // Varied animation durations
                        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

                        scholarshipCap.appendChild(confetti);

                        // Remove confetti after animation completes
                        setTimeout(() => {
                            if (confetti.parentNode === scholarshipCap) {
                                scholarshipCap.removeChild(confetti);
                            }
                        }, 4000); // Increased timeout to match longer animations
                    }
                });

                // Return to normal animation when not hovered
                scholarshipLetter.addEventListener('mouseleave', function() {
                    scholarshipCap.style.animation = 'capFloat 3s ease-in-out infinite';
                });

                // Add click interaction
                scholarshipLetter.addEventListener('click', function() {
                    // Trigger a more dramatic bounce animation
                    scholarshipLetter.style.animation = 'none';
                    setTimeout(() => {
                        scholarshipLetter.style.animation = 'letterBounce 1s ease-in-out';
                    }, 10);

                    // Make the cap jump higher
                    scholarshipCap.style.animation = 'none';
                    setTimeout(() => {
                        scholarshipCap.style.animation = 'capFloat 1.5s ease-in-out';
                    }, 10);

                    // Create a burst of confetti
                    for (let i = 0; i < 30; i++) { // Increased number of confetti
                        const confetti = document.createElement('div');
                        confetti.classList.add('confetti');

                        // Much wider spread for a dramatic burst effect
                        confetti.style.left = Math.random() * 100 - 20 + 'px';

                        // Some confetti will appear above the cap
                        confetti.style.top = Math.random() * 30 - 30 + 'px';

                        // Minimal delay for immediate burst effect
                        confetti.style.animationDelay = Math.random() * 0.3 + 's';

                        // Varied animation durations
                        confetti.style.animationDuration = (2 + Math.random() * 3) + 's';

                        // Varied sizes for more dynamic effect
                        const size = 8 + Math.random() * 10;
                        confetti.style.width = size + 'px';
                        confetti.style.height = size + 'px';

                        scholarshipCap.appendChild(confetti);

                        // Remove confetti after animation completes
                        setTimeout(() => {
                            if (confetti.parentNode === scholarshipCap) {
                                scholarshipCap.removeChild(confetti);
                            }
                        }, 5000); // Increased timeout for longer-lasting effect
                    }

                    // Add a celebratory message that appears briefly
                    const message = document.createElement('div');
                    message.textContent = "Scholarship!";
                    message.style.position = 'absolute';
                    message.style.top = '-60px';
                    message.style.left = '0';
                    message.style.color = '#7c3aed';
                    message.style.fontWeight = 'bold';
                    message.style.fontSize = '16px';
                    message.style.textShadow = '0 0 10px rgba(124, 58, 237, 0.7)';
                    message.style.opacity = '0';
                    message.style.transition = 'all 0.5s ease-in-out';

                    scholarshipCap.appendChild(message);

                    // Animate the message
                    setTimeout(() => {
                        message.style.opacity = '1';
                        message.style.top = '-80px';
                    }, 100);

                    // Remove the message after a delay
                    setTimeout(() => {
                        message.style.opacity = '0';
                        setTimeout(() => {
                            if (message.parentNode === scholarshipCap) {
                                scholarshipCap.removeChild(message);
                            }
                        }, 500);
                    }, 2000);
                });
            }
        }

        // Function to enhance the popular courses animation
        function enhancePopularCoursesAnimation() {
            const coursesAnimation = document.querySelector('.courses-animation');
            const courseBook = document.querySelector('.course-book');
            const courseCertificate = document.querySelector('.course-certificate');
            const sparkles = document.querySelectorAll('.course-sparkle');

            if (coursesAnimation) {
                // Add scroll-based animation
                window.addEventListener('scroll', function() {
                    const scrollPosition = window.scrollY;
                    const coursesSection = document.querySelector('.courses-animation-container').getBoundingClientRect();

                    // Check if the courses section is in view
                    if (coursesSection.top < window.innerHeight && coursesSection.bottom > 0) {
                        // Calculate scroll percentage within the section
                        const scrollPercentage = 1 - (coursesSection.top / window.innerHeight);

                        if (scrollPercentage > 0 && scrollPercentage < 1) {
                            // Apply rotation based on scroll
                            coursesAnimation.style.transform = `rotate(${-30 + scrollPercentage * 10}deg)`;

                            // Apply scale based on scroll
                            const scale = 1 + scrollPercentage * 0.2;
                            coursesAnimation.style.scale = scale;
                        }
                    }
                });

                // Add hover interaction
                coursesAnimation.parentElement.addEventListener('mouseenter', function() {
                    // Speed up animations
                    courseBook.style.animationDuration = '2s';
                    courseCertificate.style.animationDuration = '2s';

                    // Add more sparkles
                    for (let i = 0; i < 5; i++) {
                        const sparkle = document.createElement('div');
                        sparkle.classList.add('course-sparkle');
                        sparkle.style.top = Math.random() * 100 + 'px';
                        sparkle.style.left = Math.random() * 100 + 'px';
                        sparkle.style.animationDelay = Math.random() * 2 + 's';
                        coursesAnimation.appendChild(sparkle);

                        // Remove sparkle after animation completes
                        setTimeout(() => {
                            if (sparkle.parentNode === coursesAnimation) {
                                coursesAnimation.removeChild(sparkle);
                            }
                        }, 3000);
                    }
                });

                // Return to normal animation when not hovered
                coursesAnimation.parentElement.addEventListener('mouseleave', function() {
                    courseBook.style.animationDuration = '4s';
                    courseCertificate.style.animationDuration = '4s';
                });

                // Add click interaction
                coursesAnimation.parentElement.addEventListener('click', function() {
                    // Create a burst of sparkles
                    for (let i = 0; i < 15; i++) {
                        const sparkle = document.createElement('div');
                        sparkle.classList.add('course-sparkle');
                        sparkle.style.top = Math.random() * 120 - 10 + 'px';
                        sparkle.style.left = Math.random() * 120 - 10 + 'px';
                        sparkle.style.width = 8 + Math.random() * 15 + 'px';
                        sparkle.style.height = 8 + Math.random() * 15 + 'px';
                        sparkle.style.animationDuration = 1 + Math.random() * 2 + 's';
                        sparkle.style.animationDelay = Math.random() * 0.5 + 's';
                        coursesAnimation.appendChild(sparkle);

                        // Remove sparkle after animation completes
                        setTimeout(() => {
                            if (sparkle.parentNode === coursesAnimation) {
                                coursesAnimation.removeChild(sparkle);
                            }
                        }, 3000);
                    }

                    // Add a temporary message
                    const message = document.createElement('div');
                    message.textContent = "Popular!";
                    message.style.position = 'absolute';
                    message.style.top = '-40px';
                    message.style.right = '-40px';
                    message.style.color = '#7c3aed';
                    message.style.fontWeight = 'bold';
                    message.style.fontSize = '16px';
                    message.style.textShadow = '0 0 10px rgba(124, 58, 237, 0.7)';
                    message.style.opacity = '0';
                    message.style.transition = 'all 0.5s ease-in-out';

                    coursesAnimation.appendChild(message);

                    // Animate the message
                    setTimeout(() => {
                        message.style.opacity = '1';
                        message.style.top = '-60px';
                    }, 100);

                    // Remove the message after a delay
                    setTimeout(() => {
                        message.style.opacity = '0';
                        setTimeout(() => {
                            if (message.parentNode === coursesAnimation) {
                                coursesAnimation.removeChild(message);
                            }
                        }, 500);
                    }, 2000);

                    // Make the book and certificate jump
                    courseBook.style.animation = 'none';
                    courseCertificate.style.animation = 'none';

                    setTimeout(() => {
                        courseBook.style.animation = 'bookFloat 4s ease-in-out infinite';
                        courseCertificate.style.animation = 'certificateFloat 4s ease-in-out infinite 0.5s';
                    }, 10);
                });
            }
        }

        // Execute when the document is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the scholarship cap animation after a short delay to ensure DOM is fully loaded
            setTimeout(enhanceScholarshipCapAnimation, 500);

            // Initialize the popular courses animation
            setTimeout(enhancePopularCoursesAnimation, 500);

            // Initialize the course categories slider
            setTimeout(enhanceCourseSlider, 500);

            // Initialize the scholarship notification badge
            setTimeout(enhanceScholarshipNotification, 500);

            // Initialize the stats counter animation
            initStatsCounters();

            // Booking Form Validation
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', function(event) {
                    event.preventDefault();

                    // Reset error messages
                    const errorMessages = document.querySelectorAll('#booking-form .text-pink-400');
                    errorMessages.forEach(message => {
                        message.classList.add('hidden');
                    });

                    // Get form fields
                    const name = document.getElementById('name').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const mobile = document.getElementById('mobile').value.trim();
                    const academicLevel = document.getElementById('academic-level').value;

                    // Validate form
                    let isValid = true;

                    // Name validation
                    if (!name) {
                        document.getElementById('name-error').classList.remove('hidden');
                        isValid = false;
                    }

                    // Email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!email || !emailRegex.test(email)) {
                        document.getElementById('email-error').classList.remove('hidden');
                        isValid = false;
                    }

                    // Mobile validation
                    const mobileRegex = /^[0-9]{10}$/;
                    if (!mobile || !mobileRegex.test(mobile)) {
                        document.getElementById('mobile-error').classList.remove('hidden');
                        isValid = false;
                    }

                    // Academic level validation
                    if (!academicLevel) {
                        document.getElementById('academic-level-error').classList.remove('hidden');
                        isValid = false;
                    }

                    // If form is valid, show success message
                    if (isValid) {
                        // In a real application, you would submit the form data to a server here
                        const formSuccess = document.getElementById('form-success');
                        formSuccess.classList.remove('hidden');
                        bookingForm.reset();

                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            formSuccess.classList.add('hidden');
                        }, 5000);
                    }
                });

                // Add input event listeners to clear error messages when user types
                const formInputs = bookingForm.querySelectorAll('input, select');
                formInputs.forEach(input => {
                    input.addEventListener('input', function() {
                        const errorId = this.id + '-error';
                        const errorElement = document.getElementById(errorId);
                        if (errorElement) {
                            errorElement.classList.add('hidden');
                        }
                    });
                });
            }
        });

        // Stats counter animation function
        function initStatsCounters() {
            const counters = document.querySelectorAll('.stat-counter');
            const statsSection = document.querySelector('.stats-section');
            let hasAnimated = false;

            // Function to animate a counter
            function animateCounter(counter) {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 30); // Update every 30ms
                let current = 0;

                counter.classList.add('animate');

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        clearInterval(timer);
                        counter.textContent = target.toLocaleString();
                        setTimeout(() => {
                            counter.classList.remove('animate');
                        }, 500);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 30);
            }

            // Function to check if element is in viewport
            function isInViewport(element) {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.bottom >= 0
                );
            }

            // Function to start animation when stats section is in view
            function checkAndAnimate() {
                if (!hasAnimated && counters.length > 0 && isInViewport(counters[0])) {
                    hasAnimated = true;
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                    // Remove scroll listener after animation
                    window.removeEventListener('scroll', checkAndAnimate);
                }
            }

            // Check on page load and on scroll
            checkAndAnimate();
            window.addEventListener('scroll', checkAndAnimate);
        }


    // <!-- FAQ Toggle Script -->
   
        function toggleFAQ(button) {
            // Toggle the content visibility
            const content = button.nextElementSibling;
            content.classList.toggle('hidden');

            // Toggle the icon container rotation and animation
            const iconContainer = button.querySelector('.w-8');
            if (content.classList.contains('hidden')) {
                iconContainer.classList.remove('rotate-180', 'scale-125', 'shadow-lg');
                iconContainer.style.background = 'linear-gradient(to right, #7c3aed, #6366f1)';
            } else {
                iconContainer.classList.add('rotate-180', 'scale-125', 'shadow-lg');
                // Change gradient direction when open for a dynamic effect
                iconContainer.style.background = 'linear-gradient(to left, #7c3aed, #6366f1)';

                // Add a pulse animation
                iconContainer.animate([
                    { transform: 'scale(1) rotate(180deg)' },
                    { transform: 'scale(1.1) rotate(180deg)' },
                    { transform: 'scale(1) rotate(180deg)' }
                ], {
                    duration: 1000,
                    iterations: 1
                });
            }

            // Close other FAQs when opening a new one (accordion behavior)
            if (!content.classList.contains('hidden')) {
                // Get all FAQ items
                const allFAQs = document.querySelectorAll('.bg-white.rounded-xl.shadow-lg.overflow-hidden');

                // Loop through all FAQs
                allFAQs.forEach(faq => {
                    // Skip the current FAQ
                    if (faq.contains(button)) return;

                    // Get the content and icon of other FAQs
                    const otherContent = faq.querySelector('button').nextElementSibling;
                    const otherIcon = faq.querySelector('.w-8');

                    // Close other open FAQs
                    if (!otherContent.classList.contains('hidden')) {
                        otherContent.classList.add('hidden');
                        otherIcon.classList.remove('rotate-180', 'scale-125', 'shadow-lg');
                        otherIcon.style.background = 'linear-gradient(to right, #7c3aed, #6366f1)';
                    }
                });
            }
        }

        // Add hover effects to FAQ icons on page load
        document.addEventListener('DOMContentLoaded', function() {
            const faqIcons = document.querySelectorAll('.bg-white.rounded-xl button .w-8');

            faqIcons.forEach(icon => {
                icon.addEventListener('mouseenter', function() {
                    this.classList.add('scale-110');
                    this.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                });

                icon.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('rotate-180')) {
                        this.classList.remove('scale-110');
                        this.style.boxShadow = '';
                    }
                });
            });
        });
   

    // <!-- No auto-scrolling for course cards as per user request -->

    // <!-- Mobile menu functionality is handled by script.js -->

    // <!-- Add Golden Star Badge to Category Cards -->
   
        window.addEventListener('load', function() {
            // Add golden star badges to all category cards
            const categoryShapes = document.querySelectorAll('.category-shape');

            categoryShapes.forEach(function(shape) {
                // Check if the badge already exists
                if (!shape.querySelector('.golden-star-badge')) {
                    // Create the golden star badge
                    const badge = document.createElement('div');
                    badge.className = 'golden-star-badge';
                    badge.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    `;

                    // Insert the badge as the first child of the category shape
                    shape.insertBefore(badge, shape.firstChild);
                }
            });
        });
   

    // <!-- Mobile menu functionality is consolidated in script.js -->

    // <!-- Course Track Animation Initialization -->
  
        // Enhanced course track animation initialization
        function initializeCourseTrackAnimation() {
            const courseTrack = document.getElementById('courseTrack');
            if (courseTrack) {
                console.log('Initializing course track animation...');

                // Method 1: Apply correct CSS animation
                courseTrack.style.animation = 'courseScroll 80s linear infinite';
                courseTrack.style.animationPlayState = 'running';
                courseTrack.style.animationDelay = '0s';
                courseTrack.style.animationFillMode = 'both';

                // Method 2: Ensure visibility and proper display
                courseTrack.style.visibility = 'visible';
                courseTrack.style.opacity = '1';
                courseTrack.style.display = 'flex';

                // Method 3: Force hardware acceleration for smooth animation
                courseTrack.style.willChange = 'transform';
                courseTrack.style.backfaceVisibility = 'hidden';
                courseTrack.style.transform = 'translateZ(0)';

                // Method 4: Ensure proper flex properties
                courseTrack.style.flexWrap = 'nowrap';
                courseTrack.style.alignItems = 'stretch';

                // Method 5: Add loaded class for additional styling
                courseTrack.classList.add('loaded');

                console.log('Course track animation initialized successfully');
                return true;
            }
            return false;
        }

        // Enhanced animation restart function
        function restartCourseAnimation() {
            const courseTrack = document.getElementById('courseTrack');
            if (courseTrack) {
                // Temporarily stop animation
                courseTrack.style.animation = 'none';
                courseTrack.offsetHeight; // Force reflow

                // Restart with correct animation
                courseTrack.style.animation = 'courseScroll 80s linear infinite';
                courseTrack.style.animationPlayState = 'running';

                console.log('Course track animation restarted');
            }
        }

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCourseTrackAnimation);
        } else {
            initializeCourseTrackAnimation();
        }

        // Backup initialization on window load
        window.addEventListener('load', function() {
            setTimeout(function() {
                const courseTrack = document.getElementById('courseTrack');
                if (courseTrack) {
                    console.log('Backup animation initialization...');
                    restartCourseAnimation();
                }
            }, 100);
        });

        // Monitor and fix animation issues
        let animationCheckAttempts = 0;
        const maxAnimationAttempts = 8;
        const animationCheckInterval = setInterval(function() {
            animationCheckAttempts++;
            const courseTrack = document.getElementById('courseTrack');

            if (courseTrack && animationCheckAttempts <= maxAnimationAttempts) {
                const computedStyle = window.getComputedStyle(courseTrack);
                const animationName = computedStyle.animationName;

                // Check if animation is not running properly
                if (animationName === 'none' || animationName === '' || !animationName.includes('courseScroll')) {
                    console.log(`Attempt ${animationCheckAttempts}: Fixing animation...`);
                    restartCourseAnimation();
                }
            }

            if (animationCheckAttempts >= maxAnimationAttempts) {
                clearInterval(animationCheckInterval);
                console.log('Animation monitoring completed');
            }
        }, 750);

        // Add pause/resume functionality on hover for better UX
        document.addEventListener('DOMContentLoaded', function() {
            const courseTrack = document.getElementById('courseTrack');
            const courseContainer = document.querySelector('.course-slider-container');

            if (courseTrack && courseContainer) {
                courseContainer.addEventListener('mouseenter', function() {
                    courseTrack.style.animationPlayState = 'paused';
                });

                courseContainer.addEventListener('mouseleave', function() {
                    courseTrack.style.animationPlayState = 'running';
                });
            }
        });




        document.addEventListener('DOMContentLoaded', function() {
            // Get the course track element
            const courseTrack = document.querySelector('.course-track');
            if (!courseTrack) return;

            // Variables for touch handling
            let startX;
            let scrollLeft;
            let isDown = false;

            // Touch event listeners for mobile devices
            courseTrack.addEventListener('touchstart', function(e) {
                isDown = true;
                courseTrack.style.animationPlayState = 'paused';
                startX = e.touches[0].pageX - courseTrack.offsetLeft;
                scrollLeft = courseTrack.scrollLeft;
            }, { passive: true });

            courseTrack.addEventListener('touchend', function() {
                isDown = false;
                // Resume animation after a short delay
                setTimeout(() => {
                    courseTrack.style.animationPlayState = 'running';
                }, 100);
            }, { passive: true });

            courseTrack.addEventListener('touchcancel', function() {
                isDown = false;
                courseTrack.style.animationPlayState = 'running';
            }, { passive: true });

            courseTrack.addEventListener('touchmove', function(e) {
                if (!isDown) return;
                e.preventDefault();
                const x = e.touches[0].pageX - courseTrack.offsetLeft;
                const walk = (x - startX) * 2; // Scroll speed multiplier
                courseTrack.scrollLeft = scrollLeft - walk;
            }, { passive: false });

            // Function to handle viewport resizing
            function handleResize() {
                // Reset any inline styles that might interfere with responsiveness
                const categoryCards = document.querySelectorAll('.category-card');
                categoryCards.forEach(card => {
                    // Set animation delay based on index for staggered effect
                    const index = Array.from(categoryCards).indexOf(card);
                    card.style.setProperty('--card-index', index);
                });
            }

            // Call on load and on resize
            handleResize();
            window.addEventListener('resize', handleResize);
        });
   

    // <!-- Animation script for hero section, application process and scholarship section -->

        // Function to create particles for hero section
        function createParticle(container) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random size between 3px and 8px
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;

            // Random color - purple/indigo shades
            const colors = ['rgba(124, 58, 237, 0.7)', 'rgba(99, 102, 241, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(79, 70, 229, 0.7)'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Random movement direction
            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(particle);
        }

        // Testimonial carousel hover pause functionality
        function setupTestimonialCarousel() {
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            const testimonialTrack = document.querySelector('.testimonial-track');
            const testimonialContainer = document.querySelector('.testimonial-carousel-container');

            if (!testimonialTrack || testimonialCards.length === 0) return;

            // Clone the first set of cards and append to the end for seamless looping
            const cloneCards = Array.from(testimonialCards).slice(0, 7).map(card => {
                const clone = card.cloneNode(true);
                return clone;
            });

            cloneCards.forEach(clone => {
                testimonialTrack.appendChild(clone);
            });

            // Ensure all cards have equal width and height
            document.querySelectorAll('.testimonial-card').forEach(card => {
                // The width is controlled by CSS, this ensures any inline styles don't override it
                card.style.flexBasis = '';
            });

            // Function to set equal height for all testimonial cards
            function setEqualHeight() {
                const testimonialTexts = document.querySelectorAll('.testimonial-card .italic');
                let maxHeight = 0;

                // Reset heights first
                testimonialTexts.forEach(text => {
                    text.style.height = 'auto';
                });

                // Find the maximum height
                testimonialTexts.forEach(text => {
                    const height = text.offsetHeight;
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                });

                // Set all to the maximum height
                if (maxHeight > 0) {
                    testimonialTexts.forEach(text => {
                        text.style.height = `${maxHeight}px`;
                    });
                }
            }

            // Call the function after a short delay to ensure all content is loaded
            setTimeout(setEqualHeight, 500);

            // Add window resize event listener to maintain equal height
            window.addEventListener('resize', function() {
                // Debounce the resize event
                clearTimeout(window.resizeTimeout);
                window.resizeTimeout = setTimeout(function() {
                    setEqualHeight();
                }, 200);
            });

            // Add hover event listeners to all cards (original and clones)
            document.querySelectorAll('.testimonial-card').forEach(card => {
                let pauseTimeout;

                // Mouse events for desktop
                card.addEventListener('mouseenter', () => {
                    // Pause the animation immediately
                    testimonialTrack.style.animationPlayState = 'paused';

                    // Set a timeout to resume after 3 seconds
                    pauseTimeout = setTimeout(() => {
                        testimonialTrack.style.animationPlayState = 'running';
                    }, 3000);
                });

                card.addEventListener('mouseleave', () => {
                    // Clear the timeout if the user leaves before 3 seconds
                    clearTimeout(pauseTimeout);

                    // Resume the animation
                    testimonialTrack.style.animationPlayState = 'running';
                });

                // Touch events for mobile
                card.addEventListener('touchstart', (e) => {
                    // Pause the animation immediately
                    testimonialTrack.style.animationPlayState = 'paused';

                    // Set a timeout to resume after 3 seconds
                    pauseTimeout = setTimeout(() => {
                        testimonialTrack.style.animationPlayState = 'running';
                    }, 3000);
                }, { passive: true });

                card.addEventListener('touchend', () => {
                    // Clear the timeout if the user leaves before 3 seconds
                    clearTimeout(pauseTimeout);

                    // Resume the animation after a short delay to allow for tapping
                    setTimeout(() => {
                        testimonialTrack.style.animationPlayState = 'running';
                    }, 100);
                });
            });

            // Add touch swipe functionality for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            testimonialContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                testimonialTrack.style.animationPlayState = 'paused';
            }, { passive: true });

            testimonialContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();

                // Resume animation after swipe
                setTimeout(() => {
                    testimonialTrack.style.animationPlayState = 'running';
                }, 500);
            }, { passive: true });

            function handleSwipe() {
                const swipeDistance = touchEndX - touchStartX;
                const currentPosition = getComputedStyle(testimonialTrack).transform;
                let matrix = new DOMMatrix(currentPosition);
                let currentX = matrix.m41; // Current X translation

                // If swiped right, move cards to the right
                if (swipeDistance > 100) {
                    testimonialTrack.style.transform = `translateX(${currentX + 320}px)`;
                    setTimeout(() => {
                        testimonialTrack.style.transition = 'none';
                        testimonialTrack.style.transform = '';
                        setTimeout(() => {
                            testimonialTrack.style.transition = '';
                        }, 50);
                    }, 500);
                }
                // If swiped left, move cards to the left
                else if (swipeDistance < -100) {
                    testimonialTrack.style.transform = `translateX(${currentX - 320}px)`;
                    setTimeout(() => {
                        testimonialTrack.style.transition = 'none';
                        testimonialTrack.style.transform = '';
                        setTimeout(() => {
                            testimonialTrack.style.transition = '';
                        }, 50);
                    }, 500);
                }
            }
        }

        // Video Testimonials Animation Setup
        function setupVideoTestimonials() {
            const videoCards = document.querySelectorAll('.video-testimonial-card');

            // Intersection Observer for video testimonials
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            videoCards.forEach(card => {
                videoObserver.observe(card);
            });

            // Setup video interactions
            videoCards.forEach(card => {
                const video = card.querySelector('video');
                const playButton = card.querySelector('.play-button');
                const overlay = card.querySelector('.video-overlay');

                if (video && playButton && overlay) {
                    // Initially pause all videos
                    video.pause();

                    // Play button click handler
                    playButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (video.paused) {
                            video.play().catch(e => console.log('Video play failed:', e));
                            overlay.style.opacity = '0';
                        } else {
                            video.pause();
                            overlay.style.opacity = '1';
                        }
                    });

                    // Video click handler
                    video.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (video.paused) {
                            video.play().catch(e => console.log('Video play failed:', e));
                            overlay.style.opacity = '0';
                        } else {
                            video.pause();
                            overlay.style.opacity = '1';
                        }
                    });

                    // Video ended handler
                    video.addEventListener('ended', () => {
                        overlay.style.opacity = '1';
                        video.currentTime = 0;
                    });

                    // Video pause handler
                    video.addEventListener('pause', () => {
                        overlay.style.opacity = '1';
                    });

                    // Video play handler
                    video.addEventListener('play', () => {
                        overlay.style.opacity = '0';
                    });

                    // Hover effects for desktop
                    if (window.innerWidth > 768) {
                        card.addEventListener('mouseenter', () => {
                            if (video.paused) {
                                overlay.style.opacity = '0.7';
                            }
                        });

                        card.addEventListener('mouseleave', () => {
                            if (video.paused) {
                                overlay.style.opacity = '1';
                            }
                        });
                    }
                }
            });
        }

        // Intersection Observer for animation triggers
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize video testimonials
            setupVideoTestimonials();

            // Initialize testimonial carousel
            setupTestimonialCarousel();

            // Particle animation for hero section
            const particlesContainer = document.getElementById('particles-container');
            if (particlesContainer) {
                // Create particles
                for (let i = 0; i < 50; i++) {
                    createParticle(particlesContainer);
                }
            }

            // Add event listener to recreate particles after animation ends
            document.addEventListener('animationend', function(e) {
                if (e.target.classList.contains('particle')) {
                    e.target.remove();
                    createParticle(particlesContainer);
                }
            });

            // Typing animation for the hero section
            const typingElements = document.querySelectorAll('.typing-animation');
            typingElements.forEach(element => {
                const text = element.textContent;
                element.textContent = '';
                let i = 0;

                function typeWriter() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 100);
                    }
                }

                setTimeout(() => {
                    typeWriter();
                }, 1000);
            });
            // Process steps animation
            const processSteps = document.querySelectorAll('.bg-white\\/10');
            const scholarshipElements = document.querySelectorAll('[id^="class"] > div, #undergraduate > div, #postgraduate > div');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Add a slight delay between each step animation
                        if (entry.target.classList.contains('bg-white/10')) {
                            const stepNumber = Array.from(processSteps).indexOf(entry.target);
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, stepNumber * 200);
                        } else {
                            // For scholarship section elements
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, 200);
                        }
                    }
                });
            }, { threshold: 0.2 });

            // Set initial state for process steps animation
            processSteps.forEach(step => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                step.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                observer.observe(step);
            });

            // Set initial state for scholarship section animation
            scholarshipElements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                observer.observe(element);
            });

            // Add click functionality for academic level navigation
            const academicLevelLinks = document.querySelectorAll('.lg\\:w-1\\/4 nav a');
            const academicLevelContents = document.querySelectorAll('[id^="class"], [id="undergraduate"], [id="postgraduate"]');

            // Show Class 9 content by default
            document.getElementById('class9').classList.remove('hidden');

            // Set Class 9 link as active by default
            academicLevelLinks[0].classList.add('bg-purple-50', 'border-purple-500', 'font-medium', 'text-purple-700');
            academicLevelLinks[0].classList.remove('border-transparent');

            // Initialize the total slides count
            const totalSlidesElement = document.getElementById('total-slides');
            if (totalSlidesElement) {
                totalSlidesElement.textContent = academicLevelLinks.length.toString();
            }

            // Variables for automatic slideshow
            let currentSlideIndex = 0;
            let slideshowInterval;
            let progressInterval;
            let isPaused = false;
            const slideshowDuration = 2700; // 2.7 seconds

            // Function to show a specific slide with animation
            const showSlide = (index) => {
                // Get the current visible content
                const currentContent = document.querySelector('[id^="class"]:not(.hidden), [id="undergraduate"]:not(.hidden), [id="postgraduate"]:not(.hidden)');
                const targetId = academicLevelLinks[index].getAttribute('href').substring(1);
                const targetContent = document.getElementById(targetId);

                // Remove active class from all links
                academicLevelLinks.forEach(l => {
                    l.classList.remove('bg-purple-50', 'border-purple-500', 'font-medium', 'text-purple-700');
                    l.classList.add('border-transparent');
                });

                // Add active class to current link
                academicLevelLinks[index].classList.add('bg-purple-50', 'border-purple-500', 'font-medium', 'text-purple-700');
                academicLevelLinks[index].classList.remove('border-transparent');

                // Fade out current content
                if (currentContent) {
                    currentContent.style.opacity = '0';

                    // After fade out, hide current and show new content
                    setTimeout(() => {
                        // Hide all content sections
                        academicLevelContents.forEach(content => {
                            content.classList.add('hidden');
                        });

                        // Show the target content but with opacity 0
                        targetContent.classList.remove('hidden');
                        targetContent.style.opacity = '0';

                        // Trigger reflow to ensure transition works
                        void targetContent.offsetWidth;

                        // Fade in the target content
                        setTimeout(() => {
                            targetContent.style.opacity = '1';
                        }, 50);
                    }, 250); // Half of the transition duration
                } else {
                    // First load - no animation needed
                    academicLevelContents.forEach(content => {
                        content.classList.add('hidden');
                    });
                    targetContent.classList.remove('hidden');
                    targetContent.style.opacity = '1';
                }

                // Update current index
                currentSlideIndex = index;

                // Update slide counter
                const currentSlideElement = document.getElementById('current-slide');
                if (currentSlideElement) {
                    currentSlideElement.textContent = (index + 1).toString();
                }

                // Reset progress bar when manually changing slides
                const progressBar = document.querySelector('.slideshow-progress-bar');
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            };

            // Function to advance to the next slide
            const nextSlide = () => {
                if (isPaused) return;
                let nextIndex = (currentSlideIndex + 1) % academicLevelLinks.length;
                showSlide(nextIndex);

                // Reset and restart the progress bar animation
                animateProgressBar();
            };

            // Function to animate the progress bar
            const animateProgressBar = () => {
                // Reset progress bar
                const progressBar = document.querySelector('.slideshow-progress-bar');
                if (progressBar) {
                    progressBar.style.width = '0%';

                    // Clear any existing interval
                    if (progressInterval) {
                        clearInterval(progressInterval);
                    }

                    // Animate the progress bar
                    let progress = 0;
                    const increment = 100 / (slideshowDuration / 10); // Update every 10ms

                    progressInterval = setInterval(() => {
                        if (isPaused) return;

                        progress += increment;
                        if (progress >= 100) {
                            progress = 100;
                            clearInterval(progressInterval);
                        }

                        progressBar.style.width = `${progress}%`;
                    }, 10);
                }
            };

            // Start the slideshow
            const startSlideshow = () => {
                slideshowInterval = setInterval(nextSlide, slideshowDuration);
                animateProgressBar();
            };

            // Pause the slideshow
            const pauseSlideshow = () => {
                isPaused = true;
                clearInterval(slideshowInterval);
                clearInterval(progressInterval);

                // Update indicator
                const indicator = document.querySelector('.slideshow-indicator');
                if (indicator) {
                    indicator.classList.remove('animate-pulse', 'bg-purple-500');
                    indicator.classList.add('bg-gray-400');
                }

                // Pause progress bar animation
                const progressBar = document.querySelector('.slideshow-progress-bar');
                if (progressBar) {
                    progressBar.style.transition = 'none';
                }
            };

            // Resume the slideshow after a delay
            const resumeSlideshow = () => {
                isPaused = false;
                startSlideshow();

                // Update indicator
                const indicator = document.querySelector('.slideshow-indicator');
                if (indicator) {
                    indicator.classList.remove('bg-gray-400');
                    indicator.classList.add('animate-pulse', 'bg-purple-500');
                }

                // Resume progress bar animation
                const progressBar = document.querySelector('.slideshow-progress-bar');
                if (progressBar) {
                    progressBar.style.transition = 'width 100ms linear';
                }
            };

            // Start the slideshow initially
            startSlideshow();

            // Add click event listeners to navigation links
            academicLevelLinks.forEach((link, index) => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    // Pause the slideshow
                    pauseSlideshow();

                    // Show the clicked slide
                    showSlide(index);

                    // Resume slideshow after 10 seconds of inactivity
                    setTimeout(resumeSlideshow, 10000);
                });
            });

            // Add event listener for the pause/play button
            const slideshowToggle = document.getElementById('slideshow-toggle');
            if (slideshowToggle) {
                slideshowToggle.addEventListener('click', function() {
                    const pauseIcon = this.querySelector('.pause-icon');
                    const playIcon = this.querySelector('.play-icon');

                    if (isPaused) {
                        // Resume the slideshow
                        resumeSlideshow();

                        // Show pause icon, hide play icon
                        pauseIcon.classList.remove('hidden');
                        playIcon.classList.add('hidden');
                    } else {
                        // Pause the slideshow
                        pauseSlideshow();

                        // Show play icon, hide pause icon
                        pauseIcon.classList.add('hidden');
                        playIcon.classList.remove('hidden');
                    }
                });
            }

            // Add keyboard navigation support
            document.addEventListener('keydown', function(e) {
                // Only respond to keyboard navigation when the user is viewing the scholarship section
                const scholarshipSection = document.querySelector('.academic-levels-section');
                if (!scholarshipSection || !isElementInViewport(scholarshipSection)) return;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    // Next slide
                    e.preventDefault();
                    pauseSlideshow();
                    let nextIndex = (currentSlideIndex + 1) % academicLevelLinks.length;
                    showSlide(nextIndex);
                    setTimeout(resumeSlideshow, 10000);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    // Previous slide
                    e.preventDefault();
                    pauseSlideshow();
                    let prevIndex = (currentSlideIndex - 1 + academicLevelLinks.length) % academicLevelLinks.length;
                    showSlide(prevIndex);
                    setTimeout(resumeSlideshow, 10000);
                }
            });

            // Helper function to check if an element is in the viewport
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }

            // Add swipe gesture support for mobile devices
            const scholarshipSection = document.querySelector('.academic-levels-section');
            if (scholarshipSection) {
                const swipeDetector = new SwipeDetector(scholarshipSection);

                // Swipe left to go to next slide
                swipeDetector.onSwipeLeft = function(e) {
                    pauseSlideshow();
                    let nextIndex = (currentSlideIndex + 1) % academicLevelLinks.length;
                    showSlide(nextIndex);
                    setTimeout(resumeSlideshow, 10000);
                };

                // Swipe right to go to previous slide
                swipeDetector.onSwipeRight = function(e) {
                    pauseSlideshow();
                    let prevIndex = (currentSlideIndex - 1 + academicLevelLinks.length) % academicLevelLinks.length;
                    showSlide(prevIndex);
                    setTimeout(resumeSlideshow, 10000);
                };
            }

            // Add toggle functionality for navigation help tooltip
            const navHelpToggle = document.getElementById('nav-help-toggle');
            const navHelpTooltip = document.getElementById('nav-help-tooltip');

            if (navHelpToggle && navHelpTooltip) {
                navHelpToggle.addEventListener('click', function() {
                    navHelpTooltip.classList.toggle('hidden');
                });

                // Close tooltip when clicking outside
                document.addEventListener('click', function(e) {
                    if (!navHelpToggle.contains(e.target) && !navHelpTooltip.contains(e.target)) {
                        navHelpTooltip.classList.add('hidden');
                    }
                });

                // Show tooltip briefly on page load to indicate the feature
                setTimeout(() => {
                    navHelpTooltip.classList.remove('hidden');
                    setTimeout(() => {
                        navHelpTooltip.classList.add('hidden');
                    }, 3000);
                }, 2000);
            }

            // Add event listeners for navigation buttons
            const prevSlideButton = document.getElementById('prev-slide');
            const nextSlideButton = document.getElementById('next-slide');

            if (prevSlideButton) {
                prevSlideButton.addEventListener('click', function() {
                    pauseSlideshow();
                    let prevIndex = (currentSlideIndex - 1 + academicLevelLinks.length) % academicLevelLinks.length;
                    showSlide(prevIndex);

                    // Add a subtle animation to the button
                    this.classList.add('scale-90');
                    setTimeout(() => {
                        this.classList.remove('scale-90');
                    }, 150);

                    setTimeout(resumeSlideshow, 10000);
                });
            }

            if (nextSlideButton) {
                nextSlideButton.addEventListener('click', function() {
                    pauseSlideshow();
                    let nextIndex = (currentSlideIndex + 1) % academicLevelLinks.length;
                    showSlide(nextIndex);

                    // Add a subtle animation to the button
                    this.classList.add('scale-90');
                    setTimeout(() => {
                        this.classList.remove('scale-90');
                    }, 150);

                    setTimeout(resumeSlideshow, 10000);
                });
            }
        });
 

    // <!-- Course Categories Slider Script -->
   
        // Function to enhance the scholarship notification badge
        function enhanceScholarshipNotification() {
            const notificationBadges = document.querySelectorAll('.scholarship-notification');
            if (notificationBadges.length === 0) return;

            notificationBadges.forEach(badge => {
                // Add click event to the notification badge
                badge.addEventListener('click', function() {
                    // Redirect to registration page or show a modal
                    window.location.href = 'registration.html';
                });

                // Make the notification badge more interactive
                badge.style.cursor = 'pointer';

                // Add a tooltip-like effect
                badge.setAttribute('title', 'Click to apply for scholarships');
            });

            // Commerce notification handling removed

            // For the main notification badge
            const mainNotificationBadge = document.querySelector('.scholarship-notification');
            if (mainNotificationBadge) {
                // Add a pulsing effect every few seconds to draw attention
                setInterval(() => {
                    mainNotificationBadge.classList.add('scale-110');
                    mainNotificationBadge.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        mainNotificationBadge.classList.remove('scale-110');
                        mainNotificationBadge.style.transform = '';
                    }, 300);
                }, 5000);

                // Randomly change the text to create urgency
                const messages = [
                    "Don't miss! Apply now",
                    "Limited seats! Apply now",
                    "Deadline approaching!",
                    "Few scholarships left!"
                ];

                setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * messages.length);
                    const textSpan = mainNotificationBadge.querySelector('span');
                    if (textSpan) {
                        // Add a fade-out effect
                        textSpan.style.opacity = '0';
                        textSpan.style.transform = 'translateY(5px)';

                        // Change the text after a short delay
                        setTimeout(() => {
                            textSpan.textContent = messages[randomIndex];
                            // Add a fade-in effect
                            textSpan.style.opacity = '1';
                            textSpan.style.transform = 'translateY(0)';
                        }, 300);
                    }
                }, 8000);

                // Add transition for smooth text change
                const textSpan = mainNotificationBadge.querySelector('span');
                if (textSpan) {
                    textSpan.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                }
            }
        }

        // Function to enhance the course categories slider
        function enhanceCourseSlider() {
            const courseTrack = document.querySelector('.course-track');
            const categoryCards = document.querySelectorAll('.category-card');

            if (!courseTrack || categoryCards.length === 0) return;

            // Set animation delay for each card to create staggered floating effect
            categoryCards.forEach((card, index) => {
                // Set custom property for animation delay
                card.style.setProperty('--card-index', index);

                // Add entrance animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 + (index * 150)); // Staggered entrance
            });

            // Add hover effect to pause animation
            courseTrack.addEventListener('mouseenter', function() {
                this.style.animationPlayState = 'paused';
            });

            courseTrack.addEventListener('mouseleave', function() {
                this.style.animationPlayState = 'running';
            });

            // Add touch event handling for mobile devices
            let touchStartX = 0;
            let touchEndX = 0;

            courseTrack.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
                this.style.animationPlayState = 'paused';
            }, { passive: true });

            courseTrack.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                this.style.animationPlayState = 'running';

                // Calculate swipe distance
                const swipeDistance = touchEndX - touchStartX;

                // If significant swipe, manually adjust the position
                if (Math.abs(swipeDistance) > 50) {
                    const currentTransform = getComputedStyle(this).transform;
                    const matrix = new DOMMatrix(currentTransform);
                    const currentX = matrix.m41; // Current X translation

                    // Apply manual translation based on swipe
                    this.style.transform = `translateX(${currentX + swipeDistance}px)`;

                    // Reset animation after a short delay
                    setTimeout(() => {
                        this.style.transition = 'none';
                        this.style.transform = '';
                        // Force reflow
                        void this.offsetWidth;
                        this.style.transition = '';
                    }, 300);
                }
            }, { passive: true });

            // Add enhanced hover effects to category cards
            categoryCards.forEach(card => {
                const categoryIcon = card.querySelector('.category-icon');
                const categoryName = card.querySelector('.category-name');
                const applyButton = card.querySelector('.apply-button');

                // Create shine effect element for each card
                const shineEffect = document.createElement('div');
                shineEffect.classList.add('shine-effect');
                shineEffect.style.position = 'absolute';
                shineEffect.style.top = '0';
                shineEffect.style.left = '0';
                shineEffect.style.width = '100%';
                shineEffect.style.height = '100%';
                shineEffect.style.background = 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)';
                shineEffect.style.transform = 'translateX(-100%) rotate(45deg)';
                shineEffect.style.transition = 'transform 0.5s ease';
                shineEffect.style.zIndex = '1';
                shineEffect.style.pointerEvents = 'none';

                const cardShape = card.querySelector('.category-shape');
                cardShape.style.position = 'relative';
                cardShape.style.overflow = 'hidden';
                cardShape.appendChild(shineEffect);

                card.addEventListener('mouseenter', function() {
                    // Stop the floating animation and apply hover transform
                    this.style.animation = 'none';
                    this.style.transform = 'translateY(-15px) scale(1.05)';

                    // Trigger shine effect
                    shineEffect.style.transform = 'translateX(100%) rotate(45deg)';

                    // Enhance icon
                    if (categoryIcon) {
                        categoryIcon.style.transform = 'scale(1.2) rotate(5deg)';
                        categoryIcon.style.boxShadow = '0 12px 25px rgba(124, 58, 237, 0.4)';
                    }

                    // Enhance category name
                    if (categoryName) {
                        categoryName.style.transform = 'scale(1.05)';
                        categoryName.style.color = '#5b21b6';
                    }

                    // Enhance apply button
                    if (applyButton) {
                        applyButton.style.animation = 'buttonPulse 2s infinite';
                        applyButton.style.transform = 'scale(1.1)';
                        applyButton.style.background = '#6d28d9';
                    }
                });

                card.addEventListener('mouseleave', function() {
                    // Restore floating animation
                    this.style.animation = 'floatCard 6s ease-in-out infinite';
                    this.style.animationDelay = `calc(var(--card-index, 0) * 0.5s)`;
                    this.style.transform = '';

                    // Reset shine effect
                    shineEffect.style.transform = 'translateX(-100%) rotate(45deg)';

                    // Reset icon
                    if (categoryIcon) {
                        categoryIcon.style.transform = '';
                        categoryIcon.style.boxShadow = '';
                    }

                    // Reset category name
                    if (categoryName) {
                        categoryName.style.transform = '';
                        categoryName.style.color = '';
                    }

                    // Reset apply button
                    if (applyButton) {
                        applyButton.style.animation = '';
                        applyButton.style.transform = '';
                        applyButton.style.background = '';
                    }
                });

                // Add click effect with ripple
                card.addEventListener('click', function(e) {
                    // Create ripple effect
                    const ripple = document.createElement('div');
                    ripple.classList.add('ripple-effect');

                    const rect = cardShape.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    ripple.style.position = 'absolute';
                    ripple.style.width = '10px';
                    ripple.style.height = '10px';
                    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                    ripple.style.borderRadius = '50%';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.style.pointerEvents = 'none';
                    ripple.style.zIndex = '2';

                    cardShape.appendChild(ripple);

                    // Animate ripple
                    ripple.animate(
                        [
                            { transform: 'scale(0)', opacity: 1 },
                            { transform: 'scale(40)', opacity: 0 }
                        ],
                        {
                            duration: 600,
                            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                        }
                    );

                    // Remove ripple after animation
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);

                    // Card click animation
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        }

        // Add pulse animation for apply buttons
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Call the functions when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            enhanceScholarshipNotification();
            enhanceCourseSlider();
        });
  
    // <!-- Circular Diagram Animation Script -->
 
        document.addEventListener('DOMContentLoaded', function() {
            // Get all course bubbles
            const courseBubbles = document.querySelectorAll('.course-bubble');
            const centerCircle = document.querySelector('.center-circle');
            const orbitContainer = document.querySelector('.orbit-container');

            // Add hover effect to course bubbles
            courseBubbles.forEach((bubble, index) => {
                // Add click event to each bubble
                bubble.addEventListener('click', function() {
                    // Pause the orbit animation
                    orbitContainer.style.animationPlayState = 'paused';

                    // Add active class to the clicked bubble
                    this.classList.add('active');

                    // Scale up the center circle
                    centerCircle.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    centerCircle.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.6)';

                    // Get the course name
                    const courseName = this.querySelector('.course-name').textContent;

                    // Update center circle content
                    const centerContent = `
                        <div class="text-center">
                            <h3 class="text-xl font-bold text-purple-700">${courseName}</h3>
                            <p class="text-sm text-indigo-600">Scholarship Eligible</p>
                        </div>
                    `;

                    centerCircle.innerHTML = centerContent;

                    // Reset after 3 seconds
                    setTimeout(() => {
                        // Resume the orbit animation
                        orbitContainer.style.animationPlayState = 'running';

                        // Remove active class
                        this.classList.remove('active');

                        // Reset center circle
                        centerCircle.style.transform = 'translate(-50%, -50%)';
                        centerCircle.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.3)';

                        // Reset center circle content
                        centerCircle.innerHTML = `
                            <div class="text-center">
                                <h3 class="text-xl font-bold text-purple-700">Scholarship</h3>
                                <p class="text-sm text-indigo-600">Eligible Courses</p>
                            </div>
                        `;
                    }, 3000);
                });

                // Add mouseenter event
                bubble.addEventListener('mouseenter', function() {
                    // Slow down the orbit animation
                    orbitContainer.style.animationPlayState = 'paused';

                    // Scale up this bubble
                    this.style.transform = 'scale(1.2)';
                    this.style.zIndex = '20';

                    // Add glow effect
                    this.style.boxShadow = '0 0 25px rgba(124, 58, 237, 0.5)';
                });

                // Add mouseleave event
                bubble.addEventListener('mouseleave', function() {
                    // Resume the orbit animation
                    orbitContainer.style.animationPlayState = 'running';

                    // Reset this bubble
                    this.style.transform = '';
                    this.style.zIndex = '';

                    // Remove glow effect
                    this.style.boxShadow = '';
                });
            });

            // Add scroll-based animation trigger
            const circularDiagram = document.querySelector('.circular-diagram');
            const popularImgContainer = document.querySelector('.relative.h-110%.overflow-hidden');

            if (circularDiagram && popularImgContainer) {
                // Function to check if element is in viewport
                function isInViewport(element) {
                    const rect = element.getBoundingClientRect();
                    return (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                }

                // Function to handle scroll animation
                function handleScrollAnimation() {
                    if (isInViewport(popularImgContainer)) {
                        // Add animation classes when in viewport
                        circularDiagram.classList.add('animate-in');
                        centerCircle.classList.add('animate-pulse');

                        // Animate each bubble with delay
                        courseBubbles.forEach((bubble, index) => {
                            setTimeout(() => {
                                bubble.classList.add('animate-in');
                            }, index * 200);
                        });
                    }
                }

                // Add scroll event listener
                window.addEventListener('scroll', handleScrollAnimation);

                // Run once on page load
                handleScrollAnimation();
            }
        });

       const track = document.querySelector('.carousel-track');
let scrollInterval;

// Clone items to create seamless loop
const items = document.querySelectorAll('.video-item');
items.forEach(item => {
  const clone = item.cloneNode(true);
  track.appendChild(clone);
});

// Auto-scroll function
function startAutoScroll() {
  scrollInterval = setInterval(() => {
    track.scrollLeft += 1; // speed (px per tick)
    // When reaching half (original + clones), reset smoothly
    if (track.scrollLeft >= track.scrollWidth / 2) {
      track.scrollLeft = 0;
    }
  }, 20); // adjust speed (lower = faster)
}

// Stop auto-scroll
function stopAutoScroll() {
  clearInterval(scrollInterval);
}

// Start on load
startAutoScroll();

// Pause on hover
track.addEventListener('mouseenter', stopAutoScroll);
track.addEventListener('mouseleave', startAutoScroll);

