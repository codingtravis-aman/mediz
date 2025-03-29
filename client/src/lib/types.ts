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

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  hours?: string;
  deliveryAvailable: boolean;
  deliveryFee?: number;
  minimumOrderAmount?: number;
  estimatedDeliveryTime?: string;
  rating?: number;
  reviewCount?: number;
}

export interface PharmacyOrder {
  id: number;
  userId: number;
  pharmacyId: number;
  prescriptionId?: number;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryContact: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  totalAmount: number;
  discount?: number;
  deliveryFee: string;
  notes?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
}

export interface PharmacyOrderItem {
  id: number;
  orderId: number;
  medicationName: string;
  quantity: number;
  price: string;
  substituteAllowed: boolean;
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
