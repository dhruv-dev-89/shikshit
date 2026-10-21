const fs = require('fs');

const items = JSON.parse(fs.readFileSync('scratch/svg_analysis.json', 'utf8'));

// Detailed analysis per item
const tableRows = items.map((it, idx) => {
  let location = '';
  let rep = '';
  let style = it.viewBox === '0 0 20 20' ? 'Solid 20x20' : (it.viewBox === '0 0 24 24' ? 'Outline 24x24' : it.viewBox);
  let color = it.className || 'None';
  let problems = [];

  // Match location
  if (it.line <= 195) {
    location = 'Nav';
    if (it.snippet.includes('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z')) {
      rep = 'NS-MAS link';
    } else if (it.snippet.includes('M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4')) {
      rep = 'Products & Services link';
    } else if (it.snippet.includes('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z')) {
      rep = 'Apply Now link';
    }
  } else if (it.line <= 350) {
    location = 'Hero';
    if (it.snippet.includes('M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z')) {
      if (it.className.includes('w-6 h-6')) {
        rep = 'Hero Heading Badge (Graduation Cap)';
      } else {
        rep = 'Hero Floating Decor (Graduation Cap duplicate)';
      }
    } else if (it.snippet.includes('M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z')) {
      rep = 'Hero CTA: Join Network (User Plus)';
    } else if (it.snippet.includes('M19 14l-7 7m0 0l-7-7m7 7V3')) {
      rep = 'Hero CTA: Explore Tiers (Arrow Down)';
    }
  } else if (it.line <= 900) {
    if (it.className.includes('w-12 h-12')) {
      location = 'Tier Cards Header';
      if (it.className.includes('text-green-600') || it.className.includes('text-greeni-600')) {
        rep = 'Student Tier Card (Graduation Cap)';
      } else if (it.className.includes('text-purple-600')) {
        rep = 'Professional Tier Card (Graduation Cap duplicate)';
      } else if (it.className.includes('text-blue-600')) {
        rep = 'Institution Tier Card (Graduation Cap duplicate)';
      } else if (it.className.includes('text-orange-600')) {
        rep = 'Corporate Tier Card (Graduation Cap duplicate)';
      }
    } else if (it.className.includes('benefit-icon')) {
      location = 'Tier Benefits Checklist';
      rep = 'Benefit Checklist item (Solid Checkmark)';
    }
  } else if (it.line <= 1000) {
    location = '"Why Choose" / Comprehensive Benefits';
    if (it.contextBefore.includes('Scholarship') || it.contextAfter.includes('Scholarship')) {
      rep = 'Benefit Tile: Scholarship (Graduation Cap duplicate)';
    } else if (it.contextBefore.includes('Workshops') || it.contextAfter.includes('Workshops')) {
      rep = 'Benefit Tile: Workshops (Presentation Screen)';
    } else if (it.contextBefore.includes('Networking') || it.contextAfter.includes('Networking')) {
      rep = 'Benefit Tile: Networking (Users Group)';
    } else if (it.contextBefore.includes('Mentorship') || it.contextAfter.includes('Mentorship')) {
      rep = 'Benefit Tile: Mentorship (Cap duplicate)';
    } else if (it.contextBefore.includes('Resource') || it.contextAfter.includes('Resource')) {
      rep = 'Benefit Tile: Resource Library (Document list)';
    } else if (it.contextBefore.includes('Recognition') || it.contextAfter.includes('Recognition')) {
      rep = 'Benefit Tile: Recognition & Awards (Cap duplicate)';
    }
  } else if (it.line <= 1120) {
    location = 'Application Form';
    if (it.line <= 1020) {
      rep = 'Form Header: Document Check';
    } else if (it.contextBefore.includes('Full Name') || it.contextAfter.includes('Full Name')) {
      rep = 'Form Label: Full Name (User)';
    } else if (it.contextBefore.includes('Email') || it.contextAfter.includes('Email')) {
      rep = 'Form Label: Email (Mail)';
    } else if (it.contextBefore.includes('Phone') || it.contextAfter.includes('Phone')) {
      rep = 'Form Label: Phone (Phone)';
    } else if (it.contextBefore.includes('Institution') || it.contextAfter.includes('Institution') || it.contextBefore.includes('Organization') || it.contextAfter.includes('Organization')) {
      rep = 'Form Label: Institution (Office)';
    } else if (it.contextBefore.includes('Location') || it.contextAfter.includes('Location') || it.contextBefore.includes('City') || it.contextAfter.includes('City')) {
      rep = 'Form Label: City (Map Pin)';
    } else if (it.contextBefore.includes('Membership Type') || it.contextAfter.includes('Membership Type')) {
      rep = 'Form Label: Membership Type (Badge)';
    } else if (it.snippet.includes('M19 9l-7 7-7-7')) {
      rep = 'Select Dropdown Chevron';
    } else if (it.snippet.includes('M12 19l9 2-9-18-9 18 9-2zm0')) {
      rep = 'Submit Button: Paper Airplane';
    } else if (it.snippet.includes('M13 7l5 5m0 0l-5 5m5-5H6')) {
      rep = 'Submit Button: Arrow Right';
    }
  } else {
    location = '"Why Choose" Feature Grid';
    if (it.contextBefore.includes('Equal Opportunity') || it.contextAfter.includes('Equal Opportunity')) {
      rep = 'Feature Tile: Equal Opportunity (Sparkles/Star)';
    } else if (it.contextBefore.includes('Comprehensive') || it.contextAfter.includes('Comprehensive')) {
      rep = 'Feature Tile: Comprehensive Support (Credit Card/Finance)';
    } else if (it.contextBefore.includes('Quality Education') || it.contextAfter.includes('Quality Education')) {
      rep = 'Feature Tile: Quality Education (Briefcase/System)';
    } else if (it.contextBefore.includes('Community Focus') || it.contextAfter.includes('Community Focus')) {
      rep = 'Feature Tile: Community Focus (Globe/Community)';
    }
  }

  // Compile Problems
  if (!it.width || !it.height) {
    problems.push('No width/height attributes (relies only on Tailwind class; breaks if CDN slow/blocked)');
  }
  if (it.className.includes('text-greeni-600')) {
    problems.push('Typo class "text-greeni-600" renders icon uncoloured/invisible');
  }
  if (location === 'Nav' && !it.fill && !it.snippet.includes('fill="none"')) {
    problems.push('Missing explicit fill="none" (relies on external CSS)');
  }
  if (rep.includes('duplicate')) {
    problems.push('Graduation-cap path reused inappropriately for non-student meaning');
  }
  if (it.snippet.includes('viewBox="0 0 24 24"') && it.snippet.includes('viewBox="0 0 20 20"')) {
    problems.push('Conflicting nested viewBox attributes');
  }

  return {
    index: it.index,
    line: it.line,
    location,
    rep,
    style,
    color,
    problems: problems.join('; ')
  };
});

fs.writeFileSync('scratch/table_rows.json', JSON.stringify(tableRows, null, 2));
console.log('Formatted', tableRows.length, 'table rows');
