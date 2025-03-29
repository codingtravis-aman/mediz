import { apiRequest } from "./queryClient";
import type {
  User,
  Prescription,
  Medication,
  Reminder,
  MedicationLog,
  MedicineInfo,
} from "./types";

// Demo user id for testing
export const DEMO_USER_ID = 1;

// Auth APIs
export async function loginUser(username: string, password: string): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/login", { username, password });
  return response.json();
}

export async function registerUser(username: string, password: string, fullName: string): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/register", { username, password, fullName });
  return response.json();
}

// Prescription APIs
export async function getPrescriptions(): Promise<Prescription[]> {
  const response = await apiRequest("GET", "/api/prescriptions", undefined);
  return response.json();
}

export async function getPrescription(id: number): Promise<Prescription> {
  const response = await apiRequest("GET", `/api/prescriptions/${id}`, undefined);
  return response.json();
}

export async function createPrescription(prescription: Partial<Prescription>): Promise<Prescription> {
  const response = await apiRequest("POST", "/api/prescriptions", prescription);
  return response.json();
}

export async function updatePrescription(id: number, data: Partial<Prescription>): Promise<Prescription> {
  const response = await apiRequest("PUT", `/api/prescriptions/${id}`, data);
  return response.json();
}

// Medication APIs
export async function getMedications(): Promise<Medication[]> {
  const response = await apiRequest("GET", "/api/medications", undefined);
  return response.json();
}

export async function getMedication(id: number): Promise<Medication> {
  const response = await apiRequest("GET", `/api/medications/${id}`, undefined);
  return response.json();
}

export async function createMedication(medication: Partial<Medication>): Promise<Medication> {
  const response = await apiRequest("POST", "/api/medications", medication);
  return response.json();
}

export async function updateMedication(id: number, data: Partial<Medication>): Promise<Medication> {
  const response = await apiRequest("PUT", `/api/medications/${id}`, data);
  return response.json();
}

export async function deleteMedication(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/medications/${id}`, undefined);
}

// Reminder APIs
export async function getReminders(): Promise<Reminder[]> {
  const response = await apiRequest("GET", "/api/reminders", undefined);
  return response.json();
}

export async function getMedicationReminders(medicationId: number): Promise<Reminder[]> {
  const response = await apiRequest("GET", `/api/medications/${medicationId}/reminders`, undefined);
  return response.json();
}

export async function createReminder(reminder: Partial<Reminder>): Promise<Reminder> {
  const response = await apiRequest("POST", "/api/reminders", reminder);
  return response.json();
}

export async function updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder> {
  const response = await apiRequest("PUT", `/api/reminders/${id}`, data);
  return response.json();
}

export async function deleteReminder(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/reminders/${id}`, undefined);
}

// Medication Log APIs
export async function getMedicationLogs(medicationId: number): Promise<MedicationLog[]> {
  const response = await apiRequest("GET", `/api/medications/${medicationId}/logs`, undefined);
  return response.json();
}

export async function createMedicationLog(medicationId: number, data: Partial<MedicationLog>): Promise<MedicationLog> {
  const response = await apiRequest("POST", `/api/medications/${medicationId}/logs`, data);
  return response.json();
}

// Medicine Info APIs
export async function searchMedicineInfo(term: string): Promise<MedicineInfo[]> {
  const response = await apiRequest("GET", `/api/medicine-info?search=${encodeURIComponent(term)}`, undefined);
  return response.json();
}

export async function getMedicineInfo(name: string): Promise<MedicineInfo> {
  const response = await apiRequest("GET", `/api/medicine-info/${encodeURIComponent(name)}`, undefined);
  return response.json();
}
