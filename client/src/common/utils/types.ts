// Common types used across the application

export interface User {
  id: number;
  username: string;
  fullName: string;
}

export interface Prescription {
  id: number;
  userId: number;
  title: string;
  uploadDate: string;
  source?: string;
  status: string;
  originalImage?: string;
  translatedText?: string;
  language?: string;
  medicationsCount: number;
}

export interface Medication {
  id: number;
  userId: number;
  prescriptionId?: number;
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  status: string;
  medicationType?: string;
  isActive: boolean;
}

export interface Reminder {
  id: number;
  medicationId: number;
  userId: number;
  time: string;
  daysOfWeek: string[];
  isActive: boolean;
  lastNotified?: string;
}

export interface MedicationLog {
  id: number;
  medicationId: number;
  userId: number;
  status: string;
  logDate: string;
  notes?: string;
}

export interface MedicineInfo {
  id: number;
  name: string;
  genericName?: string;
  category?: string;
  uses?: string;
  sideEffects?: string;
  precautions?: string;
  interactions?: string;
  dosageInstructions?: string;
}

export interface OcrResult {
  patientInfo?: {
    name?: string;
    age?: string;
    date?: string;
  };
  medications?: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
  text: string;
  language: string;
}
