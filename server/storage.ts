import {
  users, prescriptions, medications, reminders, medicationLogs, medicineInfo,
  type User, type InsertUser,
  type Prescription, type InsertPrescription,
  type Medication, type InsertMedication,
  type Reminder, type InsertReminder,
  type MedicationLog, type InsertMedicationLog,
  type MedicineInfo, type InsertMedicineInfo
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Prescription operations
  getPrescriptions(userId: number): Promise<Prescription[]>;
  getPrescription(id: number): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: number, data: Partial<Prescription>): Promise<Prescription | undefined>;

  // Medication operations
  getMedications(userId: number): Promise<Medication[]>;
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, data: Partial<Medication>): Promise<Medication | undefined>;
  deleteMedication(id: number): Promise<boolean>;

  // Reminder operations
  getReminders(userId: number): Promise<Reminder[]>;
  getRemindersByMedication(medicationId: number): Promise<Reminder[]>;
  getReminder(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;

  // Medication Log operations
  getMedicationLogs(medicationId: number): Promise<MedicationLog[]>;
  createMedicationLog(log: InsertMedicationLog): Promise<MedicationLog>;

  // Medicine Info operations
  getMedicineInfo(name: string): Promise<MedicineInfo | undefined>;
  searchMedicineInfo(term: string): Promise<MedicineInfo[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prescriptions: Map<number, Prescription>;
  private medications: Map<number, Medication>;
  private reminders: Map<number, Reminder>;
  private medicationLogs: Map<number, MedicationLog>;
  private medicineInfo: Map<number, MedicineInfo>;
  
  private userId: number = 1;
  private prescriptionId: number = 1;
  private medicationId: number = 1;
  private reminderId: number = 1;
  private medicationLogId: number = 1;
  private medicineInfoId: number = 1;

  constructor() {
    this.users = new Map();
    this.prescriptions = new Map();
    this.medications = new Map();
    this.reminders = new Map();
    this.medicationLogs = new Map();
    this.medicineInfo = new Map();

    // Adding some sample medicine info
    this.seedMedicineInfo();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Prescription operations
  async getPrescriptions(userId: number): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values()).filter(
      (prescription) => prescription.userId === userId,
    );
  }

  async getPrescription(id: number): Promise<Prescription | undefined> {
    return this.prescriptions.get(id);
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const id = this.prescriptionId++;
    const uploadDate = new Date();
    const prescription: Prescription = { 
      ...insertPrescription, 
      id, 
      uploadDate,
      status: "processed",
      medicationsCount: 0,
      source: insertPrescription.source || null,
      originalImage: insertPrescription.originalImage || null,
      translatedText: insertPrescription.translatedText || null,
      language: insertPrescription.language || null
    };
    this.prescriptions.set(id, prescription);
    return prescription;
  }

  async updatePrescription(id: number, data: Partial<Prescription>): Promise<Prescription | undefined> {
    const prescription = this.prescriptions.get(id);
    if (!prescription) return undefined;
    
    const updatedPrescription = { ...prescription, ...data };
    this.prescriptions.set(id, updatedPrescription);
    return updatedPrescription;
  }

  // Medication operations
  async getMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      (medication) => medication.userId === userId,
    );
  }

  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const id = this.medicationId++;
    const startDate = insertMedication.startDate || new Date();
    
    const medication: Medication = { 
      ...insertMedication, 
      id,
      status: "active",
      isActive: true,
      startDate,
      prescriptionId: insertMedication.prescriptionId || null,
      duration: insertMedication.duration || null,
      endDate: insertMedication.endDate || null,
      instructions: insertMedication.instructions || null,
      medicationType: insertMedication.medicationType || null
    };
    this.medications.set(id, medication);

    // If this is linked to a prescription, update the medications count
    if (medication.prescriptionId) {
      const prescription = this.prescriptions.get(medication.prescriptionId);
      if (prescription) {
        this.prescriptions.set(medication.prescriptionId, {
          ...prescription,
          medicationsCount: (prescription.medicationsCount || 0) + 1
        });
      }
    }

    return medication;
  }

  async updateMedication(id: number, data: Partial<Medication>): Promise<Medication | undefined> {
    const medication = this.medications.get(id);
    if (!medication) return undefined;
    
    const updatedMedication = { ...medication, ...data };
    this.medications.set(id, updatedMedication);
    return updatedMedication;
  }

  async deleteMedication(id: number): Promise<boolean> {
    return this.medications.delete(id);
  }

  // Reminder operations
  async getReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(
      (reminder) => reminder.userId === userId,
    );
  }

  async getRemindersByMedication(medicationId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(
      (reminder) => reminder.medicationId === medicationId,
    );
  }

  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.reminderId++;
    const reminder: Reminder = { 
      ...insertReminder, 
      id,
      isActive: true,
      lastNotified: null
    };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...data };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }

  // Medication Log operations
  async getMedicationLogs(medicationId: number): Promise<MedicationLog[]> {
    return Array.from(this.medicationLogs.values())
      .filter(log => log.medicationId === medicationId)
      .sort((a, b) => {
        return new Date(b.logDate).getTime() - new Date(a.logDate).getTime();
      });
  }

  async createMedicationLog(insertLog: InsertMedicationLog): Promise<MedicationLog> {
    const id = this.medicationLogId++;
    const logDate = new Date();
    const log: MedicationLog = { 
      ...insertLog, 
      id, 
      logDate,
      notes: insertLog.notes || null 
    };
    this.medicationLogs.set(id, log);
    return log;
  }

  // Medicine Info operations
  async getMedicineInfo(name: string): Promise<MedicineInfo | undefined> {
    return Array.from(this.medicineInfo.values()).find(
      (info) => info.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async searchMedicineInfo(term: string): Promise<MedicineInfo[]> {
    const searchTerm = term.toLowerCase();
    return Array.from(this.medicineInfo.values()).filter(
      (info) => info.name.toLowerCase().includes(searchTerm) || 
                (info.genericName && info.genericName.toLowerCase().includes(searchTerm))
    );
  }

  private seedMedicineInfo() {
    const commonMedicines: InsertMedicineInfo[] = [
      {
        name: "Azithromycin",
        genericName: "Azithromycin",
        category: "Antibiotic",
        uses: "Used to treat certain bacterial infections, including bronchitis, pneumonia, and infections of the ears, lungs, and sinuses.",
        sideEffects: "May cause nausea, vomiting, diarrhea, or abdominal pain. Serious side effects are rare.",
        precautions: "Tell your doctor if you have liver problems or myasthenia gravis before taking this medication.",
        interactions: "May interact with certain heart medications and increase risk of irregular heartbeat.",
        dosageInstructions: "Take as directed for the full prescribed length of time. Can be taken with or without food."
      },
      {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        category: "Pain Reliever, Fever Reducer",
        uses: "Used to relieve mild to moderate pain and reduce fever.",
        sideEffects: "Usually well-tolerated when used as directed. Excessive use may cause liver damage.",
        precautions: "Do not exceed recommended dose. Avoid alcohol while taking this medication.",
        interactions: "May interact with certain seizure medications and blood thinners.",
        dosageInstructions: "For adults, typical dose is 500-1000mg every 4-6 hours as needed, not exceeding 4000mg in 24 hours."
      },
      {
        name: "Vitamin C",
        genericName: "Ascorbic Acid",
        category: "Vitamin Supplement",
        uses: "Used to prevent and treat vitamin C deficiency, boost immunity, and aid in the absorption of iron.",
        sideEffects: "High doses may cause digestive issues such as diarrhea, nausea, and stomach cramps.",
        precautions: "People with certain kidney conditions should use with caution.",
        interactions: "May interact with certain chemotherapy drugs, blood thinners, and estrogen.",
        dosageInstructions: "Typical supplemental dosage ranges from 250-1000mg daily."
      }
    ];

    commonMedicines.forEach(medicine => {
      const id = this.medicineInfoId++;
      this.medicineInfo.set(id, { 
        ...medicine, 
        id,
        genericName: medicine.genericName || null,
        category: medicine.category || null,
        uses: medicine.uses || null,
        sideEffects: medicine.sideEffects || null,
        precautions: medicine.precautions || null,
        interactions: medicine.interactions || null,
        dosageInstructions: medicine.dosageInstructions || null
      });
    });
  }
}

export const storage = new MemStorage();
