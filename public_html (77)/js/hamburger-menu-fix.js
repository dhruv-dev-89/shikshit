// Comprehensive Hamburger Menu Fix
// This script ensures the mobile menu toggle works correctly across all pages
// Handles multiple ID scenarios and prevents conflicts

(function() {
    'use strict';

    console.log("Comprehensive Hamburger Menu Fix: Loading...");

    // Prevent multiple initializations
    if (window.hamburgerMenuFixed) {
        console.log("Hamburger menu already fixed, skipping...");
        return;
    }

    // Function to find mobile menu elements with multiple fallbacks
    function findMobileMenuElements() {
        // Try multiple possible selectors for the mobile menu button
        const mobileMenuButton = document.getElementById('mobile-menu-toggle') ||
                                document.getElementById('mobile-menu-button') ||
                                document.querySelector('.mobile-menu-button') ||
                                document.querySelector('.mobile-menu-toggle') ||
                                document.querySelector('[aria-label="Toggle mobile menu"]') ||
                                document.querySelector('button[class*="lg:hidden"]') ||
                                document.querySelector('nav button') ||
                                document.querySelector('[onclick*="toggleMobileMenu"]');

        const mobileMenu = document.getElementById('mobile-menu') ||
                          document.getElementById('mobileMenu') ||
                          document.querySelector('.mobile-menu') ||
                          document.querySelector('[class*="lg:hidden"][class*="hidden"]');

        const menuOpenIcon = document.getElementById('menu-open-icon') ||
                           document.querySelector('[class*="menu-open"]') ||
                           mobileMenuButton?.querySelector('svg:not(.hidden)');

        const menuCloseIcon = document.getElementById('menu-close-icon') ||
                            document.querySelector('[class*="menu-close"]') ||
                            mobileMenuButton?.querySelector('svg.hidden');

        return { mobileMenuButton, mobileMenu, menuOpenIcon, menuCloseIcon };
    }

    // Function to fix the mobile menu toggle
    function fixMobileMenuToggle() {
        console.log("Comprehensive Hamburger Menu Fix: Attempting to fix mobile menu...");

        const { mobileMenuButton, mobileMenu, menuOpenIcon, menuCloseIcon } = findMobileMenuElements();

        if (!mobileMenuButton) {
            console.log("Comprehensive Hamburger Menu Fix: Mobile menu button not found, will retry...");
            return false;
        }

        if (!mobileMenu) {
            console.log("Comprehensive Hamburger Menu Fix: Mobile menu not found, will retry...");
            return false;
        }

        console.log("Comprehensive Hamburger Menu Fix: Mobile menu elements found, setting up...");

        // Ensure mobile menu has proper styling
        if (mobileMenu) {
            mobileMenu.style.position = mobileMenu.style.position || 'absolute';
            mobileMenu.style.top = mobileMenu.style.top || '64px';
            mobileMenu.style.left = mobileMenu.style.left || '0';
            mobileMenu.style.width = mobileMenu.style.width || '100%';
            mobileMenu.style.zIndex = mobileMenu.style.zIndex || '50';
            mobileMenu.style.backgroundColor = mobileMenu.style.backgroundColor || 'white';
            if (!mobileMenu.style.boxShadow) {
                mobileMenu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }
        }

        // Define the comprehensive toggle function that handles both approaches
        function toggleMobileMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            console.log("Comprehensive Hamburger Menu Fix: Toggle function called");

            // Detect which approach this page uses
            const usesActiveClass = mobileMenu.id === 'mobileMenu'; // Home.html style
            const usesHiddenClass = mobileMenu.id === 'mobile-menu'; // nsmas_navbar.html style

            console.log("Comprehensive Hamburger Menu Fix: Using", usesActiveClass ? "active class approach" : "hidden class approach");

            let isHidden;

            if (usesActiveClass) {
                // Home.html approach - uses 'active' class
                isHidden = !mobileMenu.classList.contains('active');

                if (isHidden) {
                    // Show menu
                    mobileMenu.classList.add('active');
                    mobileMenuButton.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    console.log("Comprehensive Hamburger Menu Fix: Menu opened (active class)");
                } else {
                    // Hide menu
                    mobileMenu.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                    document.body.style.overflow = '';
                    console.log("Comprehensive Hamburger Menu Fix: Menu closed (active class)");
                }
            } else {
                // nsmas_navbar.html approach - uses 'hidden' class
                isHidden = mobileMenu.classList.contains('hidden') ||
                          mobileMenu.style.display === 'none' ||
                          mobileMenu.style.visibility === 'hidden' ||
                          !mobileMenu.style.display ||
                          mobileMenu.offsetHeight === 0;

                if (isHidden) {
                    // Show menu
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.style.display = 'block';
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.visibility = 'visible';
                    mobileMenu.style.transform = 'translateY(0)';

                    // Toggle icons if they exist
                    if (menuOpenIcon && menuCloseIcon) {
                        menuOpenIcon.classList.add('hidden');
                        menuCloseIcon.classList.remove('hidden');
                    } else if (menuOpenIcon) {
                        menuOpenIcon.style.display = 'none';
                    } else if (menuCloseIcon) {
                        menuCloseIcon.style.display = 'block';
                    }

                    // Update aria-expanded
                    mobileMenuButton.setAttribute('aria-expanded', 'true');

                    // Disable body scrolling
                    document.body.style.overflow = 'hidden';

                    console.log("Comprehensive Hamburger Menu Fix: Menu opened (hidden class)");
                } else {
                    // Hide menu
                    mobileMenu.classList.add('hidden');
                    mobileMenu.style.display = 'none';
                    mobileMenu.style.opacity = '0';
                    mobileMenu.style.visibility = 'hidden';
                    mobileMenu.style.transform = 'translateY(-8px)';

                    // Toggle icons if they exist
                    if (menuOpenIcon && menuCloseIcon) {
                        menuOpenIcon.classList.remove('hidden');
                        menuCloseIcon.classList.add('hidden');
                    } else if (menuOpenIcon) {
                        menuOpenIcon.style.display = 'block';
                    } else if (menuCloseIcon) {
                        menuCloseIcon.style.display = 'none';
                    }

                    // Update aria-expanded
                    mobileMenuButton.setAttribute('aria-expanded', 'false');

                    // Enable body scrolling
                    document.body.style.overflow = '';

                    console.log("Comprehensive Hamburger Menu Fix: Menu closed (hidden class)");
                }
            }
        }

        // Make toggle function globally available
        window.toggleMobileMenu = toggleMobileMenu;

        // Remove any existing event listeners to avoid duplicates
        const newMobileMenuButton = mobileMenuButton.cloneNode(true);
        mobileMenuButton.parentNode.replaceChild(newMobileMenuButton, mobileMenuButton);

        // Add comprehensive event listeners
        newMobileMenuButton.addEventListener('click', toggleMobileMenu);
        newMobileMenuButton.addEventListener('touchstart', function(e) {
            console.log("Comprehensive Hamburger Menu Fix: Touch event detected");
            e.preventDefault();
            toggleMobileMenu(e);
        }, { passive: false });

        // Fallback onclick handler
        newMobileMenuButton.onclick = toggleMobileMenu;

        // Close menu when clicking on navigation links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log("Comprehensive Hamburger Menu Fix: Navigation link clicked, closing menu");

                // Detect which approach this page uses
                const usesActiveClass = mobileMenu.id === 'mobileMenu';

                if (usesActiveClass) {
                    // Home.html approach
                    mobileMenu.classList.remove('active');
                    newMobileMenuButton.classList.remove('active');
                } else {
                    // nsmas_navbar.html approach
                    mobileMenu.classList.add('hidden');
                    mobileMenu.style.display = 'none';
                    if (menuOpenIcon && menuCloseIcon) {
                        menuOpenIcon.classList.remove('hidden');
                        menuCloseIcon.classList.add('hidden');
                    }
                    newMobileMenuButton.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!newMobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                const usesActiveClass = mobileMenu.id === 'mobileMenu';
                const isMenuOpen = usesActiveClass ?
                    mobileMenu.classList.contains('active') :
                    !mobileMenu.classList.contains('hidden');

                if (isMenuOpen) {
                    toggleMobileMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const usesActiveClass = mobileMenu.id === 'mobileMenu';
                const isMenuOpen = usesActiveClass ?
                    mobileMenu.classList.contains('active') :
                    !mobileMenu.classList.contains('hidden');

                if (isMenuOpen) {
                    toggleMobileMenu();
                }
            }
        });

        // Ensure the mobile menu is properly initialized
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.style.display = 'none';
        }

        console.log("Comprehensive Hamburger Menu Fix: Mobile menu successfully fixed!");
        window.hamburgerMenuFixed = true;
        return true;
    }

    // Initialize the fix
    function initializeFix() {
        // Try to fix immediately
        if (fixMobileMenuToggle()) {
            return;
        }

        // If not successful, try again with delays
        setTimeout(() => {
            if (!window.hamburgerMenuFixed) {
                fixMobileMenuToggle();
            }
        }, 100);

        setTimeout(() => {
            if (!window.hamburgerMenuFixed) {
                fixMobileMenuToggle();
            }
        }, 500);

        setTimeout(() => {
            if (!window.hamburgerMenuFixed) {
                fixMobileMenuToggle();
            }
        }, 1000);

        setTimeout(() => {
            if (!window.hamburgerMenuFixed) {
                fixMobileMenuToggle();
            }
        }, 2000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFix);
    } else {
        initializeFix();
    }

    // Also initialize when window loads
    window.addEventListener('load', () => {
        if (!window.hamburgerMenuFixed) {
            initializeFix();
        }
    });

    // Listen for custom events that might indicate navbar has been loaded
    document.addEventListener('includeHTML:complete', () => {
        console.log("Comprehensive Hamburger Menu Fix: HTML includes complete, reinitializing...");
        if (!window.hamburgerMenuFixed) {
            setTimeout(initializeFix, 100);
        }
    });

})();
