import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { arrayInputSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  // Handle both /bfhl and /api/bfhl routes
  const handleBfhlRoute = async (req: any, res: any) => {
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
        console.error('Error processing request:', error);
        res.status(500).json({
          is_success: false,
          message: "Internal server error"
        });
      }
    }
  };

  app.post("/bfhl", handleBfhlRoute);
  app.post("/api/bfhl", handleBfhlRoute);

  const handleGetBfhl = async (_req: any, res: any) => {
    try {
      const code = await storage.getOperationCode();
      res.json({ operation_code: code });
    } catch (error) {
      console.error('Error getting operation code:', error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  app.get("/bfhl", handleGetBfhl);
  app.get("/api/bfhl", handleGetBfhl);

  return createServer(app);
}