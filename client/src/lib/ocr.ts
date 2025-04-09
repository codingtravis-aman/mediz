import Tesseract from 'tesseract.js';
import { OcrResult } from './types';

// Languages supported by Tesseract
export const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'hin', name: 'Hindi' },
  { code: 'mar', name: 'Marathi' },
  { code: 'ben', name: 'Bengali' },
  { code: 'tam', name: 'Tamil' },
  { code: 'tel', name: 'Telugu' },
  { code: 'pan', name: 'Punjabi' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'urd', name: 'Urdu' },
];

/**
 * Process an image using OCR to extract text and medication information
 */
export async function processImage(file: File, language = 'eng'): Promise<OcrResult> {
  try {
    // Initialize the worker for the requested language
    const worker = await Tesseract.createWorker(language);
    
    // Log progress to console for debugging
    console.log(`Starting OCR processing for language: ${language}`);
    
    // Process the image
    const { data } = await worker.recognize(file);
    
    console.log('OCR text extraction complete');
    
    // Parse the text to identify medications and patient info
    const result = parseOcrText(data.text);
    
    // Clean up worker
    await worker.terminate();
    
    // Return fully populated result
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

/**
 * Enhanced parsing function that uses regex patterns to extract structured data
 * from the OCR text.
 */
function parseOcrText(text: string): Partial<OcrResult> {
  const result: Partial<OcrResult> = {
    patientInfo: {},
    medications: []
  };
  
  // Try to extract patient information with more flexible pattern matching
  // Name patterns - capture various formats like "Name: John Doe" or "Patient: John Doe"
  const namePatterns = [
    /(?:Name|Patient|Patient Name):?\s*([A-Za-z\s\.]+)(?:\r|\n|,)/i,
    /(?:Name|Patient|Patient Name):?\s*([A-Za-z\s\.]+)(?=\s*Age|\s*Gender)/i,
    /(?:^|\n)([A-Za-z\s\.]{2,20})(?:,|\s+)(?:\d{1,3}\s*(?:yrs|years|Y))/i, // Name followed by age
  ];
  
  // Age patterns - various formats like "Age: 45 years" or "45 yrs"
  const agePatterns = [
    /(?:Age|Years):?\s*(\d{1,3})\s*(?:years|yrs|Y)?/i,
    /(?:^|\n)(?:[A-Za-z\s\.]{2,20})(?:,|\s+)(\d{1,3})\s*(?:yrs|years|Y)/i, // Name followed by age
  ];
  
  // Date patterns - various date formats
  const datePatterns = [
    /(?:Date):?\s*(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4})/i,
    /(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4})/i, // Any date format as fallback
  ];
  
  // Try each pattern for patient information
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.patientInfo!.name = match[1].trim();
      break;
    }
  }
  
  for (const pattern of agePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.patientInfo!.age = match[1].trim();
      break;
    }
  }
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.patientInfo!.date = match[1].trim();
      break;
    }
  }
  
  // Split the text into lines for medication parsing
  const lines = text.split('\n');
  const medications: any[] = [];
  
  // Enhanced medication patterns for different prescription styles
  const medRegexes = [
    // Format: Medication 500mg - 1 tablet daily
    /([A-Za-z\s]+)\s+(\d+\s*(?:mg|g|ml|mcg))\s*[-–]\s*([^,\.]+)/i,
    
    // Format: 1. Medication 500mg instructions
    /(?:\d+\.\s*)([A-Za-z\s]+)\s+(\d+\s*(?:mg|g|ml|mcg))\s*([^,\.]+)/i,
    
    // Format: Tab./Cap. Medication 500mg
    /(?:Tab\.?|Cap\.?|Tablet|Capsule)\s+([A-Za-z\s]+)\s+(\d+\s*(?:mg|g|ml|mcg))\s*(?:[-–])?([^,\.]*)/i,
    
    // Format: Medication - 1 bd/tid/daily with frequency
    /([A-Za-z\s]+)(?:[-–]|\s+)(?:Tab\.?|Cap\.?|Tablet|Capsule)?\s+(?:(\d+\s*(?:mg|g|ml|mcg)))?[\s\-]*([^,\.]*(?:once|twice|bd|tid|qid|daily|weekly|morning|night|evening|before|after|meal|food)[^,\.]*)/i,
    
    // Catch-all for numbered lists with medication names (relies on post-processing)
    /(?:\d+\.\s*)([A-Za-z\s]{3,})/i
  ];
  
  // Process each line to extract medication information
  lines.forEach(line => {
    // Skip very short lines as they're unlikely to contain complete medication info
    if (line.trim().length < 5) return;
    
    // Try each regex pattern
    for (const regex of medRegexes) {
      const match = line.match(regex);
      if (match) {
        const medication: any = {
          name: match[1].trim(),
          dosage: match[2] ? match[2].trim() : "",
          instructions: match[3] ? match[3].trim() : "",
        };
        
        // Ensure we have a valid medication name (at least 2 characters)
        if (medication.name.length >= 2) {
          // If instructions are empty but we have dosage, use that as minimal instructions
          if (!medication.instructions && medication.dosage) {
            medication.instructions = `Take as directed - ${medication.dosage}`;
          }
          
          // If we don't have dosage but have instructions, try to extract dosage from instructions
          if (!medication.dosage && medication.instructions) {
            const dosageMatch = medication.instructions.match(/\d+\s*(?:mg|g|ml|mcg)/i);
            if (dosageMatch) {
              medication.dosage = dosageMatch[0].trim();
            }
          }
          
          medications.push(medication);
          break;
        }
      }
    }
  });
  
  // Final cleanup: remove duplicate medications by name
  const uniqueMeds = medications.reduce((acc: any[], current) => {
    const x = acc.find(item => item.name.toLowerCase() === current.name.toLowerCase());
    if (!x) {
      acc.push(current);
    } else {
      // If duplicate found, keep the one with more information
      const existingInfo = (x.dosage?.length || 0) + (x.instructions?.length || 0);
      const newInfo = (current.dosage?.length || 0) + (current.instructions?.length || 0);
      
      if (newInfo > existingInfo) {
        // Replace with more detailed version
        const index = acc.findIndex(item => item.name.toLowerCase() === current.name.toLowerCase());
        acc[index] = current;
      }
    }
    return acc;
  }, []);
  
  if (uniqueMeds.length > 0) {
    result.medications = uniqueMeds;
  }
  
  return result;
}
