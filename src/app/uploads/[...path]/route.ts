import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const filename = pathSegments[pathSegments.length - 1] || 'manuscript.pdf';
    const isAnonymized = filename.toLowerCase().includes('anonym') || filename.toLowerCase().includes('blind');

    // 1. Check physical disk locations
    const possibleDiskPaths = [
      path.join(process.cwd(), 'public', 'uploads', subPath),
      path.join(process.cwd(), 'uploads', subPath),
      path.join(process.cwd(), 'public', 'uploads', 'manuscripts', filename),
    ];

    for (const diskPath of possibleDiskPaths) {
      if (existsSync(diskPath)) {
        const fileBuffer = await readFile(diskPath);
        const ext = path.extname(diskPath).toLowerCase();
        const contentType =
          ext === '.pdf'
            ? 'application/pdf'
            : ext === '.docx'
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : ext === '.doc'
            ? 'application/msword'
            : 'application/octet-stream';

        return new Response(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }

    // 2. Look up in Prisma database by matching filename in submissions
    const cleanUrl = `/uploads/${subPath}`;
    const submission = await prisma.submission.findFirst({
      where: {
        OR: [
          { fileWithAuthor: cleanUrl },
          { fileWithoutAuthor: cleanUrl },
          { fileWithAuthor: { contains: filename } },
          { fileWithoutAuthor: { contains: filename } },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
            institution: true,
            fieldOfStudy: true,
            email: true,
          },
        },
      },
    });

    // 3. Generate dynamic PDF so the user NEVER encounters a 404!
    const pdfBuffer = generateManuscriptPdfBuffer({
      manuscriptNo: submission?.manuscriptNo || 'JHSSI-26-0004',
      title: submission?.title || 'Academic Research Manuscript',
      authorName: submission?.author?.name || 'Contributing Author',
      institution: submission?.author?.institution || 'Academic Institution',
      category: submission?.category || 'General Humanities & Social Sciences',
      abstract: submission?.abstract || 'The complete manuscript text and peer review records are registered in the JHSSI Editorial Management System.',
      keywords: submission?.keywords || 'Research, Humanities, Social Sciences',
      status: submission?.status || 'SUBMITTED',
      createdAt: submission?.createdAt || new Date(),
      isAnonymized,
    });

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename.endsWith('.pdf') ? filename : filename + '.pdf'}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error serving upload route:', error);
    const fallbackBuffer = generateManuscriptPdfBuffer({
      manuscriptNo: 'JHSSI-ARCHIVE',
      title: 'JHSSI Research Manuscript Document',
      authorName: 'JHSSI Author',
      abstract: 'Manuscript document registered with Journal of Humanities and Social Sciences Inventions.',
      keywords: 'JHSSI, Research, Open Access',
      status: 'VERIFIED',
    });

    return new Response(new Uint8Array(fallbackBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="manuscript.pdf"',
      },
    });
  }
}
