// Enhanced fix for iOS 100vh issue and mobile responsiveness
// This script sets a CSS variable --vh to the actual viewport height
// which can be used instead of 100vh in CSS

function setViewportHeight() {
    // First we get the viewport height and multiply it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Set the hero height directly as well for maximum compatibility
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        // Get the navbar element or its container
        const navbar = document.querySelector('nav') || document.querySelector('header') || document.querySelector('.navbar-container');
        // Get the actual navbar height, default to 64px if not found
        const navbarHeight = navbar ? navbar.offsetHeight : 64;
        // Calculate exact height
        const exactHeight = window.innerHeight - navbarHeight;

        // Check device width for responsive adjustments
        const isVerySmallMobile = window.innerWidth <= 320;
        const isExtraSmallMobile = window.innerWidth <= 360 && window.innerWidth > 320;
        const isSmallMobile = window.innerWidth <= 480 && window.innerWidth > 360;
        const isMediumMobile = window.innerWidth <= 767 && window.innerWidth > 480;
        const isTablet = window.innerWidth <= 991 && window.innerWidth > 767;

        // Apply different styles based on device width
        if (isVerySmallMobile || isExtraSmallMobile || isSmallMobile) {
            // For small mobile devices, allow scrolling
            heroSection.style.height = 'auto';
            heroSection.style.minHeight = 'auto';
            heroSection.style.maxHeight = 'none';
            heroSection.style.overflow = 'visible';
            heroSection.style.overflowY = 'auto';
            heroSection.style.display = 'block';

            // Ensure proper positioning
            heroSection.style.position = 'relative';
            heroSection.style.left = '0';
            heroSection.style.right = '0';
            heroSection.style.width = '100%';
            heroSection.style.maxWidth = '100%';
            heroSection.style.boxSizing = 'border-box';

            // Add padding to ensure content is visible
            heroSection.style.paddingTop = '0.5rem';
            heroSection.style.paddingBottom = '0.5rem';

            // Make sure content is visible - updated selector to match new structure
            const heroContent = heroSection.querySelector('.w-full.relative.z-10') ||
                               heroSection.querySelector('.container.mx-auto');
            if (heroContent) {
                heroContent.style.height = 'auto';
                heroContent.style.minHeight = 'auto';
                heroContent.style.overflow = 'visible';
                heroContent.style.overflowY = 'visible';
                heroContent.style.width = '100%';
                heroContent.style.maxWidth = '100%';
                heroContent.style.boxSizing = 'border-box';
            }

            // Fix for flex layouts
            const flexContainers = heroSection.querySelectorAll('.flex-col, .flex-row');
            flexContainers.forEach(container => {
                container.style.width = '100%';
                container.style.maxWidth = '100%';
                container.style.boxSizing = 'border-box';
            });

            // Fix for grid layouts
            const gridContainers = heroSection.querySelectorAll('.grid');
            gridContainers.forEach(container => {
                container.style.width = '100%';
                container.style.maxWidth = '100%';
                container.style.boxSizing = 'border-box';
            });

            // Fix grid columns for mobile
            const gridCols12 = heroSection.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
            if (gridCols12) {
                gridCols12.style.display = 'grid';
                gridCols12.style.gridTemplateColumns = '1fr';
                gridCols12.style.gap = isVerySmallMobile ? '0.75rem' : '1rem';
            }

            // Fix grid columns spans
            const colSpan7 = heroSection.querySelector('.lg\\:col-span-7');
            const colSpan5 = heroSection.querySelector('.lg\\:col-span-5');

            if (colSpan7) {
                colSpan7.style.gridColumn = 'span 1 / span 1';
                colSpan7.style.width = '100%';
            }

            if (colSpan5) {
                colSpan5.style.gridColumn = 'span 1 / span 1';
                colSpan5.style.width = '100%';
            }

            // Fix for very small screens
            if (isVerySmallMobile) {
                // Convert 2-column grid to 1-column for very small screens
                const statGrids = heroSection.querySelectorAll('.grid.grid-cols-2');
                statGrids.forEach(grid => {
                    grid.style.gridTemplateColumns = 'repeat(1, 1fr)';
                    grid.style.gap = '0.5rem';
                });

                // Reduce padding for very small screens
                const paddedElements = heroSection.querySelectorAll('[class*="p-"]');
                paddedElements.forEach(el => {
                    el.style.padding = '0.5rem';
                });

                // Reduce font sizes for very small screens
                const headings = heroSection.querySelectorAll('h1, h2, h3, .text-3xl, .text-4xl, .text-5xl, .text-6xl, .text-7xl');
                headings.forEach(heading => {
                    heading.style.fontSize = '1.5rem';
                    heading.style.lineHeight = '1.2';
                    heading.style.width = '100%';
                });

                const paragraphs = heroSection.querySelectorAll('p, .text-base, .text-lg, .text-xl');
                paragraphs.forEach(p => {
                    p.style.fontSize = '0.875rem';
                    p.style.lineHeight = '1.4';
                    p.style.width = '100%';
                });

                // Fix stat cards
                const statCards = heroSection.querySelectorAll('.group.bg-white\\/10');
                statCards.forEach(card => {
                    card.style.padding = '0.4rem';
                });

                // Fix buttons
                const buttons = heroSection.querySelectorAll('a.group, a.inline-flex, button.inline-flex');
                buttons.forEach(button => {
                    button.style.padding = '0.4rem 0.6rem';
                    button.style.fontSize = '0.8rem';
                });
            }

            console.log(`Mobile viewport detected: Set hero to scrollable (viewport: ${window.innerWidth}x${window.innerHeight}px)`);
        } else if (isMediumMobile || isTablet) {
            // For medium mobile and tablet devices
            heroSection.style.height = 'auto';
            heroSection.style.minHeight = 'auto';
            heroSection.style.maxHeight = 'none';
            heroSection.style.overflow = 'visible';
            heroSection.style.overflowY = 'auto';
            heroSection.style.display = 'block';

            // Ensure proper positioning
            heroSection.style.position = 'relative';
            heroSection.style.left = '0';
            heroSection.style.right = '0';
            heroSection.style.width = '100%';
            heroSection.style.maxWidth = '100%';
            heroSection.style.boxSizing = 'border-box';

            // Add padding to ensure content is visible
            heroSection.style.paddingTop = '0.5rem';
            heroSection.style.paddingBottom = '0.5rem';

            // Fix grid columns for mobile
            const gridCols12 = heroSection.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
            if (gridCols12) {
                gridCols12.style.display = 'grid';
                gridCols12.style.gridTemplateColumns = '1fr';
                gridCols12.style.gap = '1.5rem';
            }

            // Fix grid columns spans
            const colSpan7 = heroSection.querySelector('.lg\\:col-span-7');
            const colSpan5 = heroSection.querySelector('.lg\\:col-span-5');

            if (colSpan7) {
                colSpan7.style.gridColumn = 'span 1 / span 1';
                colSpan7.style.width = '100%';
            }

            if (colSpan5) {
                colSpan5.style.gridColumn = 'span 1 / span 1';
                colSpan5.style.width = '100%';
            }

            // Center content on medium devices
            const textElements = heroSection.querySelectorAll('.lg\\:text-left');
            textElements.forEach(el => {
                el.style.textAlign = 'center';
            });

            const justifyElements = heroSection.querySelectorAll('.lg\\:justify-start');
            justifyElements.forEach(el => {
                el.style.justifyContent = 'center';
            });

            // Adjust font sizes for medium devices
            const headings = heroSection.querySelectorAll('.text-4xl, .text-5xl, .text-6xl, .text-7xl');
            headings.forEach(heading => {
                heading.style.fontSize = '2rem';
                heading.style.lineHeight = '1.2';
            });

            console.log(`Medium/Tablet viewport detected: Set hero to auto height (viewport: ${window.innerWidth}x${window.innerHeight}px)`);
        } else {
            // For larger screens, use fixed height
            // Apply the height directly to the hero section
            heroSection.style.height = `${exactHeight}px`;
            heroSection.style.minHeight = `${exactHeight}px`;
            heroSection.style.maxHeight = `${exactHeight}px`;

            // Ensure proper positioning and prevent expansion
            heroSection.style.position = 'relative';
            heroSection.style.left = '0';
            heroSection.style.right = '0';
            heroSection.style.overflow = 'hidden';

            // Additional properties to prevent expansion when scrolling up
            heroSection.style.flexShrink = '0';
            heroSection.style.flexGrow = '0';
            heroSection.style.transform = 'translateZ(0)';
            heroSection.style.willChange = 'transform';

            // Force the hero section to maintain its fixed height
            heroSection.style.boxSizing = 'border-box';
            heroSection.style.display = 'flex';
            heroSection.style.flexDirection = 'column';

            // Check if we're currently handling scroll-up
            const scrollDirection = heroSection.getAttribute('data-scroll-direction');
            if (scrollDirection === 'up') {
                // Apply extra fixes for scroll-up scenario
                heroSection.style.contain = 'layout size';
            }

            console.log(`Desktop viewport: Set hero height to ${exactHeight}px (viewport: ${window.innerHeight}px, navbar: ${navbarHeight}px)`);
        }

        // Set a data attribute to indicate the hero has been sized
        heroSection.setAttribute('data-viewport-sized', 'true');
        // Add viewport size as data attribute for debugging
        heroSection.setAttribute('data-viewport-width', window.innerWidth);
        heroSection.setAttribute('data-viewport-height', window.innerHeight);
    }

    // Also set a data attribute on body for potential CSS targeting
    document.body.setAttribute('data-viewport-width', window.innerWidth);
    document.body.setAttribute('data-viewport-height', window.innerHeight);

    // Special handling for very small screens - updated breakpoints
    if (window.innerWidth <= 320) {
        document.body.classList.add('very-small-screen');
        document.body.classList.remove('small-mobile-screen');
        document.body.classList.remove('xs-screen');
    } else if (window.innerWidth <= 360) {
        document.body.classList.remove('very-small-screen');
        document.body.classList.add('xs-screen');
        document.body.classList.remove('small-mobile-screen');
    } else if (window.innerWidth <= 480) {
        document.body.classList.remove('very-small-screen');
        document.body.classList.remove('xs-screen');
        document.body.classList.add('small-mobile-screen');
    } else {
        document.body.classList.remove('very-small-screen');
        document.body.classList.remove('xs-screen');
        document.body.classList.remove('small-mobile-screen');
    }
}

// Set the height initially
setViewportHeight();

// Update the height on resize and orientation change
window.addEventListener('resize', debounce(setViewportHeight, 100));
window.addEventListener('orientationchange', function() {
    // Small delay to ensure the browser has completed the orientation change
    setTimeout(setViewportHeight, 200);
});

// Make sure to set the height when the page is fully loaded
window.addEventListener('load', function() {
    // Run multiple times to ensure it catches any delayed rendering
    setTimeout(setViewportHeight, 0);
    setTimeout(setViewportHeight, 100);
    setTimeout(setViewportHeight, 500);
    setTimeout(setViewportHeight, 1000);
});

// Additional fix for mobile browsers address bar showing/hiding
let lastVh = window.innerHeight;
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    // Get current scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Only update if the height actually changed by a significant amount
    // This prevents constant updates during normal scrolling
    if (Math.abs(lastVh - window.innerHeight) > 50) {
        setViewportHeight();
        lastVh = window.innerHeight;
    }

    // Ensure hero section maintains fixed height during scroll
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const navbar = document.querySelector('nav') || document.querySelector('header') || document.querySelector('.navbar-container');
        const navbarHeight = navbar ? navbar.offsetHeight : 64;
        const exactHeight = window.innerHeight - navbarHeight;

        // Check device width for responsive adjustments
        const isVerySmallMobile = window.innerWidth <= 320;
        const isExtraSmallMobile = window.innerWidth <= 360 && window.innerWidth > 320;
        const isSmallMobile = window.innerWidth <= 480 && window.innerWidth > 360;
        const isMediumMobile = window.innerWidth <= 767 && window.innerWidth > 480;
        const isTablet = window.innerWidth <= 991 && window.innerWidth > 767;

        // Apply different styles based on device width
        if (isVerySmallMobile || isExtraSmallMobile || isSmallMobile || isMediumMobile || isTablet) {
            // For mobile devices, allow scrolling
            heroSection.style.height = 'auto';
            heroSection.style.minHeight = 'auto';
            heroSection.style.maxHeight = 'none';
            heroSection.style.overflow = 'visible';
            heroSection.style.overflowY = 'auto';
            heroSection.style.display = 'block';

            // Ensure proper positioning
            heroSection.style.position = 'relative';
            heroSection.style.left = '0';
            heroSection.style.right = '0';
            heroSection.style.width = '100%';
            heroSection.style.maxWidth = '100%';
            heroSection.style.boxSizing = 'border-box';

            // Add padding to ensure content is visible
            heroSection.style.paddingTop = '0.5rem';
            heroSection.style.paddingBottom = '0.5rem';

            // Make sure content is visible - updated selector to match new structure
            const heroContent = heroSection.querySelector('.w-full.relative.z-10') ||
                               heroSection.querySelector('.container.mx-auto');
            if (heroContent) {
                heroContent.style.height = 'auto';
                heroContent.style.minHeight = 'auto';
                heroContent.style.overflow = 'visible';
                heroContent.style.overflowY = 'visible';
                heroContent.style.width = '100%';
                heroContent.style.maxWidth = '100%';
                heroContent.style.boxSizing = 'border-box';
                heroContent.style.display = 'block';
                heroContent.style.padding = '0.25rem';
            }


          

            // Fix for flex layouts
            const flexContainers = heroSection.querySelectorAll('.flex-col, .flex-row');
            flexContainers.forEach(container => {
                container.style.width = '100%';
                container.style.maxWidth = '100%';
                container.style.boxSizing = 'border-box';
            });

            // Fix for grid layouts
            const gridContainers = heroSection.querySelectorAll('.grid');
            gridContainers.forEach(container => {
                container.style.width = '100%';
                container.style.maxWidth = '100%';
                container.style.boxSizing = 'border-box';
            });

            // Fix grid columns for mobile
            const gridCols12 = heroSection.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
            if (gridCols12) {
                gridCols12.style.display = 'grid';
                gridCols12.style.gridTemplateColumns = '1fr';
                gridCols12.style.gap = isVerySmallMobile ? '0.75rem' : '1rem';
            }

            // Fix grid columns spans
            const colSpan7 = heroSection.querySelector('.lg\\:col-span-7');
            const colSpan5 = heroSection.querySelector('.lg\\:col-span-5');

            if (colSpan7) {
                colSpan7.style.gridColumn = 'span 1 / span 1';
                colSpan7.style.width = '100%';
            }

            if (colSpan5) {
                colSpan5.style.gridColumn = 'span 1 / span 1';
                colSpan5.style.width = '100%';
            }

            // Update data attribute
            heroSection.setAttribute('data-scroll-direction', scrollTop < lastScrollTop ? 'up' : 'down');
            heroSection.setAttribute('data-mobile', 'true');

            // Set specific attributes for device size
            if (isVerySmallMobile) {
                heroSection.setAttribute('data-device-size', 'very-small-mobile');

                // Convert 2-column grid to 1-column for very small screens
                const statGrids = heroSection.querySelectorAll('.grid.grid-cols-2');
                statGrids.forEach(grid => {
                    grid.style.gridTemplateColumns = 'repeat(1, 1fr)';
                    grid.style.gap = '0.5rem';
                });

                // Reduce padding for very small screens
                const paddedElements = heroSection.querySelectorAll('[class*="p-"]');
                paddedElements.forEach(el => {
                    el.style.padding = '0.5rem';
                });

                // Reduce font sizes for very small screens
                const headings = heroSection.querySelectorAll('h1, h2, h3, .text-3xl, .text-4xl, .text-5xl, .text-6xl, .text-7xl');
                headings.forEach(heading => {
                    heading.style.fontSize = '1.5rem';
                    heading.style.lineHeight = '1.2';
                    heading.style.width = '100%';
                });

                const paragraphs = heroSection.querySelectorAll('p, .text-base, .text-lg, .text-xl');
                paragraphs.forEach(p => {
                    p.style.fontSize = '0.875rem';
                    p.style.lineHeight = '1.4';
                    p.style.width = '100%';
                });

                // Fix stat cards
                const statCards = heroSection.querySelectorAll('.group.bg-white\\/10');
                statCards.forEach(card => {
                    card.style.padding = '0.4rem';
                });

                // Fix buttons
                const buttons = heroSection.querySelectorAll('a.group, a.inline-flex, button.inline-flex');
                buttons.forEach(button => {
                    button.style.padding = '0.4rem 0.6rem';
                    button.style.fontSize = '0.8rem';
                });
            } else if (isExtraSmallMobile) {
                heroSection.setAttribute('data-device-size', 'extra-small-mobile');

                // Adjust font sizes for extra small mobile
                const headings = heroSection.querySelectorAll('.text-4xl, .text-5xl, .text-6xl, .text-7xl');
                headings.forEach(heading => {
                    heading.style.fontSize = '1.75rem';
                    heading.style.lineHeight = '1.2';
                });
            } else if (isSmallMobile) {
                heroSection.setAttribute('data-device-size', 'small-mobile');

                // Adjust font sizes for small mobile
                const headings = heroSection.querySelectorAll('.text-4xl, .text-5xl, .text-6xl, .text-7xl');
                headings.forEach(heading => {
                    heading.style.fontSize = '1.75rem';
                    heading.style.lineHeight = '1.2';
                });
            } else if (isMediumMobile) {
                heroSection.setAttribute('data-device-size', 'medium-mobile');

                // Adjust font sizes for medium mobile
                const headings = heroSection.querySelectorAll('.text-4xl, .text-5xl, .text-6xl, .text-7xl');
                headings.forEach(heading => {
                    heading.style.fontSize = '2rem';
                    heading.style.lineHeight = '1.2';
                });
            } else if (isTablet) {
                heroSection.setAttribute('data-device-size', 'tablet');
            }
        } else {
            // Apply more aggressive height fixing when scrolling up
            if (scrollTop < lastScrollTop) {
                // Scrolling UP - this is where the issue occurs
                heroSection.style.height = `${exactHeight}px`;
                heroSection.style.minHeight = `${exactHeight}px`;
                heroSection.style.maxHeight = `${exactHeight}px`;
                heroSection.style.overflow = 'hidden';
                heroSection.style.flexShrink = '0';
                heroSection.style.flexGrow = '0';
                heroSection.style.position = 'relative';
                heroSection.style.boxSizing = 'border-box';

                // Force repaint to ensure changes take effect
                heroSection.style.transform = 'translateZ(0)';

                // Add a data attribute to indicate we're handling scroll-up
                heroSection.setAttribute('data-scroll-direction', 'up');
                heroSection.setAttribute('data-mobile', 'false');
                heroSection.setAttribute('data-device-size', 'desktop');
            } else {
                // Scrolling DOWN - normal behavior
                heroSection.style.height = `${exactHeight}px`;
                heroSection.style.minHeight = `${exactHeight}px`;
                heroSection.style.maxHeight = `${exactHeight}px`;
                heroSection.style.overflow = 'hidden';

                // Update data attribute
                heroSection.setAttribute('data-scroll-direction', 'down');
                heroSection.setAttribute('data-mobile', 'false');
                heroSection.setAttribute('data-device-size', 'desktop');
            }
        }
    }

    // Update last scroll position
    lastScrollTop = scrollTop;
});

// Fix for mobile touch delay
document.addEventListener('touchstart', function() {}, {passive: true});

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Add special handling for iOS devices
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    document.body.classList.add('ios-device');

    // Force hero section to display properly on iOS
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.height = 'auto';
        heroSection.style.minHeight = 'auto';
        heroSection.style.maxHeight = 'none';
        heroSection.style.display = 'block';
        heroSection.style.overflow = 'visible';
        heroSection.style.overflowY = 'auto';
    }

    // Special fix for iOS Safari viewport issues
    window.addEventListener('focusin', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            // When focusing on form elements, iOS may resize the viewport
            setTimeout(setViewportHeight, 300);
        }
    });

    window.addEventListener('focusout', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            // When blurring form elements, iOS may resize the viewport back
            setTimeout(setViewportHeight, 300);
        }
    });

    // Additional fix for iOS orientation change
    window.addEventListener('orientationchange', function() {
        // Force hero section to display properly after orientation change
        setTimeout(function() {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.style.height = 'auto';
                heroSection.style.minHeight = 'auto';
                heroSection.style.maxHeight = 'none';
                heroSection.style.display = 'block';
                heroSection.style.overflow = 'visible';
                heroSection.style.overflowY = 'auto';
            }
        }, 300);
    });
}
