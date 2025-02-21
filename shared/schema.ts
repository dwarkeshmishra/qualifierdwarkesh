import { z } from "zod";

export const arrayInputSchema = z.object({
  data: z.array(z.string())
});

export const arrayResponseSchema = z.object({
  is_success: z.boolean(),
  user_id: z.string(),
  email: z.string(),
  roll_number: z.string(),
  numbers: z.array(z.string()),
  alphabets: z.array(z.string()),
  highest_alphabet: z.array(z.string())
});

export const operationResponse = z.object({
  operation_code: z.number()
});

export type ArrayInput = z.infer<typeof arrayInputSchema>;
export type ArrayResponse = z.infer<typeof arrayResponseSchema>;
export type OperationResponse = z.infer<typeof operationResponse>;
