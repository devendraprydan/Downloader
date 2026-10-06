// Generates aligned ASCII sequence diagrams for the Freebuff PPT slides.
// Run: node tools/asciiSeq.js
const W = 18; // column width (chars between lifelines)

function makeDiagram(names, items) {
  const bars = names.map((_, i) => 1 + i * W);
  const lastName = names[names.length - 1];
  const total = Math.max(
    bars[bars.length - 1] + 2,
    bars[bars.length - 1] - Math.floor(lastName.length / 2) + lastName.length + 1
  );

  const row = (paint) => {
    const a = Array(total).fill(' ');
    bars.forEach((b) => (a[b] = '|'));
    if (paint) paint(a);
    return a.join('').replace(/\s+$/, '');
  };

  const seg = (from, to) => {
    const lo = Math.min(from, to);
    const hi = Math.max(from, to);
    return [bars[lo] + 1, bars[hi] - 1];
  };

  const putCentered = (a, from, to, text) => {
    const [s, e] = seg(from, to);
    const width = e - s + 1;
    if (text.length > width)
      throw new Error(`Label "${text}" (${text.length} chars) does not fit width ${width}`);
    const off = Math.floor((width - text.length) / 2);
    for (let k = 0; k < text.length; k++) a[s + off + k] = text[k];
  };

  const keepInnerBars = (a, from, to) => {
    const lo = Math.min(from, to);
    const hi = Math.max(from, to);
    for (let i = lo + 1; i < hi; i++) a[bars[i]] = '|';
  };

  const arrowRight = (from, to, label) => {
    const [s, e] = seg(from, to);
    const width = e - s + 1;
    const body =
      label === null
        ? '-'.repeat(width - 2) + '->'
        : '-- ' + label + ' ' + '-'.repeat(width - 6 - label.length) + '->';
    if (label !== null && width - 6 - label.length < 0)
      throw new Error(`"${label}" too long for inline arrow`);
    return row((a) => {
      for (let k = 0; k < body.length; k++) a[s + k] = body[k];
      keepInnerBars(a, from, to);
    });
  };

  const arrowLeft = (from, to, label) => {
    const [s, e] = seg(from, to);
    const width = e - s + 1;
    const body =
      label === null
        ? '<' + '-'.repeat(width - 1)
        : '<- ' + label + ' ' + '-'.repeat(width - 7 - label.length) + '--';
    if (label !== null && width - 6 - label.length < 0)
      throw new Error(`"${label}" too long for inline arrow`);
    return row((a) => {
      for (let k = 0; k < body.length; k++) a[s + k] = body[k];
      keepInnerBars(a, from, to);
    });
  };

  const labelLine = (from, to, text) => row((a) => putCentered(a, from, to, text));
  const note = (i, text) =>
    row((a) => {
      const start = bars[i] + 2;
      if (start + text.length > bars[i + 1])
        throw new Error(`Note "${text}" too long`);
      for (let k = 0; k < text.length; k++) a[start + k] = text[k];
    });
  const blank = () => row(null);

  const fullRow = (fill, label) => {
    const a = Array(total).fill(fill);
    a[0] = '+';
    a[total - 1] = '+';
    if (label) {
      const t = ' ' + label + ' ';
      const off = Math.max(0, Math.floor((total - 2 - t.length) / 2));
      for (let k = 0; k < t.length && 1 + off + k < total - 1; k++) a[1 + off + k] = t[k];
    }
    return a.join('');
  };

  // message helper: inline if it fits, else label line above a plain arrow
  const canInline = (from, to, label) => {
    const [s, e] = seg(from, to);
    return label.length <= e - s + 1 - 6;
  };
  const msgR = (from, to, label) =>
    canInline(from, to, label)
      ? [arrowRight(from, to, label)]
      : [labelLine(from, to, label), arrowRight(from, to, null)];
  const msgL = (from, to, label) =>
    canInline(from, to, label)
      ? [arrowLeft(from, to, label)]
      : [labelLine(from, to, label), arrowLeft(from, to, null)];

  // header: all names on ONE line, centered over each lifeline
  const header = (() => {
    const a = Array(total).fill(' ');
    names.forEach((nm, i) => {
      const start = Math.max(0, bars[i] - Math.floor(nm.length / 2));
      for (let k = 0; k < nm.length; k++) a[start + k] = nm[k];
    });
    return a.join('').replace(/\s+$/, '');
  })();

  const rows = [header, row(null)];
  for (const item of items) {
    if (item === null) rows.push(blank());
    else if (item.note !== undefined) rows.push(note(item.i, item.note));
    else if (item.frame !== undefined) rows.push(fullRow('=', item.frame));
    else if (item.guard !== undefined) rows.push(fullRow('-', item.guard));
    else if (item.frameEnd) rows.push(fullRow('='));
    else if (item.dir === 'R') rows.push(...msgR(item.from, item.to, item.label));
    else rows.push(...msgL(item.from, item.to, item.label));
  }
  return rows.join('\n');
}

const R = (from, to, label) => ({ dir: 'R', from, to, label });
const L = (from, to, label) => ({ dir: 'L', from, to, label });
const N = (i, note) => ({ i, note });
const GAP = null;
const F = (label) => ({ frame: label });
const G = (label) => ({ guard: label });
const FE = { frameEnd: true };

console.log('=== D5: USER VIDEO DOWNLOAD ===\n');
console.log(
  makeDiagram(['User', 'Frontend', 'Backend', 'MongoDB', 'yt-dlp'], [
    R(0, 1, 'Enter URL'),
    R(0, 1, 'Click Fetch'),
    R(1, 2, 'Send URL'),
    R(2, 4, 'Get Details'),
    L(4, 2, 'Video Info'),
    GAP,
    R(2, 3, 'Save Record'),
    N(3, '(pending)'),
    L(2, 1, 'Details + Quality'),
    L(1, 0, 'Show Details'),
    GAP,
    R(0, 1, 'Select Quality'),
    R(0, 1, 'Click Download'),
    R(1, 2, 'Download Request'),
    R(2, 4, 'Download Video'),
    L(4, 2, 'MP4 File'),
    R(2, 3, 'Update Status'),
    N(3, '(final status)'),
    L(2, 1, 'Stream MP4'),
    L(1, 0, 'File Saved'),
  ])
);

console.log('\n=== D6: ADMIN LOGIN & ANALYTICS ===\n');
console.log(
  makeDiagram(['Admin', 'Dashboard', 'Backend', 'MongoDB'], [
    R(0, 1, 'Enter Email'),
    R(0, 1, 'Enter Password'),
    R(0, 1, 'Click Login'),
    R(1, 2, 'POST /login'),
    R(2, 3, 'Find Admin'),
    L(3, 2, 'Admin Record'),
    N(2, '(bcrypt hash)'),
    N(2, '(compare pwd,'),
    N(2, 'sign JWT 24h)'),
    L(2, 1, 'JWT Token'),
    GAP,
    R(1, 2, 'GET /stats'),
    N(2, '(verify JWT)'),
    R(2, 3, 'Aggregate Stats'),
    L(3, 2, 'Stats + Activity'),
    L(2, 1, 'Dashboard Data'),
    L(1, 0, 'Show Analytics'),
    N(1, '(refresh: 30s)'),
  ])
);
