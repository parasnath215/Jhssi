import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = formData.get('documentType') as string || 'manuscript';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 25MB' },
        { status: 400 }
      );
    }

    // Validate file extension
    const originalName = file.name;
    const extension = path.extname(originalName).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.rtf', '.txt'];

    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed formats: PDF, DOC, DOCX, RTF' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'manuscripts');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate collision-safe unique filename
    const sanitizedBase = path.basename(originalName, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const uniqueFileName = `${documentType}_${timestamp}_${randomSuffix}${extension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/manuscripts/${uniqueFileName}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: publicUrl,
      fileName: uniqueFileName,
      originalName,
      size: file.size,
      documentType,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
