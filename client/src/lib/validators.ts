import { z } from "zod";

export const jsonInputSchema = z.object({
  jsonInput: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed.data) && 
             parsed.data.every((item: any) => typeof item === "string");
    } catch {
      return false;
    }
  }, "Invalid JSON format. Expected: { \"data\": [\"item1\", \"item2\", ...] }")
});

export type JsonFormData = z.infer<typeof jsonInputSchema>;
