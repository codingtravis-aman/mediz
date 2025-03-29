import Tesseract from 'tesseract.js';
import { OcrResult } from './types';

// Languages supported by Tesseract
export const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'hin', name: 'Hindi' },
];

export async function processImage(file: File, language = 'eng'): Promise<OcrResult> {
  try {
    const worker = await Tesseract.createWorker(language);
    
    // Process the image
    const { data } = await worker.recognize(file);
    
    // Parse the text to identify medications
    const result = parseOcrText(data.text);
    
    // Clean up worker
    await worker.terminate();
    
    return {
      ...result,
      text: data.text,
      language,
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to process prescription image');
  }
}

function parseOcrText(text: string): Partial<OcrResult> {
  const result: Partial<OcrResult> = {
    patientInfo: {},
    medications: []
  };
  
  // Try to extract patient information
  const nameMatch = text.match(/Name:?\s*([A-Za-z\s]+)/i);
  const ageMatch = text.match(/Age:?\s*(\d+)\s*(?:years|yrs)?/i);
  const dateMatch = text.match(/Date:?\s*(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4})/i);
  
  if (nameMatch && nameMatch[1]) result.patientInfo!.name = nameMatch[1].trim();
  if (ageMatch && ageMatch[1]) result.patientInfo!.age = ageMatch[1].trim();
  if (dateMatch && dateMatch[1]) result.patientInfo!.date = dateMatch[1].trim();
  
  // Try to extract medications
  // This is a simplified approach, real-world implementations would be more complex
  const lines = text.split('\n');
  const medications: any[] = [];
  
  // Common medication patterns
  const medRegexes = [
    /([A-Za-z]+)\s+(\d+\s*(?:mg|g|ml))\s*-\s*([^,\.]+)/i,  // Format: Medication 500mg - 1 tablet daily
    /(\d+\.\s*)([A-Za-z]+)\s+(\d+\s*(?:mg|g|ml))\s*([^,\.]+)/i, // Format: 1. Medication 500mg instructions
  ];
  
  lines.forEach(line => {
    for (const regex of medRegexes) {
      const match = line.match(regex);
      if (match) {
        const medication = {
          name: match[1].trim(),
          dosage: match[2].trim(),
          instructions: match[3].trim(),
        };
        medications.push(medication);
        break;
      }
    }
  });
  
  if (medications.length > 0) {
    result.medications = medications;
  }
  
  return result;
}
