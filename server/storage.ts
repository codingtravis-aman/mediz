import {
  users, prescriptions, medications, reminders, medicationLogs, medicineInfo,
  pharmacies, pharmacyOrders, pharmacyOrderItems,
  type User, type InsertUser,
  type Prescription, type InsertPrescription,
  type Medication, type InsertMedication,
  type Reminder, type InsertReminder,
  type MedicationLog, type InsertMedicationLog,
  type MedicineInfo, type InsertMedicineInfo,
  type Pharmacy, type InsertPharmacy,
  type PharmacyOrder, type InsertPharmacyOrder,
  type PharmacyOrderItem, type InsertPharmacyOrderItem
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
  
  // Pharmacy operations
  getPharmacies(): Promise<Pharmacy[]>;
  getPharmacy(id: number): Promise<Pharmacy | undefined>;
  searchPharmacies(query: string, location?: { lat: number, lng: number }): Promise<Pharmacy[]>;
  createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy>;
  updatePharmacy(id: number, data: Partial<Pharmacy>): Promise<Pharmacy | undefined>;
  
  // Pharmacy Order operations
  getPharmacyOrders(userId: number): Promise<PharmacyOrder[]>;
  getPharmacyOrder(id: number): Promise<PharmacyOrder | undefined>;
  createPharmacyOrder(order: InsertPharmacyOrder, items: InsertPharmacyOrderItem[]): Promise<PharmacyOrder>;
  updatePharmacyOrderStatus(id: number, status: string, paymentStatus?: string): Promise<PharmacyOrder | undefined>;
  getPharmacyOrderItems(orderId: number): Promise<PharmacyOrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prescriptions: Map<number, Prescription>;
  private medications: Map<number, Medication>;
  private reminders: Map<number, Reminder>;
  private medicationLogs: Map<number, MedicationLog>;
  private medicineInfo: Map<number, MedicineInfo>;
  private pharmacies: Map<number, Pharmacy>;
  private pharmacyOrders: Map<number, PharmacyOrder>;
  private pharmacyOrderItems: Map<number, PharmacyOrderItem>;
  
  private userId: number = 1;
  private prescriptionId: number = 1;
  private medicationId: number = 1;
  private reminderId: number = 1;
  private medicationLogId: number = 1;
  private medicineInfoId: number = 1;
  private pharmacyId: number = 1;
  private pharmacyOrderId: number = 1;
  private pharmacyOrderItemId: number = 1;

  constructor() {
    this.users = new Map();
    this.prescriptions = new Map();
    this.medications = new Map();
    this.reminders = new Map();
    this.medicationLogs = new Map();
    this.medicineInfo = new Map();
    this.pharmacies = new Map();
    this.pharmacyOrders = new Map();
    this.pharmacyOrderItems = new Map();

    // Adding some sample medicine info
    this.seedMedicineInfo();
    
    // Adding some sample pharmacies
    this.seedPharmacies();
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
      medicationsCount: 0
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
    const medication: Medication = { 
      ...insertMedication, 
      id,
      status: "active",
      isActive: true
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
    const log: MedicationLog = { ...insertLog, id, logDate };
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

  // Pharmacy operations
  async getPharmacies(): Promise<Pharmacy[]> {
    return Array.from(this.pharmacies.values());
  }

  async getPharmacy(id: number): Promise<Pharmacy | undefined> {
    return this.pharmacies.get(id);
  }

  async searchPharmacies(query: string, location?: { lat: number, lng: number }): Promise<Pharmacy[]> {
    const searchTerm = query.toLowerCase();
    const pharmacies = Array.from(this.pharmacies.values()).filter(
      (pharmacy) => pharmacy.name.toLowerCase().includes(searchTerm) || 
                    pharmacy.address.toLowerCase().includes(searchTerm) ||
                    pharmacy.city.toLowerCase().includes(searchTerm)
    );

    // If location is provided, sort by distance (simplified calculation)
    if (location) {
      return pharmacies.sort((a, b) => {
        if (a.latitude && a.longitude && b.latitude && b.longitude) {
          const distA = Math.sqrt(
            Math.pow(a.latitude - location.lat, 2) + 
            Math.pow(a.longitude - location.lng, 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.latitude - location.lat, 2) + 
            Math.pow(b.longitude - location.lng, 2)
          );
          return distA - distB;
        }
        return 0;
      });
    }

    return pharmacies;
  }

  async createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy> {
    const id = this.pharmacyId++;
    const newPharmacy: Pharmacy = { ...pharmacy, id };
    this.pharmacies.set(id, newPharmacy);
    return newPharmacy;
  }

  async updatePharmacy(id: number, data: Partial<Pharmacy>): Promise<Pharmacy | undefined> {
    const pharmacy = this.pharmacies.get(id);
    if (!pharmacy) return undefined;
    
    const updatedPharmacy = { ...pharmacy, ...data };
    this.pharmacies.set(id, updatedPharmacy);
    return updatedPharmacy;
  }

  // Pharmacy Order operations
  async getPharmacyOrders(userId: number): Promise<PharmacyOrder[]> {
    return Array.from(this.pharmacyOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  async getPharmacyOrder(id: number): Promise<PharmacyOrder | undefined> {
    const order = this.pharmacyOrders.get(id);
    if (!order) return undefined;

    // Get the order items
    const items = await this.getPharmacyOrderItems(id);
    return { ...order, items };
  }

  async createPharmacyOrder(order: InsertPharmacyOrder, items: InsertPharmacyOrderItem[]): Promise<PharmacyOrder> {
    const id = this.pharmacyOrderId++;
    const orderDate = new Date();
    
    // Create the order
    const newOrder: PharmacyOrder = { 
      ...order, 
      id, 
      orderDate,
      status: 'pending',
      paymentStatus: 'pending',
      items: []
    };
    
    // Create and associate items
    const orderItems: PharmacyOrderItem[] = [];
    for (const item of items) {
      const itemId = this.pharmacyOrderItemId++;
      const newItem: PharmacyOrderItem = { ...item, id: itemId, orderId: id };
      this.pharmacyOrderItems.set(itemId, newItem);
      orderItems.push(newItem);
    }
    
    // Update order with items
    newOrder.items = orderItems;
    this.pharmacyOrders.set(id, newOrder);
    
    return newOrder;
  }

  async updatePharmacyOrderStatus(id: number, status: string, paymentStatus?: string): Promise<PharmacyOrder | undefined> {
    const order = await this.getPharmacyOrder(id);
    if (!order) return undefined;

    const updatedOrder: PharmacyOrder = { 
      ...order, 
      status: status as PharmacyOrder['status'],
      ...(paymentStatus && { paymentStatus: paymentStatus as PharmacyOrder['paymentStatus'] })
    };
    
    this.pharmacyOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getPharmacyOrderItems(orderId: number): Promise<PharmacyOrderItem[]> {
    return Array.from(this.pharmacyOrderItems.values())
      .filter(item => item.orderId === orderId);
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
      this.medicineInfo.set(id, { ...medicine, id });
    });
  }
  
  private seedPharmacies() {
    const samplePharmacies: InsertPharmacy[] = [
      {
        name: "MediCare Pharmacy",
        address: "123 Health Street",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        phone: "+91-9876543210",
        email: "contact@medicare.com",
        latitude: 28.6139,
        longitude: 77.2090,
        hours: "Mon-Sat: 9AM-10PM, Sun: 10AM-7PM",
        deliveryAvailable: true,
        deliveryFee: 30,
        minimumOrderAmount: 200,
        estimatedDeliveryTime: "30-45 minutes"
      },
      {
        name: "LifeCare Wellness",
        address: "456 Wellness Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91-9876543211",
        email: "help@lifecare.com",
        latitude: 19.0760,
        longitude: 72.8777,
        hours: "Mon-Sun: 24 hours",
        deliveryAvailable: true,
        deliveryFee: 0,
        minimumOrderAmount: 500,
        estimatedDeliveryTime: "60 minutes"
      },
      {
        name: "Apollo Pharmacy",
        address: "789 Health Park",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        phone: "+91-9876543212",
        email: "customer@apollo.com",
        latitude: 12.9716,
        longitude: 77.5946,
        hours: "Mon-Sun: 8AM-11PM",
        deliveryAvailable: true,
        deliveryFee: 40,
        minimumOrderAmount: 300,
        estimatedDeliveryTime: "40-50 minutes"
      }
    ];

    samplePharmacies.forEach(pharmacy => {
      const id = this.pharmacyId++;
      this.pharmacies.set(id, { ...pharmacy, id, reviewCount: 0, rating: 0 });
    });
  }
}

export const storage = new MemStorage();
