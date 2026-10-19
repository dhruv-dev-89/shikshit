const fs = require('fs');
const path = require('path');

// Let's read the latest user message from the transcript to extract the base64 images
const transcriptPath = 'C:\\Users\\kesha\\.gemini\\antigravity-ide\\brain\\0fc19dd5-fddc-4be6-aa84-5997f9f25450\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let userHtml = '';
for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i].trim()) continue;
  try {
    const obj = JSON.parse(lines[i]);
    if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
      const content = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
      if (content.includes('Shikshit – Creative Hero')) {
        userHtml = content;
        break;
      }
    }
  } catch (e) {}
}

if (!userHtml) {
  console.log('User HTML not found in transcript.jsonl, trying transcript_full.jsonl');
  const fullTranscriptPath = 'C:\\Users\\kesha\\.gemini\\antigravity-ide\\brain\\0fc19dd5-fddc-4be6-aa84-5997f9f25450\\.system_generated\\logs\\transcript_full.jsonl';
  const fullLines = fs.readFileSync(fullTranscriptPath, 'utf8').split('\n');
  for (let i = fullLines.length - 1; i >= 0; i--) {
    if (!fullLines[i].trim()) continue;
    try {
      const obj = JSON.parse(fullLines[i]);
      if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
        const content = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
        if (content.includes('Shikshit – Creative Hero')) {
          userHtml = content;
          break;
        }
      }
    } catch (e) {}
  }
}

if (!userHtml) {
  console.error('Could not find user HTML snippet');
  process.exit(1);
}

const outDir = path.resolve('public_html', 'images', 'hero');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Find all data:image/jpeg;base64,
const regex = /data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)/g;
let match;
let count = 0;
const names = ['nav_logo', 'ip_lives', 'ip_edu', 'p1_raised', 'p2_students', 'p3_institutions', 'p4_nonprofit'];

while ((match = regex.exec(userHtml)) !== null) {
  const ext = match[1] === 'png' ? 'png' : 'jpg';
  const buffer = Buffer.from(match[2], 'base64');
  const name = names[count] || `img_${count}`;
  const filePath = path.join(outDir, `${name}.${ext}`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Saved ${name}.${ext} (${buffer.length} bytes)`);
  count++;
}
