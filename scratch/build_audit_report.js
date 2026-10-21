const fs = require('fs');

const items = JSON.parse(fs.readFileSync('scratch/svg_analysis.json', 'utf8'));

const audit = items.map(it => {
  let location = '';
  let representation = '';
  let problems = [];

  // Categorize based on line and context
  if (it.line <= 195) {
    location = 'Navbar';
    if (it.contextBefore.includes('NS-MAS') || it.contextAfter.includes('NS-MAS')) {
      representation = 'Navbar: NS-MAS (document text)';
    } else if (it.contextBefore.includes('Products') || it.contextAfter.includes('Products')) {
      representation = 'Navbar: Products & Services (cube/box)';
    } else if (it.contextBefore.includes('Apply Now') || it.contextAfter.includes('Apply Now')) {
      representation = 'Navbar: Apply Now (pencil/clipboard)';
    }
  } else if (it.line >= 200 && it.line <= 350) {
    location = 'Hero Section';
    if (it.contextBefore.includes('Empowering Education') || it.contextAfter.includes('Shikshit Membership')) {
      representation = 'Hero Heading Badge: Graduation Cap';
    } else if (it.contextBefore.includes('Join Network') || it.contextAfter.includes('Join Network')) {
      representation = 'Hero CTA: User Plus';
    } else if (it.contextBefore.includes('Explore Tiers') || it.contextAfter.includes('Explore Tiers')) {
      representation = 'Hero CTA: Arrow Down';
    } else if (it.className.includes('w-24') || it.className.includes('w-32') || it.className.includes('w-20') || it.className.includes('opacity-20') || it.className.includes('opacity-15')) {
      representation = 'Hero Floating Decoration: Graduation Cap';
    }
  } else if (it.line >= 351 && it.line <= 1000) {
    if (it.line >= 380 && it.line <= 600) {
      location = 'Membership Cards (Tier Pods)';
      if (it.contextBefore.includes('Student Membership') || it.contextAfter.includes('Student Membership') || it.className.includes('green')) {
        representation = 'Membership Tier: Student (Graduation Cap)';
      } else if (it.contextBefore.includes('Professional') || it.contextAfter.includes('Professional') || it.className.includes('purple')) {
        representation = 'Membership Tier: Professional (Graduation Cap duplicate)';
      } else if (it.contextBefore.includes('Institution') || it.contextAfter.includes('Institution') || it.className.includes('blue')) {
        representation = 'Membership Tier: Institution (Graduation Cap duplicate)';
      } else if (it.contextBefore.includes('Corporate') || it.contextAfter.includes('Corporate') || it.className.includes('orange')) {
        representation = 'Membership Tier: Corporate (Graduation Cap duplicate)';
      }
    } else if (it.line >= 601 && it.line <= 900) {
      location = 'Membership Tier Checklists';
      representation = 'Tier Benefit Checklist: Solid Checkmark';
    } else if (it.line >= 901 && it.line <= 1000) {
      location = 'Comprehensive Benefits Grid';
      if (it.contextBefore.includes('Scholarship') || it.contextAfter.includes('Scholarship')) {
        representation = 'Benefits Grid: Scholarship Access (Graduation Cap duplicate)';
      } else if (it.contextBefore.includes('Workshops') || it.contextAfter.includes('Workshops')) {
        representation = 'Benefits Grid: Workshops & Training (Desktop / Presentation)';
      } else if (it.contextBefore.includes('Networking') || it.contextAfter.includes('Networking')) {
        representation = 'Benefits Grid: Networking (Users Group)';
      } else if (it.contextBefore.includes('Mentorship') || it.contextAfter.includes('Mentorship')) {
        representation = 'Benefits Grid: Mentorship (User Check / Cap duplicate)';
      } else if (it.contextBefore.includes('Resource') || it.contextAfter.includes('Resource')) {
        representation = 'Benefits Grid: Resource Library (Library / Document)';
      } else if (it.contextBefore.includes('Recognition') || it.contextAfter.includes('Recognition')) {
        representation = 'Benefits Grid: Recognition & Awards (Award / Trophy / Cap duplicate)';
      } else {
        representation = 'Benefits Grid Tile: ' + it.className;
      }
    }
  } else if (it.line >= 1001 && it.line <= 1120) {
    location = 'Application Form';
    if (it.line <= 1020) {
      representation = 'Form Header Icon: Clipboard Document';
    } else if (it.contextBefore.includes('Full Name') || it.contextAfter.includes('Full Name')) {
      representation = 'Form Label: Full Name (User Outline)';
    } else if (it.contextBefore.includes('Email') || it.contextAfter.includes('Email')) {
      representation = 'Form Label: Email Address (Mail Outline)';
    } else if (it.contextBefore.includes('Phone') || it.contextAfter.includes('Phone')) {
      representation = 'Form Label: Phone Number (Phone Outline)';
    } else if (it.contextBefore.includes('Institution') || it.contextAfter.includes('Institution') || it.contextBefore.includes('Organization') || it.contextAfter.includes('Organization')) {
      representation = 'Form Label: Organization / Institution (Office Building Outline)';
    } else if (it.contextBefore.includes('Location') || it.contextAfter.includes('Location') || it.contextBefore.includes('City') || it.contextAfter.includes('City')) {
      representation = 'Form Label: City / Location (Map Pin Outline)';
    } else if (it.contextBefore.includes('Membership Type') || it.contextAfter.includes('Membership Type')) {
      representation = 'Form Label: Membership Type (Badge / Check Outline)';
    } else if (it.contextBefore.includes('pointer-events-none') || it.contextAfter.includes('M19 9l-7 7-7-7')) {
      representation = 'Form Field: Select Dropdown Chevron';
    } else if (it.contextBefore.includes('paper-airplane') || it.snippet.includes('M12 19l9 2-9-18-9 18 9-2zm0')) {
      representation = 'Form Submit Button: Paper Airplane Leading Icon';
    } else if (it.snippet.includes('M13 7l5 5m0 0l-5 5m5-5H6')) {
      representation = 'Form Submit Button: Arrow Right Trailing Icon';
    }
  } else if (it.line >= 1121) {
    location = '"Why Choose Shikshit" Tiles';
    if (it.contextBefore.includes('Equal Opportunity') || it.contextAfter.includes('Equal Opportunity')) {
      representation = '"Why Choose" Tile 1: Equal Opportunity (Sparkles / Shield)';
    } else if (it.contextBefore.includes('Comprehensive') || it.contextAfter.includes('Comprehensive')) {
      representation = '"Why Choose" Tile 2: Comprehensive Support (Credit Card / Hand)';
    } else if (it.contextBefore.includes('Quality') || it.contextAfter.includes('Quality')) {
      representation = '"Why Choose" Tile 3: Quality Education (Briefcase / School)';
    } else if (it.contextBefore.includes('Community') || it.contextAfter.includes('Community')) {
      representation = '"Why Choose" Tile 4: Community Focus (Globe / Heart)';
    }
  }

  // Detect problems:
  if (!it.width || !it.height) {
    problems.push('Missing explicit width/height attributes (relies only on Tailwind class)');
  }
  if (it.className.includes('text-greeni-600')) {
    problems.push('Typo "text-greeni-600" renders icon uncoloured/invisible');
  }
  if (it.viewBox === '0 0 24 24' && !it.fill && it.stroke === 'currentColor') {
    // Check if fill="none" is missing
    if (!it.snippet.includes('fill="none"')) {
      problems.push('Outline SVG missing explicit fill="none"');
    }
  }
  if (it.viewBox === '0 0 24 24' && it.snippet.includes('fill="none"') && !it.snippet.includes('stroke=')) {
    problems.push('Missing stroke attribute on outline icon');
  }
  if (representation.includes('Graduation Cap duplicate')) {
    problems.push('Semantic mismatch: graduation cap path reused instead of contextual icon');
  }
  if (it.snippet.includes('viewBox="0 0 24 24"') && it.snippet.includes('viewBox="0 0 20 20"')) {
    problems.push('Conflicting viewBox attributes');
  }

  return {
    index: it.index,
    line: it.line,
    location,
    representation,
    viewBox: it.viewBox,
    currentStyle: it.fill ? `Solid (fill="${it.fill}")` : `Outline (stroke="${it.stroke}")`,
    className: it.className,
    problems: problems.length ? problems.join('; ') : 'Missing explicit width/height fallback'
  };
});

fs.writeFileSync('scratch/full_audit_results.json', JSON.stringify(audit, null, 2));
console.log('Saved audit results for', audit.length, 'icons');
