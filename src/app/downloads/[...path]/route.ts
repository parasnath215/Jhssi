import { NextRequest } from 'next/server';
import { generateManuscriptPdfBuffer } from '@/lib/pdfGenerator';
import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const subPath = pathSegments.join('/');
    const filename = pathSegments[pathSegments.length - 1] || 'download.pdf';

    const diskPath = path.join(process.cwd(), 'public', 'downloads', subPath);
    if (existsSync(diskPath)) {
      const buffer = await readFile(diskPath);
      const ext = path.extname(diskPath).toLowerCase();
      const contentType =
        ext === '.pdf'
          ? 'application/pdf'
          : ext === '.docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/octet-stream';

      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // Dynamic fallback for issue full PDF
    const issuePdf = generateManuscriptPdfBuffer({
      manuscriptNo: 'JHSSI-VOL6-ISSUE1',
      title: 'JHSSI Complete Issue Compendium - Volume 6, Issue 1 (2026)',
      authorName: 'JHSSI Editorial Board & Contributors',
      institution: 'Journal of Humanities and Social Sciences Inventions',
      category: 'Complete Issue Volume',
      abstract: 'This publication contains the complete collection of peer-reviewed articles, editorial leadership communications, and scholarly research published in Journal of Humanities and Social Sciences Inventions (JHSSI).',
      keywords: 'JHSSI, Complete Issue, Academic Journal, Open Access',
      status: 'PUBLISHED',
    });

    return new Response(new Uint8Array(issuePdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename.endsWith('.pdf') ? filename : filename + '.pdf'}"`,
      },
    });
  } catch (error) {
    console.error('Error serving /downloads/[...path]:', error);
    const fallback = generateManuscriptPdfBuffer({
      manuscriptNo: 'JHSSI-DOWNLOAD',
      title: 'JHSSI Journal Document',
      authorName: 'Editorial Board',
      status: 'OFFICIAL',
    });
    return new Response(new Uint8Array(fallback), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="JHSSI_Document.pdf"',
      },
    });
  }
}
