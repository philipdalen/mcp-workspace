// Shared synthetic Telegram data for tests. No real Telegram files or tokens.

export const FAKE_TOKEN = '123456:FAKE-test-token-not-real';

// Minimal single-page PDF with a correct xref table.
function buildPdf() {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    null,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  const stream = 'BT /F1 12 Tf 20 100 Td (Synthetic support request) Tj ET';
  objects[3] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

export const PDF_BYTES = buildPdf();

// 1x1 transparent PNG.
export const PNG_BYTES = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

// file_id -> Telegram getFile file_path. The fetch mock keys its behaviour off file_path.
export const FILES = {
  pdf: 'documents/file_398.pdf',
  image: 'photos/file_12.jpg',
  missing: 'documents/file_404.pdf',
  slow: 'documents/file_slow.pdf',
  leaky: 'documents/file_leaky.pdf',
  traversal: 'documents/../../../../evil name;rm -rf.pdf',
  dotfile: 'documents/..',
};
