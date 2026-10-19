/* Floating Action Buttons JavaScript */

(function() {
    'use strict';

    // Configuration
    const config = {
        whatsappNumber: '+917905044451', // Replace with actual WhatsApp number
        whatsappMessage: 'Hello! I need assistance with NS-MAS scholarships.',
        supportPage: 'contact.html',
        donatePage: 'donate.html'
    };

    // Initialize floating buttons when DOM is loaded
    function initFloatingButtons() {
        console.log('Initializing floating buttons...');

        // Check if container exists
        const container = document.querySelector('.floating-buttons-container');
        console.log('Floating buttons container found:', !!container);

        if (container) {
            console.log('Container HTML:', container.innerHTML);
        }

        // Wait for buttons to be available
        setTimeout(() => {
            attachEventListeners();
            addAccessibilityFeatures();
            handleMobileOptimizations();
        }, 100);
    }

    // Attach event listeners to buttons
    function attachEventListeners() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const supportBtn = document.getElementById('support-btn');
        const donateBtn = document.getElementById('donate-btn');

        console.log('Floating buttons found:', {
            whatsapp: !!whatsappBtn,
            support: !!supportBtn,
            donate: !!donateBtn
        });

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', handleWhatsAppClick);
            whatsappBtn.addEventListener('touchstart', handleTouchStart);
            console.log('WhatsApp button initialized');
        } else {
            console.error('WhatsApp button not found!');
        }

        if (supportBtn) {
            supportBtn.addEventListener('click', handleSupportClick);
            supportBtn.addEventListener('touchstart', handleTouchStart);
            console.log('Support button initialized');
        } else {
            console.error('Support button not found!');
        }

        if (donateBtn) {
            donateBtn.addEventListener('click', handleDonateClick);
            donateBtn.addEventListener('touchstart', handleTouchStart);
            console.log('Donate button initialized');
        } else {
            console.error('Donate button not found!');
        }

        console.log('Event listeners attached to floating buttons');
    }

    // Handle WhatsApp button click
    function handleWhatsAppClick(event) {
        event.preventDefault();

        const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(config.whatsappMessage)}`;

        // Add click animation
        addClickAnimation(event.currentTarget);

        // Open WhatsApp
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 200);

        console.log('WhatsApp button clicked');
    }

    // Handle Support button click
    function handleSupportClick(event) {
        event.preventDefault();

        // Add click animation
        addClickAnimation(event.currentTarget);

        // Navigate to support page
        setTimeout(() => {
            window.location.href = config.supportPage;
        }, 200);

        console.log('Support button clicked');
    }

    // Handle Donate button click
    function handleDonateClick(event) {
        event.preventDefault();

        // Add click animation
        addClickAnimation(event.currentTarget);

        // Navigate to donate page
        setTimeout(() => {
            window.location.href = config.donatePage;
        }, 200);

        console.log('Donate button clicked');
    }

    // Handle touch start for mobile devices
    function handleTouchStart(event) {
        const button = event.currentTarget;
        button.style.transform = 'scale(0.95)';

        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    // Add click animation
    function addClickAnimation(button) {
        button.style.transform = 'scale(0.9)';
        button.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            button.style.transform = '';
            button.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 100);
    }

    // Add accessibility features
    function addAccessibilityFeatures() {
        const buttons = document.querySelectorAll('.floating-button');

        buttons.forEach(button => {
            // Add ARIA labels
            if (button.id === 'whatsapp-btn') {
                button.setAttribute('aria-label', 'Contact us on WhatsApp');
                button.setAttribute('role', 'button');
                button.setAttribute('tabindex', '0');
            } else if (button.id === 'support-btn') {
                button.setAttribute('aria-label', 'Get support and help');
                button.setAttribute('role', 'button');
                button.setAttribute('tabindex', '0');
            } else if (button.id === 'donate-btn') {
                button.setAttribute('aria-label', 'Make a donation');
                button.setAttribute('role', 'button');
                button.setAttribute('tabindex', '0');
            }

            // Add keyboard support
            button.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    button.click();
                }
            });
        });
    }

    // Handle mobile optimizations
    function handleMobileOptimizations() {
        if (window.innerWidth <= 768) {
            const container = document.querySelector('.floating-buttons-container');
            if (container) {
                // Adjust position for mobile keyboards
                window.addEventListener('resize', function() {
                    if (window.innerHeight < 500) {
                        container.style.bottom = '10px';
                    } else {
                        container.style.bottom = '15px';
                    }
                });
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingButtons);
    } else {
        initFloatingButtons();
    }

    // Also initialize after includeHTML loads content
    window.addEventListener('load', function() {
        setTimeout(initFloatingButtons, 500);
    });

    // Export for manual initialization if needed
    window.initFloatingButtons = initFloatingButtons;

})();
