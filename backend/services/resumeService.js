import fs from 'fs';
import pdf from 'pdf-parse';

/**
 * Extracts all plain text from a PDF resume file on disk
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text contents
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdf(dataBuffer);
    return parsedData.text || '';
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error('Failed to parse PDF resume content. Ensure the file is not corrupted.');
  }
};
