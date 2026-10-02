import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = db.getDocument(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    let buffer = db.getPdfBuffer(id);

    // If no raw buffer saved on disk yet (e.g. for initial seeded documents),
    // synthesize a minimal valid PDF container with the document title and text
    if (!buffer) {
      const pages = db.getPages(id);
      const textPreview = pages[0]?.text?.slice(0, 300) || doc.title;
      const cleanContent = textPreview.replace(/[^a-zA-Z0-9 .,:;!?()'-]/g, ' ');

      const minimalPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >>
endobj
4 0 obj
<< /Length ${cleanContent.length + 80} >>
stream
BT
/F1 14 Tf
70 720 Td
(${doc.title.slice(0, 50)}) Tj
/F1 10 Tf
0 -30 Td
(${cleanContent.slice(0, 90)}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
400
%%EOF`;
      buffer = Buffer.from(minimalPdf);
      db.savePdfFile(id, buffer);
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${doc.fileName || `${doc.id}.pdf`}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
