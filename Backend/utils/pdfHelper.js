import PdfParser from "pdf2json";

// --------- PDF Text Extraction Helper ---------
export default async function extractPdfTextWithPdf2json(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PdfParser();
    pdfParser.on("pdfParser_dataError", errData => {
      console.error("pdf2json error:", errData.parserError);
      reject(new Error(errData.parserError));
    });
    pdfParser.on("pdfParser_dataReady", pdfData => {
      let pages = [];
      if (pdfData.formImage && pdfData.formImage.Pages) {
        pages = pdfData.formImage.Pages;
      } else if (pdfData.Pages) {
        pages = pdfData.Pages;
      } else {
        const errorMsg = "Parsed PDF data missing expected 'Pages' structure.";
        console.error(errorMsg, pdfData);
        return reject(new Error(errorMsg));
      }

      let fullText = "";
      for (const page of pages) {
        if (page.Texts && Array.isArray(page.Texts)) {
          for (const text of page.Texts) {
            const txt = text.R.map(r => decodeURIComponent(r.T)).join(" ");
            fullText += txt + " ";
          }
          fullText += "\n";
        }
      }
      resolve(fullText);
    });
    pdfParser.loadPDF(filePath);
  });
}