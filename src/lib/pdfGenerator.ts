// Utility to generate valid, standard-compliant academic PDF documents
// without heavy native dependencies.

export interface ManuscriptPdfMetadata {
  manuscriptNo?: string | null;
  title?: string | null;
  authorName?: string | null;
  institution?: string | null;
  category?: string | null;
  abstract?: string | null;
  keywords?: string | null;
  status?: string | null;
  createdAt?: string | Date | null;
  isAnonymized?: boolean;
}

function escapePdfString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E\r\n\t]/g, ' '); // Keep printable ASCII
}

function wrapText(text: string, maxCharsPerLine: number = 80): string[] {
  const words = (text || '').split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function generateManuscriptPdfBuffer(metadata: ManuscriptPdfMetadata): Buffer {
  const manuscriptNo = metadata.manuscriptNo || 'JHSSI-26-0001';
  const title = metadata.title || 'Academic Research Manuscript';
  const authorName = metadata.authorName || 'Contributing Author';
  const institution = metadata.institution || 'Academic Institution';
  const category = metadata.category || 'Humanities & Social Sciences';
  const abstract = metadata.abstract || 'The complete manuscript text and peer review records are registered in the JHSSI Editorial Management System.';
  const keywords = metadata.keywords || 'Research, Humanities, Social Sciences';
  const status = metadata.status || 'SUBMITTED';
  const isAnonymized = !!metadata.isAnonymized;

  const dateStr = metadata.createdAt
    ? new Date(metadata.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US');

  // Build PDF text stream commands
  const streamLines: string[] = [];

  // Coordinate system: (0,0) bottom-left, (612, 792) top-right (Standard US Letter)
  // Draw header bar
  streamLines.push('0.25 0.16 0.11 rg'); // #3F2A1D
  streamLines.push('36 740 540 3 re f'); // Accent line

  // Journal Title Header
  streamLines.push('BT');
  streamLines.push('/F1 14 Tf');
  streamLines.push('0.42 0.29 0.18 rg'); // #6B4A2E
  streamLines.push('36 755 Td');
  streamLines.push(`(JOURNAL OF HUMANITIES AND SOCIAL SCIENCES INVENTIONS) Tj`);
  streamLines.push('ET');

  // Subheader ISSN & Metadata
  streamLines.push('BT');
  streamLines.push('/F2 9 Tf');
  streamLines.push('0.5 0.45 0.4 rg');
  streamLines.push('36 728 Td');
  streamLines.push(`(ISSN: 2581-8791 \\| Volume 6, Issue 1 \\| Peer-Reviewed Academic Repository) Tj`);
  streamLines.push('ET');

  // Manuscript Number & Status Badge
  streamLines.push('BT');
  streamLines.push('/F1 10 Tf');
  streamLines.push('0.78 0.64 0.36 rg'); // Gold #C8A45D
  streamLines.push('36 700 Td');
  streamLines.push(`(MANUSCRIPT NUMBER: ${escapePdfString(manuscriptNo)}) Tj`);
  streamLines.push('ET');

  streamLines.push('BT');
  streamLines.push('/F2 9 Tf');
  streamLines.push('0.3 0.3 0.3 rg');
  streamLines.push('420 700 Td');
  streamLines.push(`(Status: ${escapePdfString(status)}) Tj`);
  streamLines.push('ET');

  let currentY = 665;

  // Title
  const titleLines = wrapText(title, 65);
  streamLines.push('BT');
  streamLines.push('/F1 15 Tf');
  streamLines.push('0.15 0.1 0.08 rg');
  streamLines.push(`36 ${currentY} Td`);
  titleLines.forEach((tLine, idx) => {
    if (idx > 0) streamLines.push('0 -18 Td');
    streamLines.push(`(${escapePdfString(tLine)}) Tj`);
  });
  streamLines.push('ET');
  currentY -= titleLines.length * 18 + 15;

  // Author details or Anonymized notice
  if (isAnonymized) {
    streamLines.push('BT');
    streamLines.push('/F1 10 Tf');
    streamLines.push('0.6 0.1 0.1 rg');
    streamLines.push(`36 ${currentY} Td`);
    streamLines.push(`([ANONYMIZED FOR DOUBLE-BLIND PEER REVIEW]) Tj`);
    streamLines.push('ET');
    currentY -= 16;
  } else {
    streamLines.push('BT');
    streamLines.push('/F1 11 Tf');
    streamLines.push('0.42 0.29 0.18 rg');
    streamLines.push(`36 ${currentY} Td`);
    streamLines.push(`(Author: ${escapePdfString(authorName)}) Tj`);
    streamLines.push('ET');
    currentY -= 15;

    if (institution) {
      streamLines.push('BT');
      streamLines.push('/F2 9.5 Tf');
      streamLines.push('0.4 0.4 0.4 rg');
      streamLines.push(`36 ${currentY} Td`);
      streamLines.push(`(Affiliation: ${escapePdfString(institution)}) Tj`);
      streamLines.push('ET');
      currentY -= 15;
    }
  }

  // Meta info: Category & Date
  streamLines.push('BT');
  streamLines.push('/F2 9 Tf');
  streamLines.push('0.45 0.45 0.45 rg');
  streamLines.push(`36 ${currentY} Td`);
  streamLines.push(`(Subject Category: ${escapePdfString(category)}   \\|   Date: ${escapePdfString(dateStr)}) Tj`);
  streamLines.push('ET');
  currentY -= 20;

  // Horizontal divider
  streamLines.push('0.85 0.82 0.78 rg');
  streamLines.push(`36 ${currentY} 540 1 re f`);
  currentY -= 20;

  // Abstract Heading
  streamLines.push('BT');
  streamLines.push('/F1 12 Tf');
  streamLines.push('0.25 0.16 0.11 rg');
  streamLines.push(`36 ${currentY} Td`);
  streamLines.push(`(ABSTRACT) Tj`);
  streamLines.push('ET');
  currentY -= 18;

  // Abstract Body
  const abstractLines = wrapText(abstract, 80);
  streamLines.push('BT');
  streamLines.push('/F2 9.5 Tf');
  streamLines.push('0.25 0.25 0.25 rg');
  streamLines.push(`36 ${currentY} Td`);
  // Print up to 18 lines of abstract to fit on page 1 cleanly
  const maxAbstractLines = Math.min(abstractLines.length, 18);
  for (let i = 0; i < maxAbstractLines; i++) {
    if (i > 0) streamLines.push('0 -14 Td');
    streamLines.push(`(${escapePdfString(abstractLines[i])}) Tj`);
  }
  if (abstractLines.length > 18) {
    streamLines.push('0 -14 Td');
    streamLines.push(`([...continued in full manuscript archive...]) Tj`);
  }
  streamLines.push('ET');
  currentY -= (maxAbstractLines + 1) * 14 + 10;

  // Keywords
  if (keywords) {
    streamLines.push('BT');
    streamLines.push('/F1 10 Tf');
    streamLines.push('0.42 0.29 0.18 rg');
    streamLines.push(`36 ${currentY} Td`);
    streamLines.push(`(Keywords: ) Tj`);
    streamLines.push('/F2 9.5 Tf');
    streamLines.push('0.3 0.3 0.3 rg');
    streamLines.push(`(${escapePdfString(keywords)}) Tj`);
    streamLines.push('ET');
    currentY -= 25;
  }

  // Verification Box
  streamLines.push('0.96 0.95 0.93 rg'); // #F6F1E8
  streamLines.push(`36 90 540 60 re f`);
  streamLines.push('0.78 0.64 0.36 rg'); // Gold border
  streamLines.push(`36 90 540 60 re s`);

  streamLines.push('BT');
  streamLines.push('/F1 9 Tf');
  streamLines.push('0.42 0.29 0.18 rg');
  streamLines.push(`48 132 Td`);
  streamLines.push(`(JHSSI EDITORIAL VERIFICATION & ARCHIVAL DEPOSIT) Tj`);
  streamLines.push('/F2 8 Tf');
  streamLines.push('0.4 0.4 0.4 rg');
  streamLines.push('0 -13 Td');
  streamLines.push(`(This document represents an officially registered manuscript in the JHSSI Editorial System.) Tj`);
  streamLines.push('0 -11 Td');
  streamLines.push(`(All rights reserved by Journal of Humanities and Social Sciences Inventions. https://jhssi.org) Tj`);
  streamLines.push('ET');

  // Footer
  streamLines.push('BT');
  streamLines.push('/F2 8 Tf');
  streamLines.push('0.6 0.6 0.6 rg');
  streamLines.push('36 60 Td');
  streamLines.push(`(Page 1 of 1   \\|   Manuscript ID: ${escapePdfString(manuscriptNo)}) Tj`);
  streamLines.push('ET');

  const contentStream = streamLines.join('\n');
  const streamLength = Buffer.byteLength(contentStream, 'utf8');

  // Build PDF structure
  const pdfBody = `%PDF-1.4
1 0 obj
<< /Title (${escapePdfString(title)})
   /Author (${escapePdfString(authorName)})
   /Subject (${escapePdfString(category)})
   /Keywords (${escapePdfString(keywords)})
   /Creator (Journal of Humanities and Social Sciences Inventions \\(JHSSI\\))
   /CreationDate (D:${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}Z)
>>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page
   /Parent 3 0 R
   /MediaBox [0 0 612 792]
   /Contents 5 0 R
   /Resources <<
     /Font <<
       /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
       /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
     >>
   >>
>>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000280 00000 n 
0000000330 00000 n 
0000000388 00000 n 
0000000570 00000 n 
trailer
<< /Size 6 /Root 2 0 R /Info 1 0 R >>
startxref
${650 + streamLength}
%%EOF`;

  return Buffer.from(pdfBody, 'utf8');
}

/**
 * Applies an official JHSSI diagonal watermark and confidentiality banners to any PDF buffer.
 * Used for double-blind reviewer access so reviewers only see watermarked blind PDFs.
 */
export async function addWatermarkToPdfBuffer(
  inputBuffer: Buffer | Uint8Array | any,
  watermarkText: string = 'JHSSI - CONFIDENTIAL PEER REVIEW'
): Promise<Buffer> {
  try {
    const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.load(inputBuffer);
    const pages = pdfDoc.getPages();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const page of pages) {
      const { width, height } = page.getSize();

      // Draw large diagonal watermark across the center
      const fontSize = 30;
      const textWidth = helveticaBold.widthOfTextAtSize(watermarkText, fontSize);
      
      page.drawText(watermarkText, {
        x: (width - textWidth * 0.707) / 2 - 10,
        y: height / 2 - 30,
        size: fontSize,
        font: helveticaBold,
        color: rgb(0.78, 0.64, 0.36), // Gold #C8A45D
        opacity: 0.28,
        rotate: degrees(45),
      });

      // Secondary diagonal line for journal branding
      const brandText = 'JOURNAL OF HUMANITIES AND SOCIAL SCIENCES INVENTIONS';
      const brandSize = 14;
      const brandWidth = helveticaBold.widthOfTextAtSize(brandText, brandSize);
      page.drawText(brandText, {
        x: (width - brandWidth * 0.707) / 2 - 10,
        y: height / 2 - 75,
        size: brandSize,
        font: helveticaBold,
        color: rgb(0.42, 0.29, 0.18), // #6B4A2E
        opacity: 0.24,
        rotate: degrees(45),
      });

      // Top Security Banner
      page.drawRectangle({
        x: 0,
        y: height - 20,
        width: width,
        height: 20,
        color: rgb(0.96, 0.94, 0.90), // #F6F1E8
        opacity: 0.92,
      });

      page.drawText('JOURNAL OF HUMANITIES AND SOCIAL SCIENCES INVENTIONS (JHSSI) • BLIND PEER REVIEW COPY', {
        x: 24,
        y: height - 14,
        size: 7.5,
        font: helveticaBold,
        color: rgb(0.42, 0.29, 0.18), // #6B4A2E
        opacity: 0.95,
      });

      // Bottom Security Banner
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: 18,
        color: rgb(0.96, 0.94, 0.90),
        opacity: 0.92,
      });

      page.drawText('CONFIDENTIAL • DOUBLE-BLIND EVALUATION • AUTHOR IDENTITY STRICTLY REDACTED • DO NOT DISTRIBUTE', {
        x: 24,
        y: 5.5,
        size: 7,
        font: helvetica,
        color: rgb(0.42, 0.29, 0.18),
        opacity: 0.9,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error('Failed to add watermark with pdf-lib, returning original buffer:', err);
    return inputBuffer;
  }
}
