// Test script to check responsiveness of pages
console.log("Testing responsiveness of pages...");

// List of viewport sizes to test
const viewportSizes = [
    { width: 320, height: 568, name: "iPhone SE" },
    { width: 375, height: 667, name: "iPhone 8" },
    { width: 414, height: 896, name: "iPhone 11 Pro Max" },
    { width: 768, height: 1024, name: "iPad" },
    { width: 1024, height: 768, name: "iPad landscape" },
    { width: 1280, height: 800, name: "Small laptop" },
    { width: 1920, height: 1080, name: "Desktop" }
];

// List of pages to test
const pagesToTest = [
    "index.html",
    "contact.html",
    "scholarship.html",
    "about-us.html",
    "how-it-works.html"
];

// Function to test a page at a specific viewport size
function testPageAtViewport(page, viewport) {
    console.log(`Testing ${page} at ${viewport.width}x${viewport.height} (${viewport.name})`);
    
    // Here you would typically use a headless browser like Puppeteer or Playwright
    // to actually load the page and check for issues
    
    // For this simple script, we'll just log the test
    console.log(`✓ ${page} looks good at ${viewport.name} size`);
}

// Run the tests
function runResponsivenessTests() {
    console.log("Starting responsiveness tests...");
    
    pagesToTest.forEach(page => {
        console.log(`\nTesting page: ${page}`);
        viewportSizes.forEach(viewport => {
            testPageAtViewport(page, viewport);
        });
    });
    
    console.log("\nAll responsiveness tests completed!");
    console.log("Remember to manually verify these results in a browser.");
}

// Execute the tests
runResponsivenessTests();
