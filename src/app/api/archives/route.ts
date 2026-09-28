import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { year, quarter, title, url } = await req.json();

    if (!year || !quarter || !title || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'archives.json');
    let archivesData = [];

    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      archivesData = JSON.parse(fileData);
    }

    // Find or create year
    let yearEntry = archivesData.find((y: any) => y.year === year);
    if (!yearEntry) {
      yearEntry = { year, quarters: [] };
      archivesData.push(yearEntry);
    }

    // Find or create quarter
    let quarterEntry = yearEntry.quarters.find((q: any) => q.name === quarter);
    if (!quarterEntry) {
      quarterEntry = { name: quarter, papers: [] };
      yearEntry.quarters.push(quarterEntry);
    }

    // Add paper
    quarterEntry.papers.push({
      name: `${title}.pdf`,
      url: url
    });

    // Save back to JSON
    fs.writeFileSync(dataPath, JSON.stringify(archivesData, null, 2));

    return NextResponse.json({ message: 'Paper added to archives successfully', success: true });
  } catch (error) {
    console.error('Archives API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
