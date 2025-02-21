import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { arrayInputSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  app.post("/api/bfhl", async (req, res) => {
    try {
      const { data } = arrayInputSchema.parse(req.body);
      const result = await storage.processArray(data);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          is_success: false,
          message: "Invalid input format"
        });
      } else {
        res.status(500).json({
          is_success: false,
          message: "Internal server error"
        });
      }
    }
  });

  app.get("/api/bfhl", async (_req, res) => {
    try {
      const code = await storage.getOperationCode();
      res.json({ operation_code: code });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  return createServer(app);
}
