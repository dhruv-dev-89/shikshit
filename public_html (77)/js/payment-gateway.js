/**
 * Payment Gateway Integration for Sikshit Donation Portal
 * Supports Razorpay payment processing with multiple payment methods
 */

// Payment Gateway Configuration
const PAYMENT_CONFIG = {
    // Replace with your actual Razorpay key
    razorpayKey: 'rzp_test_1234567890', // Test key - replace with live key in production
    currency: 'INR',
    organizationName: 'Sikshit Foundation',
    organizationLogo: './images/sikshitlogo.webp',
    theme: {
        color: '#667eea'
    },
    // Minimum and maximum donation amounts
    minAmount: 100,
    maxAmount: 500000,
    // Supported payment methods
    supportedMethods: ['upi', 'card', 'netbanking', 'wallet']
};

// Payment processing function
function processPayment() {
    const name = document.getElementById('donorName').value.trim();
    const email = document.getElementById('donorEmail').value.trim();
    const phone = document.getElementById('donorPhone').value.trim();

    // Validate amount range
    if (selectedAmount < PAYMENT_CONFIG.minAmount) {
        showError(`Minimum donation amount is ${formatCurrency(PAYMENT_CONFIG.minAmount)}`);
        return;
    }

    if (selectedAmount > PAYMENT_CONFIG.maxAmount) {
        showError(`Maximum donation amount is ${formatCurrency(PAYMENT_CONFIG.maxAmount)}`);
        return;
    }

    // Validate payment method
    if (!PAYMENT_CONFIG.supportedMethods.includes(selectedPaymentMethod)) {
        showError('Selected payment method is not supported.');
        return;
    }

    // Show loading state
    showLoadingState();

    // Create order on server (in production, this should be a server-side call)
    createOrder(selectedAmount, name, email, phone)
        .then(orderData => {
            // Initialize Razorpay payment
            initializeRazorpayPayment(orderData, name, email, phone);
        })
        .catch(error => {
            hideLoadingState();
            showError('Failed to initialize payment. Please try again.');
            console.error('Payment initialization error:', error);
        });
}

// Create order (mock function - replace with actual server call)
function createOrder(amount, name, email, phone) {
    return new Promise((resolve, reject) => {
        // Simulate server call delay
        setTimeout(() => {
            // In production, this should make an actual API call to your server
            // to create a Razorpay order and return the order details
            const orderData = {
                id: 'order_' + Date.now(), // Mock order ID
                amount: amount * 100, // Amount in paise
                currency: PAYMENT_CONFIG.currency,
                receipt: 'receipt_' + Date.now()
            };
            resolve(orderData);
        }, 1000);
    });
}

// Initialize Razorpay payment
function initializeRazorpayPayment(orderData, name, email, phone) {
    const options = {
        key: PAYMENT_CONFIG.razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: PAYMENT_CONFIG.organizationName,
        description: 'Donation for Education',
        image: PAYMENT_CONFIG.organizationLogo,
        order_id: orderData.id,
        prefill: {
            name: name,
            email: email,
            contact: phone
        },
        theme: PAYMENT_CONFIG.theme,
        method: {
            upi: selectedPaymentMethod === 'upi',
            card: selectedPaymentMethod === 'card',
            netbanking: selectedPaymentMethod === 'netbanking',
            wallet: selectedPaymentMethod === 'wallet'
        },
        handler: function(response) {
            // Payment successful
            handlePaymentSuccess(response, orderData);
        },
        modal: {
            ondismiss: function() {
                // Payment cancelled
                hideLoadingState();
                showError('Payment was cancelled. Please try again.');
            }
        }
    };

    // Hide loading state before showing Razorpay modal
    hideLoadingState();

    // Create Razorpay instance and open payment modal
    const rzp = new Razorpay(options);
    rzp.open();

    // Handle payment failure
    rzp.on('payment.failed', function(response) {
        handlePaymentFailure(response);
    });
}

// Handle successful payment
function handlePaymentSuccess(response, orderData) {
    console.log('Payment successful:', response);

    // Log payment success
    logPaymentAttempt(orderData.amount / 100, selectedPaymentMethod, 'success');

    // Show loading state while processing
    showLoadingState();

    // Verify payment on server (mock function)
    verifyPayment(response, orderData)
        .then(verificationResult => {
            hideLoadingState();
            if (verificationResult.success) {
                showSuccess();
                // Send confirmation email (mock)
                sendConfirmationEmail(response, orderData);
                // Track donation analytics
                trackDonation(orderData.amount / 100, selectedPaymentMethod);
            } else {
                showError('Payment verification failed. Please contact support.');
            }
        })
        .catch(error => {
            hideLoadingState();
            showError('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
        });
}

// Handle payment failure
function handlePaymentFailure(response) {
    console.error('Payment failed:', response);

    // Log payment failure
    logPaymentAttempt(selectedAmount, selectedPaymentMethod, 'failed');

    hideLoadingState();

    let errorMessage = 'Payment failed. Please try again.';
    if (response.error && response.error.description) {
        errorMessage = response.error.description;
    }

    showError(errorMessage);
}

// Verify payment (mock function - replace with actual server call)
function verifyPayment(response, orderData) {
    return new Promise((resolve, reject) => {
        // Simulate server verification delay
        setTimeout(() => {
            // In production, verify the payment signature on your server
            // using Razorpay's webhook or verification API
            resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
            });
        }, 2000);
    });
}

// Send confirmation email (mock function)
function sendConfirmationEmail(response, orderData) {
    // In production, trigger email sending from your server
    console.log('Sending confirmation email for payment:', response.razorpay_payment_id);
}

// Track donation analytics
function trackDonation(amount, paymentMethod) {
    // Track donation for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'donation', {
            event_category: 'engagement',
            event_label: paymentMethod,
            value: amount
        });
    }

    console.log(`Donation tracked: ₹${amount} via ${paymentMethod}`);
}

// Show loading state
function showLoadingState() {
    const button = document.getElementById('donateButton');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');
    const loadingDiv = document.getElementById('paymentLoading');

    button.disabled = true;
    buttonText.textContent = 'Processing...';
    buttonSpinner.classList.remove('hidden');
    loadingDiv.classList.add('active');

    // Hide any existing error/success messages
    document.getElementById('paymentError').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'none';
}

// Hide loading state
function hideLoadingState() {
    const button = document.getElementById('donateButton');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');
    const loadingDiv = document.getElementById('paymentLoading');

    button.disabled = false;
    buttonText.textContent = 'MAKE A DIFFERENCE';
    buttonSpinner.classList.add('hidden');
    loadingDiv.classList.remove('active');
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Initialize payment gateway when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
        console.error('Razorpay SDK not loaded. Please check your internet connection.');
        showError('Payment system is currently unavailable. Please try again later.');
    }

    console.log('Payment gateway initialized successfully');
});

// Additional utility functions

// Generate receipt number
function generateReceiptNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SIKSHIT-${timestamp}-${random}`;
}

// Validate PAN number (for tax benefits)
function validatePAN(pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
}

// Calculate tax benefit (80G deduction)
function calculateTaxBenefit(amount) {
    // 50% tax benefit under section 80G
    return Math.floor(amount * 0.5);
}

// Format phone number for display
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return phone;
}

// Check if payment gateway is available
function isPaymentGatewayAvailable() {
    return typeof Razorpay !== 'undefined';
}

// Get payment method display name
function getPaymentMethodName(method) {
    const methodNames = {
        'upi': 'UPI',
        'card': 'Credit/Debit Card',
        'netbanking': 'Net Banking',
        'wallet': 'Digital Wallet'
    };
    return methodNames[method] || method;
}

// Log payment attempt for analytics
function logPaymentAttempt(amount, method, status) {
    const logData = {
        timestamp: new Date().toISOString(),
        amount: amount,
        method: method,
        status: status,
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };

    console.log('Payment attempt logged:', logData);

    // In production, send this data to your analytics service
    // Example: sendToAnalytics(logData);
}

// Export functions for global access
window.processPayment = processPayment;
window.formatCurrency = formatCurrency;
window.generateReceiptNumber = generateReceiptNumber;
window.validatePAN = validatePAN;
window.calculateTaxBenefit = calculateTaxBenefit;
window.formatPhoneNumber = formatPhoneNumber;
window.isPaymentGatewayAvailable = isPaymentGatewayAvailable;
window.getPaymentMethodName = getPaymentMethodName;
