const fs = require('fs');
const path = require('path');

const ROOT_DIRS = ['public_html', 'public_html (77)'];

function updateFileInRoots(relativePath, updater) {
  ROOT_DIRS.forEach(rootDir => {
    const filePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = updater(content, filePath);
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No change needed for: ${filePath}`);
    }
  });
}

console.log('--- Fixing scholarship.html syntax ---');
updateFileInRoots('scholarship.html', (content) => {
  content = content.replace(
    'resizeTimer = if (typeof setHeroHeight === \'function\') setTimeout(setHeroHeight, 100);',
    'resizeTimer = setTimeout(setHeroHeight, 100);'
  );
  content = content.replace(
    'if (typeof setHeroHeight === \'function\') setTimeout(setHeroHeight, 0);',
    'setTimeout(setHeroHeight, 0);'
  );
  return content;
});

console.log('\n--- Fixing about-us.html navbar include ---');
updateFileInRoots('about-us.html', (content) => {
  content = content.replace(
    '<div include-html="navbar.html"></div>',
    '<div include-html="components/nsmas_navbar.html"></div>'
  );
  return content;
});

console.log('\n--- Fixing js/home.js ---');
updateFileInRoots('js/home.js', (content) => {
  // 1. Fix SwipeDetector ReferenceError
  const oldSwipe = /const swipeDetector = new SwipeDetector\(scholarshipSection\);[\s\S]*?setTimeout\(resumeSlideshow, 10000\);\s*};/gi;
  const newSwipe = `if (typeof SwipeDetector !== 'undefined') {
                    const swipeDetector = new SwipeDetector(scholarshipSection);
                    swipeDetector.onSwipeLeft = function(e) {
                        pauseSlideshow();
                        let nextIndex = (currentSlideIndex + 1) % academicLevelLinks.length;
                        showSlide(nextIndex);
                        setTimeout(resumeSlideshow, 10000);
                    };
                    swipeDetector.onSwipeRight = function(e) {
                        pauseSlideshow();
                        let prevIndex = (currentSlideIndex - 1 + academicLevelLinks.length) % academicLevelLinks.length;
                        showSlide(prevIndex);
                        setTimeout(resumeSlideshow, 10000);
                    };
                } else {
                    let startX = 0, startY = 0;
                    scholarshipSection.addEventListener('touchstart', function(e) {
                        if (e.touches && e.touches.length === 1) {
                            startX = e.touches[0].clientX;
                            startY = e.touches[0].clientY;
                        }
                    }, { passive: true });
                    scholarshipSection.addEventListener('touchend', function(e) {
                        if (e.changedTouches && e.changedTouches.length === 1) {
                            const diffX = e.changedTouches[0].clientX - startX;
                            const diffY = e.changedTouches[0].clientY - startY;
                            if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                                pauseSlideshow();
                                if (diffX < 0) {
                                    let nextIndex = (currentSlideIndex + 1) % academicLevelLinks.length;
                                    showSlide(nextIndex);
                                } else {
                                    let prevIndex = (currentSlideIndex - 1 + academicLevelLinks.length) % academicLevelLinks.length;
                                    showSlide(prevIndex);
                                }
                                setTimeout(resumeSlideshow, 10000);
                            }
                        }
                    }, { passive: true });
                }`;

  content = content.replace(oldSwipe, newSwipe);

  // 2. Fix unescaped percentage selector
  content = content.replace(
    "const popularImgContainer = document.querySelector('.relative.h-110%.overflow-hidden');",
    "const popularImgContainer = document.querySelector('.relative.overflow-hidden');"
  );

  return content;
});

console.log('Done apply_fixes_part2');
