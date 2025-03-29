import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
});

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
  source: text("source"),
  status: text("status").notNull().default("processed"),
  originalImage: text("original_image"),
  translatedText: text("translated_text"),
  language: text("language").default("english"),
  medicationsCount: integer("medications_count").default(0),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  prescriptionId: integer("prescription_id"),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  duration: text("duration"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  instructions: text("instructions"),
  status: text("status").notNull().default("active"),
  medicationType: text("medication_type").default("tablet"),
  isActive: boolean("is_active").default(true),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id").notNull(),
  userId: integer("user_id").notNull(),
  time: text("time").notNull(),
  daysOfWeek: jsonb("days_of_week").notNull(),
  isActive: boolean("is_active").default(true),
  lastNotified: timestamp("last_notified"),
});

export const medicationLogs = pgTable("medication_logs", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // taken, skipped, missed
  logDate: timestamp("log_date").notNull().defaultNow(),
  notes: text("notes"),
});

export const medicineInfo = pgTable("medicine_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  genericName: text("generic_name"),
  category: text("category"),
  uses: text("uses"),
  sideEffects: text("side_effects"),
  precautions: text("precautions"),
  interactions: text("interactions"),
  dosageInstructions: text("dosage_instructions"),
});

export const pharmacies = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  hours: text("hours"),
  deliveryAvailable: boolean("delivery_available").default(false),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }),
  minimumOrderAmount: decimal("minimum_order_amount", { precision: 10, scale: 2 }),
  estimatedDeliveryTime: text("estimated_delivery_time"),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewCount: integer("review_count").default(0),
});

export const pharmacyOrders = pgTable("pharmacy_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pharmacyId: integer("pharmacy_id").notNull(),
  prescriptionId: integer("prescription_id"),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryContact: text("delivery_contact").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull(),
  deliveryNotes: text("delivery_notes"),
  estimatedDeliveryTime: text("estimated_delivery_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
});

export const pharmacyOrderItems = pgTable("pharmacy_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  medicationName: text("medication_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  substituteAllowed: boolean("substitute_allowed").default(false),
});

// Export schemas for insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).pick({
  userId: true,
  title: true,
  source: true,
  originalImage: true,
  translatedText: true,
  language: true,
});

export const insertMedicationSchema = createInsertSchema(medications).pick({
  userId: true,
  prescriptionId: true,
  name: true,
  dosage: true,
  frequency: true,
  duration: true,
  startDate: true,
  endDate: true,
  instructions: true,
  medicationType: true,
});

export const insertReminderSchema = createInsertSchema(reminders).pick({
  medicationId: true,
  userId: true,
  time: true,
  daysOfWeek: true,
});

export const insertMedicationLogSchema = createInsertSchema(medicationLogs).pick({
  medicationId: true,
  userId: true,
  status: true,
  notes: true,
});

export const insertMedicineInfoSchema = createInsertSchema(medicineInfo).pick({
  name: true,
  genericName: true,
  category: true,
  uses: true,
  sideEffects: true,
  precautions: true,
  interactions: true,
  dosageInstructions: true,
});

export const insertPharmacySchema = createInsertSchema(pharmacies).pick({
  name: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  phone: true,
  email: true,
  latitude: true,
  longitude: true,
  hours: true,
  deliveryAvailable: true,
  deliveryFee: true,
  minimumOrderAmount: true,
  estimatedDeliveryTime: true,
});

export const insertPharmacyOrderSchema = createInsertSchema(pharmacyOrders).pick({
  userId: true,
  pharmacyId: true,
  prescriptionId: true,
  deliveryAddress: true,
  deliveryContact: true,
  paymentMethod: true,
  totalAmount: true,
  discount: true,
  deliveryFee: true,
  deliveryNotes: true,
});

export const insertPharmacyOrderItemSchema = createInsertSchema(pharmacyOrderItems).pick({
  orderId: true,
  medicationName: true,
  quantity: true,
  price: true,
  substituteAllowed: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

export type InsertMedicationLog = z.infer<typeof insertMedicationLogSchema>;
export type MedicationLog = typeof medicationLogs.$inferSelect;

export type InsertMedicineInfo = z.infer<typeof insertMedicineInfoSchema>;
export type MedicineInfo = typeof medicineInfo.$inferSelect;

export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;
export type Pharmacy = typeof pharmacies.$inferSelect;

export type InsertPharmacyOrder = z.infer<typeof insertPharmacyOrderSchema>;
export type PharmacyOrder = typeof pharmacyOrders.$inferSelect;

export type InsertPharmacyOrderItem = z.infer<typeof insertPharmacyOrderItemSchema>;
export type PharmacyOrderItem = typeof pharmacyOrderItems.$inferSelect;
