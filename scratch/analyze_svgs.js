const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/svg_audit.json', 'utf8'));
const fullHtml = fs.readFileSync('public_html/become-a-member.html', 'utf8');
const lines = fullHtml.split('\n');

const analysis = data.map(item => {
  const lineNo = item.line;
  const snippet = item.snippet;
  
  // Extract svg tag attributes
  const svgTagMatch = snippet.match(/<svg([^>]*)>/);
  const attrs = svgTagMatch ? svgTagMatch[1] : '';
  
  const classMatch = attrs.match(/class="([^"]*)"/);
  const className = classMatch ? classMatch[1] : '';
  
  const viewBoxMatch = attrs.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';
  
  const fillMatch = attrs.match(/fill="([^"]*)"/);
  const fill = fillMatch ? fillMatch[1] : '';
  
  const strokeMatch = attrs.match(/stroke="([^"]*)"/);
  const stroke = strokeMatch ? strokeMatch[1] : '';
  
  const strokeWidthMatch = attrs.match(/stroke-width="([^"]*)"/);
  const strokeWidth = strokeWidthMatch ? strokeWidthMatch[1] : '';
  
  const widthMatch = attrs.match(/width="([^"]*)"/);
  const width = widthMatch ? widthMatch[1] : '';
  
  const heightMatch = attrs.match(/height="([^"]*)"/);
  const height = heightMatch ? heightMatch[1] : '';

  // Get surrounding text to determine location and representation
  const contextBefore = lines.slice(Math.max(0, lineNo - 5), lineNo).join(' ');
  const contextAfter = lines.slice(lineNo, Math.min(lines.length, lineNo + 6)).join(' ');

  return {
    index: item.index,
    line: lineNo,
    className,
    viewBox,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
    snippet: snippet.trim(),
    contextBefore: contextBefore.replace(/\s+/g, ' ').trim(),
    contextAfter: contextAfter.replace(/\s+/g, ' ').trim()
  };
});

fs.writeFileSync('scratch/svg_analysis.json', JSON.stringify(analysis, null, 2));
console.log('Analyzed', analysis.length, 'SVGs');
