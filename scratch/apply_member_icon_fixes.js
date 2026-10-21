const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add link to member.css in head if not present
    if (!content.includes('css/shikshit/member.css')) {
        content = content.replace(
            '<link rel="stylesheet" href="css/sikshitnavbar.css">',
            '<link rel="stylesheet" href="css/sikshitnavbar.css">\n    <link rel="stylesheet" href="css/shikshit/member.css">'
        );
    }

    // 2. Add page-member class to body
    content = content.replace('<body>', '<body class="page-member">');

    // 3. Navbar icons
    // NS-MAS
    content = content.replace(
        /<svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"\/>[\s\S]*?<\/svg>/,
        `<svg class="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>`
    );

    // Products and Services
    content = content.replace(
        /<svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"\/>[\s\S]*?<\/svg>/,
        `<svg class="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>`
    );

    // Apply Now
    content = content.replace(
        /<svg class="nav-icon" viewBox="0 0 24 24" stroke="currentColor">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"\/>[\s\S]*?<\/svg>/,
        `<svg class="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>`
    );

    // CTA Become a Member
    content = content.replace(
        /<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"\/>[\s\S]*?<\/svg>/,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>`
    );

    // CTA Donate Us
    content = content.replace(
        /<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"\/>[\s\S]*?<\/svg>/,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>`
    );

    // 4. Floating decorations
    // Decor 1
    content = content.replace(
        /<div class="scholarship-icon scholarship-icon-1">[\s\S]*?<\/div>/,
        `<div class="scholarship-icon scholarship-icon-1" aria-hidden="true">
        <svg class="w-16 h-16 text-white" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
            <path d="M12 2L1 8.5l11 6.5 9-5.318V16a1 1 0 002 0V8.5L12 2z"/>
            <path d="M5 11.5v5.5a7 7 0 0014 0v-5.5"/>
        </svg>
    </div>`
    );

    // Decor 2
    content = content.replace(
        /<div class="scholarship-icon scholarship-icon-2">[\s\S]*?<\/div>/,
        `<div class="scholarship-icon scholarship-icon-2" aria-hidden="true">
        <svg class="w-12 h-12 text-white" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
    </div>`
    );

    // Decor 3
    content = content.replace(
        /<div class="scholarship-icon scholarship-icon-3">[\s\S]*?<\/div>/,
        `<div class="scholarship-icon scholarship-icon-3" aria-hidden="true">
        <svg class="w-14 h-14 text-white" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
    </div>`
    );

    // Decor 4
    content = content.replace(
        /<div class="scholarship-icon scholarship-icon-4">[\s\S]*?<\/div>/,
        `<div class="scholarship-icon scholarship-icon-4" aria-hidden="true">
        <svg class="w-10 h-10 text-white" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
    </div>`
    );

    // 5. Hero heading accents
    content = content.replace(
        /<div class="animate-bounce-slow mr-0 xs:mr-4 mb-2 xs:mb-0">[\s\S]*?<svg class="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white"[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="animate-bounce-slow mr-0 xs:mr-4 mb-2 xs:mb-0" aria-hidden="true">
                        <svg class="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                            <path d="M12 2L1 8.5l11 6.5 9-5.318V16a1 1 0 002 0V8.5L12 2z"/>
                            <path d="M5 11.5v5.5a7 7 0 0014 0v-5.5"/>
                        </svg>
                    </div>`
    );

    content = content.replace(
        /<div class="animate-pulse-slow ml-0 xs:ml-4 mt-2 xs:mt-0">[\s\S]*?<svg class="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white"[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="animate-pulse-slow ml-0 xs:ml-4 mt-2 xs:mt-0" aria-hidden="true">
                        <svg class="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>`
    );

    // Hero CTA arrow
    content = content.replace(
        /<svg class="w-4 h-4 xs:w-5 xs:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"\/>[\s\S]*?<\/svg>/,
        `<svg class="w-4 h-4 xs:w-5 xs:h-5 ml-2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>`
    );

    // 6. "Membership Plans" Heading Accents (Fixing Image 1)
    content = content.replace(
        /<div class="animate-bounce-slow mr-6">[\s\S]*?<svg class="w-20 h-20 text-purple-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path d="M10\.394 2\.08a1 1 0 00-\.788 0l-7 3a1 1 0 000 1\.84L5\.25 8\.051a\.999\.999 0 01\.356-\.257l4-1\.714a1 1 0 11\.788 1\.838L7\.667 9\.088l1\.94\.831a1 1 0 00\.787 0l7-3a1 1 0 000-1\.838l-7-3z"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="animate-bounce-slow mr-4 sm:mr-6 member-heading-accent" aria-hidden="true">
                        <svg class="w-8 h-8 sm:w-9 sm:h-9 text-purple-600" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                            <path d="M12 2L1 8.5l11 6.5 9-5.318V16a1 1 0 002 0V8.5L12 2z"/>
                            <path d="M5 11.5v5.5a7 7 0 0014 0v-5.5"/>
                        </svg>
                    </div>`
    );

    content = content.replace(
        /<div class="animate-pulse-slow ml-6">[\s\S]*?<svg class="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M6\.267 3\.455a3\.066 3\.066 0 001\.745-\.723[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="animate-pulse-slow ml-4 sm:ml-6 member-heading-accent" aria-hidden="true">
                        <svg class="w-8 h-8 sm:w-9 sm:h-9 text-blue-600" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                        </svg>
                    </div>`
    );

    // 7. Key Benefits Checkmarks
    const checkmarkSvg = `<svg class="benefit-icon w-5 h-5 text-green-500 mr-2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>`;

    content = content.replace(
        /<svg class="benefit-icon w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<\/svg>/g,
        checkmarkSvg
    );

    // 8. Membership Cards
    // Card 1: Individual Membership (L850)
    content = content.replace(
        /<div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">[\s\S]*?<svg class="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-20 h-20 member-icon-pod bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                            <svg class="w-10 h-10 text-purple-600" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>`
    );

    // Card 2: Student Membership (Up to 12th) (L868 - Image 2)
    content = content.replace(
        /<div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">[\s\S]*?<svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path d="M10\.394 2\.08a1 1 0 00-\.788 0l-7 3a1 1 0 000 1\.84L5\.25 8\.051a\.999\.999 0 01\.356-\.257l4-1\.714a1 1 0 11\.788 1\.838L7\.667 9\.088l1\.94\.831a1 1 0 00\.787 0l7-3a1 1 0 000-1\.838l-7-3z"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-20 h-20 member-icon-pod bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                            <svg class="w-10 h-10 text-blue-600" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M12 2L1 8.5l11 6.5 9-5.318V16a1 1 0 002 0V8.5L12 2z"/>
                                <path d="M5 11.5v5.5a7 7 0 0014 0v-5.5"/>
                            </svg>
                        </div>`
    );

    // Card 3: Student Membership (UG/PG) (L887 - Image 2, fixing typo text-greeni-600 and missing </svg>)
    content = content.replace(
        /<div class="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">[\s\S]*?<svg class="w-10 h-10 text-greeni-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path d="M10\.394 2\.08a1 1 0 00-\.788 0l-7 3a1 1 0 000 1\.84L5\.25 8\.051a\.999\.999 0 01\.356-\.257l4-1\.714a1 1 0 11\.788 1\.838L7\.667 9\.088l1\.94\.831a1 1 0 00\.787 0l7-3a1 1 0 000-1\.838l-7-3z"\/>[\s\S]*?<\/div>\s*<h3 class="text-2xl font-bold text-gray-800 mb-3">Student Membership<\/h3>/,
        `<div class="w-20 h-20 member-icon-pod bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                            <svg class="w-10 h-10 text-green-600" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M12 2L1 8.5l11 6.5 9-5.318V16a1 1 0 002 0V8.5L12 2z"/>
                                <path d="M5 11.5v5.5a7 7 0 0014 0v-5.5"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-3">Student Membership</h3>`
    );

    // Card 4: Urban Schools (L922, fixing missing </svg>)
    content = content.replace(
        /<div class="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">[\s\S]*?<svg class="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clip-rule="evenodd"\/>[\s\S]*?<\/div>\s*<h3 class="text-xl font-bold text-gray-800 mb-2">Urban Schools<\/h3>/,
        `<div class="w-20 h-20 member-icon-pod bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                            <svg class="w-10 h-10 text-orange-600" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Urban Schools</h3>`
    );

    // Card 5: Rural Schools (L942)
    content = content.replace(
        /<div class="w-20 h-20 bg-gradient-to-br from-teal-200 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">[\s\S]*?<svg class="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-20 h-20 member-icon-pod bg-gradient-to-br from-teal-200 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                            <svg class="w-10 h-10 text-teal-600" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                        </div>`
    );

    // Card 6: Universities (L963 - Image 3, fixing missing </svg>)
    content = content.replace(
        /<div class="w-20 h-20 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">[\s\S]*?<svg class="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path d="M10\.394 2\.08a1 1 0 00-\.788 0l-7 3a1 1 0 000 1\.84L5\.25 8\.051a\.999\.999 0 01\.356-\.257l4-1\.714a1 1 0 11\.788 1\.838L7\.667 9\.088l1\.94\.831a1 1 0 00\.787 0l7-3a1 1 0 000-1\.838l-7-3z"\/>[\s\S]*?<\/div>\s*<h3 class="text-xl font-bold text-gray-800 mb-2">Universities<\/h3>/,
        `<div class="w-20 h-20 member-icon-pod bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                            <svg class="w-10 h-10 text-indigo-600" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M8 14v5m4-5v5m4-5v5M3 10h18M4 10l8-6 8 6M4 21h16"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Universities</h3>`
    );

    // 9. Application Form Header Pod
    content = content.replace(
        /<div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">[\s\S]*?<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg class="w-8 h-8 text-purple-600" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                            </svg>
                        </div>`
    );

    // Form labels
    // Email Label
    content = content.replace(
        /<svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1\.5a2\.5 2\.5 0 005 0V12a9 9 0 10-9 9m4\.5-1\.206a8\.959 8\.959 0 01-4\.5 1\.207"\/>[\s\S]*?<\/svg>\s*Email Address \*/,
        `<svg class="w-4 h-4 mr-2 text-purple-600" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                Email Address *`
    );

    // Full Name Label
    content = content.replace(
        /<svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"\/>[\s\S]*?<\/svg>\s*Full Name \*/,
        `<svg class="w-4 h-4 mr-2 text-purple-600" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                Full Name *`
    );

    // Organization Name Label
    content = content.replace(
        /<svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"\/>[\s\S]*?<\/svg>\s*Organization Name \*/,
        `<svg class="w-4 h-4 mr-2 text-purple-600" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                                Organization Name *`
    );

    // Phone Number Label
    content = content.replace(
        /<svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3\.28a1 1 0 01\.948\.684l1\.498 4\.493a1 1 0 01-\.502 1\.21l-2\.257 1\.13a11\.042 11\.042 0 005\.516 5\.516l1\.13-2\.257a1 1 0 011\.21-\.502l4\.493 1\.498a1 1 0 01\.684\.949V19a2 2 0 01-2 2h-1C9\.716 21 3 14\.284 3 6V5z"\/>[\s\S]*?<\/svg>\s*Phone Number \*/,
        `<svg class="w-4 h-4 mr-2 text-purple-600" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                Phone Number *`
    );

    // Organization Address Label
    content = content.replace(
        /<svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17\.657 16\.657L13\.414 20\.9a1\.998 1\.998 0 01-2\.827 0l-4\.244-4\.243a8 8 0 1111\.314 0z"\/>[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"\/>[\s\S]*?<\/svg>\s*Organization Address \*/,
        `<svg class="w-4 h-4 mr-2 text-purple-600" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                Organization Address *`
    );

    // Organization Type Label
    content = content.replace(
        /<svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7\.835 4\.697a3\.42 3\.42 0 001\.946-\.806 3\.42 3\.42 0 014\.438 0 3\.42 3\.42 0 001\.946\.806 3\.42 3\.42 0 013\.138 3\.138 3\.42 3\.42 0 00\.806 1\.946 3\.42 3\.42 0 010 4\.438 3\.42 3\.42 0 00-\.806 1\.946 3\.42 3\.42 0 01-3\.138 3\.138 3\.42 3\.42 0 00-1\.946\.806 3\.42 3\.42 0 01-4\.438 0 3\.42 3\.42 0 00-1\.946-\.806 3\.42 3\.42 0 01-3\.138-3\.138 3\.42 3\.42 0 00-\.806-1\.946 3\.42 3\.42 0 010-4\.438 3\.42 3\.42 0 00\.806-1\.946 3\.42 3\.42 0 013\.138-3\.138z"\/>[\s\S]*?<\/svg>\s*Organization Type \*/,
        `<svg class="w-4 h-4 mr-2 text-purple-600" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                </svg>
                                Organization Type *`
    );

    // Chevron in Select
    content = content.replace(
        /<div class="absolute right-4 top-\[52px\] text-gray-400 pointer-events-none">[\s\S]*?<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="absolute right-4 top-[52px] text-gray-400 pointer-events-none select-chevron" aria-hidden="true">
                                <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                    <path d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>`
    );

    // Submit button
    content = content.replace(
        /<button type="submit" class="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 transform hover:scale-\[1\.02\] transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center group">[\s\S]*?<svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"\/>[\s\S]*?<\/svg>[\s\S]*?Submit Application[\s\S]*?<svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"\/>[\s\S]*?<\/svg>[\s\S]*?<\/button>/,
        `<button type="submit" class="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center group">
                            <svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                            Submit Application
                            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        </button>`
    );

    // 10. "Why Choose Us" Tiles
    // Tile 1: Recognition Opportunities (L1134)
    content = content.replace(
        /<div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">[\s\S]*?<svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M6\.267 3\.455a3\.066 3\.066 0 001\.745-\.723[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-14 h-14 why-choose-icon-pod bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg" aria-hidden="true">
                                    <svg class="w-7 h-7 text-white" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                    </svg>
                                </div>`
    );

    // Tile 2: Financial Aid Opportunity (L1149)
    content = content.replace(
        /<div class="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">[\s\S]*?<svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"\/>[\s\S]*?<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-14 h-14 why-choose-icon-pod bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg" aria-hidden="true">
                                    <svg class="w-7 h-7 text-white" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>`
    );

    // Tile 3: Career Exposure (L1165)
    content = content.replace(
        /<div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">[\s\S]*?<svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3\.57A22\.952 22\.952 0 0110 13a22\.95 22\.95 0 01-8-1\.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h\.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"\/>[\s\S]*?<path d="M2 13\.692V16a2 2 0 002 2h12a2 2 0 002-2v-2\.308A24\.974 24\.974 0 0110 15c-2\.796 0-5\.487-\.46-8-1\.308z"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-14 h-14 why-choose-icon-pod bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg" aria-hidden="true">
                                    <svg class="w-7 h-7 text-white" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>`
    );

    // Tile 4: International Exposure (L1181)
    content = content.replace(
        /<div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">[\s\S]*?<svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">[\s\S]*?<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4\.332 8\.027a6\.012 6\.012 0 011\.912-2\.706C6\.512 5\.73 6\.974 6 7\.5 6A1\.5 1\.5 0 019 7\.5V8a2 2 0 004 0 2 2 0 011\.523-1\.943A5\.977 5\.977 0 0116 10c0 \.34-\.028\.675-\.083 1H15a2 2 0 00-2 2v2\.197A5\.973 5\.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1\.668-1\.973z" clip-rule="evenodd"\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>/,
        `<div class="w-14 h-14 why-choose-icon-pod bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg" aria-hidden="true">
                                    <svg class="w-7 h-7 text-white" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" focusable="false">
                                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                    </svg>
                                </div>`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
}

processFile('c:/Users/kesha/Desktop/Shikshit01/public_html/become-a-member.html');
processFile('c:/Users/kesha/Desktop/Shikshit01/public_html (77)/become-a-member.html');
