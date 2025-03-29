import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
