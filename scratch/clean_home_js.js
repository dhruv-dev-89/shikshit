const fs = require('fs');
['public_html/js/home.js', 'public_html (77)/js/home.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const target = `                // Swipe right to go to previous slide
                swipeDetector.onSwipeRight = function(e) {
                    pauseSlideshow();
                    let prevIndex = (currentSlideIndex - 1 + academicLevelLinks.length) % academicLevelLinks.length;
                    showSlide(prevIndex);
                    setTimeout(resumeSlideshow, 10000);
                };`;
  if (content.includes(target)) {
    content = content.replace(target, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Cleaned leftover swipeDetector in:', filePath);
  } else {
    // try with normalized line endings
    const normalizedTarget = target.replace(/\r?\n/g, '\n');
    const normalizedContent = content.replace(/\r?\n/g, '\n');
    if (normalizedContent.includes(normalizedTarget)) {
      content = normalizedContent.replace(normalizedTarget, '');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Cleaned (normalized) in:', filePath);
    } else {
      console.warn('Could not find target in:', filePath);
    }
  }
});
