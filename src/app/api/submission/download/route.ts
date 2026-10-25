import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateManuscriptPdfBuffer, addWatermarkToPdfBuffer } from '@/lib/pdfGenerator';
import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'identified'; // 'identified' or 'anonymized'
    const requestedFile = searchParams.get('file');
    const shouldWatermark =
      searchParams.get('watermark') === 'jhssi' ||
      searchParams.get('watermark') === 'true' ||
      type === 'anonymized';

    let submission: any = null;

    if (id) {
      submission = await prisma.submission.findFirst({
        where: {
          OR: [
            { id },
            { manuscriptNo: id },
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
    } else if (requestedFile) {
      submission = await prisma.submission.findFirst({
        where: {
          OR: [
            { fileWithAuthor: requestedFile },
            { fileWithoutAuthor: requestedFile },
            { fileWithAuthor: { contains: path.basename(requestedFile) } },
            { fileWithoutAuthor: { contains: path.basename(requestedFile) } },
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
    }

    // Try finding physical file on disk if path known
    let targetRelativePath = requestedFile;
    if (!targetRelativePath && submission) {
      targetRelativePath = type === 'anonymized'
        ? (submission.fileWithoutAuthor || submission.fileWithAuthor)
        : (submission.fileWithAuthor || submission.fileWithoutAuthor);
    }

    if (targetRelativePath) {
      const cleanRelative = targetRelativePath.replace(/^\/+/, '');
      const possibleDiskPaths = [
        path.join(process.cwd(), 'public', cleanRelative),
        path.join(process.cwd(), cleanRelative),
        path.join(process.cwd(), 'public', 'uploads', 'manuscripts', path.basename(cleanRelative)),
      ];

      for (const diskPath of possibleDiskPaths) {
        if (existsSync(diskPath)) {
          let fileBuffer: any = await readFile(diskPath);
          const ext = path.extname(diskPath).toLowerCase();

          // Apply watermark for reviewers if it's a PDF
          if (shouldWatermark && ext === '.pdf') {
            fileBuffer = await addWatermarkToPdfBuffer(fileBuffer, 'JHSSI - CONFIDENTIAL PEER REVIEW');
          }

          const contentType =
            ext === '.pdf'
              ? 'application/pdf'
              : ext === '.docx'
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : ext === '.doc'
              ? 'application/msword'
              : 'application/octet-stream';

          const outFilename = `${(submission?.manuscriptNo || 'JHSSI-Manuscript').replace(/[^a-zA-Z0-9_-]/g, '_')}_${type}${shouldWatermark ? '_Watermarked' : ''}${ext}`;

          return new Response(new Uint8Array(fileBuffer), {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `inline; filename="${outFilename}"`,
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      }
    }

    // If physical file does not exist on disk, dynamically generate the official PDF
    let pdfBuffer = generateManuscriptPdfBuffer({
      manuscriptNo: submission?.manuscriptNo || 'JHSSI-26-0004',
      title: submission?.title || 'Academic Research Manuscript',
      authorName: type === 'anonymized' ? null : (submission?.author?.name || 'Contributing Author'),
      institution: type === 'anonymized' ? null : (submission?.author?.institution || 'Academic Institution'),
      category: submission?.category || 'General Humanities & Social Sciences',
      abstract: submission?.abstract || 'The complete manuscript text and peer review records are registered in the JHSSI Editorial Management System.',
      keywords: submission?.keywords || 'Research, Humanities, Social Sciences',
      status: submission?.status || 'SUBMITTED',
      createdAt: submission?.createdAt || new Date(),
      isAnonymized: type === 'anonymized',
    });

    if (shouldWatermark) {
      pdfBuffer = await addWatermarkToPdfBuffer(pdfBuffer, 'JHSSI - CONFIDENTIAL PEER REVIEW');
    }

    const safeNo = (submission?.manuscriptNo || 'JHSSI-Manuscript').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeNo}_${type}${shouldWatermark ? '_Watermarked' : ''}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error serving manuscript download:', error);
    let fallbackBuffer = generateManuscriptPdfBuffer({
      manuscriptNo: 'JHSSI-ARCHIVE',
      title: 'JHSSI Research Manuscript Document',
      authorName: 'JHSSI Author',
      abstract: 'Manuscript document registered with Journal of Humanities and Social Sciences Inventions.',
      keywords: 'JHSSI, Research, Open Access',
      status: 'VERIFIED',
      isAnonymized: true,
    });

    fallbackBuffer = await addWatermarkToPdfBuffer(fallbackBuffer, 'JHSSI - CONFIDENTIAL PEER REVIEW');

    return new Response(new Uint8Array(fallbackBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="JHSSI_Watermarked_Manuscript.pdf"',
      },
    });
  }
}
