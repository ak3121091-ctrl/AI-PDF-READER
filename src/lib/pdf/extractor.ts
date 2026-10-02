import pdfParse from 'pdf-parse';

export interface ExtractedPdf {
  pageCount: number;
  text: string;
  pages: { pageNumber: number; text: string }[];
  info?: any;
  isScanned?: boolean;
}

export async function extractTextFromPdf(buffer: Buffer): Promise<ExtractedPdf> {
  const pages: { pageNumber: number; text: string }[] = [];

  const options = {
    pagerender: function (pageData: any) {
      return pageData.getTextContent().then(function (textContent: any) {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        const cleaned = text.trim();
        pages.push({
          pageNumber: pages.length + 1,
          text: cleaned,
        });
        return text;
      }).catch(function (pageErr: any) {
        console.warn(`Warning: Could not parse text for page ${pages.length + 1}:`, pageErr?.message || pageErr);
        pages.push({
          pageNumber: pages.length + 1,
          text: '',
        });
        return '';
      });
    },
  };

  try {
    const data = await pdfParse(buffer, options);

    // If pagerender didn't populate individual pages cleanly, fallback to splitting by form feeds
    if (pages.length === 0 && data.text) {
      const rawPages = data.text.split('\f');
      rawPages.forEach((p, idx) => {
        if (p.trim()) {
          pages.push({
            pageNumber: idx + 1,
            text: p.trim(),
          });
        }
      });
    }

    // Ensure pages array matches page count
    if (pages.length === 0 && data.text && data.text.trim().length > 0) {
      pages.push({
        pageNumber: 1,
        text: data.text.trim(),
      });
    }

    // Verify text content exists
    const totalChars = (data.text || '').replace(/\s+/g, '').length;
    if (totalChars < 20 || pages.every((p) => p.text.trim().length === 0)) {
      throw new Error(
        'Unable to extract text from document. Scanned documents or images without a selectable text layer cannot be analyzed. Please upload a PDF with embedded text.'
      );
    }

    return {
      pageCount: data.numpages || pages.length,
      text: data.text.trim(),
      pages,
      info: data.info,
      isScanned: false,
    };
  } catch (error: any) {
    console.error('PDF parsing error:', error?.message || error);
    
    // If it was our explicit validation error, rethrow directly
    if (error.message && error.message.includes('Scanned documents or images without a selectable text layer')) {
      throw error;
    }

    // Attempt secondary raw text recovery from text stream operators
    const rawString = buffer.toString('utf-8');
    if (rawString.includes('%PDF')) {
      const tjMatches = Array.from(rawString.matchAll(/\(([^)]+)\)\s*(?:Tj|'|")/g))
        .map((m) => m[1].trim())
        .filter((s) => s.length > 0);

      const tjArrayMatches = Array.from(rawString.matchAll(/\[(.*?)\]\s*TJ/gi))
        .map((m) => {
          const innerMatches = Array.from(m[1].matchAll(/\(([^)]+)\)/g)).map((x) => x[1]);
          return innerMatches.join(' ').trim();
        })
        .filter((s) => s.length > 0);

      const allMatches = [...tjMatches, ...tjArrayMatches];

      if (allMatches.length > 0) {
        const streamText = allMatches.join('\n');
        return {
          pageCount: 1,
          text: streamText,
          pages: [{ pageNumber: 1, text: streamText }],
          isScanned: false,
        };
      }
    }

    throw new Error(`Invalid or corrupted PDF file: ${error.message || 'Unable to parse document structure'}`);
  }
}
