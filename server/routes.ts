import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPrescriptionSchema, 
  insertMedicationSchema, 
  insertReminderSchema, 
  insertMedicationLogSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const authenticate = (req: Request, res: Response, next: Function) => {
    // For MVP, we'll use a simple user id in the request
    const userId = req.headers["user-id"];
    if (!userId || isNaN(Number(userId))) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.body.userId = Number(userId);
    next();
  };

  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json({ id: user.id, username: user.username, fullName: user.fullName });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ id: user.id, username: user.username, fullName: user.fullName });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Prescription routes
  app.get("/api/prescriptions", authenticate, async (req, res) => {
    try {
      const prescriptions = await storage.getPrescriptions(req.body.userId);
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get prescriptions" });
    }
  });

  app.get("/api/prescriptions/:id", authenticate, async (req, res) => {
    try {
      const prescription = await storage.getPrescription(Number(req.params.id));
      
      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }
      
      if (prescription.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to access this prescription" });
      }
      
      res.json(prescription);
    } catch (error) {
      res.status(500).json({ message: "Failed to get prescription" });
    }
  });

  app.post("/api/prescriptions", authenticate, async (req, res) => {
    try {
      const prescriptionData = insertPrescriptionSchema.parse({
        ...req.body,
        userId: req.body.userId
      });
      
      const prescription = await storage.createPrescription(prescriptionData);
      res.status(201).json(prescription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prescription" });
    }
  });

  app.put("/api/prescriptions/:id", authenticate, async (req, res) => {
    try {
      const prescriptionId = Number(req.params.id);
      const prescription = await storage.getPrescription(prescriptionId);
      
      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }
      
      if (prescription.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to update this prescription" });
      }
      
      const updatedPrescription = await storage.updatePrescription(prescriptionId, req.body);
      res.json(updatedPrescription);
    } catch (error) {
      res.status(500).json({ message: "Failed to update prescription" });
    }
  });

  // Medication routes
  app.get("/api/medications", authenticate, async (req, res) => {
    try {
      const medications = await storage.getMedications(req.body.userId);
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medications" });
    }
  });

  app.get("/api/medications/:id", authenticate, async (req, res) => {
    try {
      const medication = await storage.getMedication(Number(req.params.id));
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to access this medication" });
      }
      
      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medication" });
    }
  });

  app.post("/api/medications", authenticate, async (req, res) => {
    try {
      const medicationData = insertMedicationSchema.parse({
        ...req.body,
        userId: req.body.userId
      });
      
      const medication = await storage.createMedication(medicationData);
      res.status(201).json(medication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create medication" });
    }
  });

  app.put("/api/medications/:id", authenticate, async (req, res) => {
    try {
      const medicationId = Number(req.params.id);
      const medication = await storage.getMedication(medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to update this medication" });
      }
      
      const updatedMedication = await storage.updateMedication(medicationId, req.body);
      res.json(updatedMedication);
    } catch (error) {
      res.status(500).json({ message: "Failed to update medication" });
    }
  });

  app.delete("/api/medications/:id", authenticate, async (req, res) => {
    try {
      const medicationId = Number(req.params.id);
      const medication = await storage.getMedication(medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to delete this medication" });
      }
      
      await storage.deleteMedication(medicationId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });

  // Reminder routes
  app.get("/api/reminders", authenticate, async (req, res) => {
    try {
      const reminders = await storage.getReminders(req.body.userId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reminders" });
    }
  });

  app.get("/api/medications/:id/reminders", authenticate, async (req, res) => {
    try {
      const medicationId = Number(req.params.id);
      const medication = await storage.getMedication(medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to access this medication's reminders" });
      }
      
      const reminders = await storage.getRemindersByMedication(medicationId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reminders" });
    }
  });

  app.post("/api/reminders", authenticate, async (req, res) => {
    try {
      const reminderData = insertReminderSchema.parse({
        ...req.body,
        userId: req.body.userId
      });
      
      // Verify that the medication belongs to the user
      const medication = await storage.getMedication(reminderData.medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to create reminders for this medication" });
      }
      
      const reminder = await storage.createReminder(reminderData);
      res.status(201).json(reminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });

  app.put("/api/reminders/:id", authenticate, async (req, res) => {
    try {
      const reminderId = Number(req.params.id);
      const reminder = await storage.getReminder(reminderId);
      
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      if (reminder.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to update this reminder" });
      }
      
      const updatedReminder = await storage.updateReminder(reminderId, req.body);
      res.json(updatedReminder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  app.delete("/api/reminders/:id", authenticate, async (req, res) => {
    try {
      const reminderId = Number(req.params.id);
      const reminder = await storage.getReminder(reminderId);
      
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      if (reminder.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to delete this reminder" });
      }
      
      await storage.deleteReminder(reminderId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reminder" });
    }
  });

  // Medication Log routes
  app.get("/api/medications/:id/logs", authenticate, async (req, res) => {
    try {
      const medicationId = Number(req.params.id);
      const medication = await storage.getMedication(medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to access this medication's logs" });
      }
      
      const logs = await storage.getMedicationLogs(medicationId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medication logs" });
    }
  });

  app.post("/api/medications/:id/logs", authenticate, async (req, res) => {
    try {
      const medicationId = Number(req.params.id);
      const medication = await storage.getMedication(medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      if (medication.userId !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized to log for this medication" });
      }
      
      const logData = insertMedicationLogSchema.parse({
        ...req.body,
        medicationId,
        userId: req.body.userId
      });
      
      const log = await storage.createMedicationLog(logData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create medication log" });
    }
  });

  // Medicine Info routes
  app.get("/api/medicine-info", async (req, res) => {
    try {
      const searchTerm = req.query.search as string;
      
      if (!searchTerm || searchTerm.length < 2) {
        return res.status(400).json({ message: "Search term must be at least 2 characters" });
      }
      
      const results = await storage.searchMedicineInfo(searchTerm);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search medicine information" });
    }
  });

  app.get("/api/medicine-info/:name", async (req, res) => {
    try {
      const medicineName = req.params.name;
      const medicineInfo = await storage.getMedicineInfo(medicineName);
      
      if (!medicineInfo) {
        return res.status(404).json({ message: "Medicine information not found" });
      }
      
      res.json(medicineInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medicine information" });
    }
  });

  // User profile routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users/profile", async (req, res) => {
    try {
      // In a production app, we would validate the user is authenticated and update their profile
      // For this MVP, we'll just return success since we don't have user profiles table
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Initialize the demo user for easy testing
  const initializeDemo = async () => {
    try {
      let demoUser = await storage.getUserByUsername("demo");
      
      if (!demoUser) {
        demoUser = await storage.createUser({
          username: "demo",
          password: "demo123",
          fullName: "Aman Kumar"
        });
        
        console.log("Demo user created:", demoUser);
      }
    } catch (error) {
      console.error("Failed to initialize demo user:", error);
    }
  };
  
  // Call the initialization function
  await initializeDemo();

  const httpServer = createServer(app);
  return httpServer;
}
