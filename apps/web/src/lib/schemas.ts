import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const shoeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string(),
  condition: z.string(),
  sku: z.string(),
  barcode: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  costPrice: z.number().min(0, "Must be positive"),
  sellPrice: z.number().min(0, "Must be positive"),
  quantity: z.number().int().min(0, "Must be positive"),
  minStockAlert: z.number().int().min(0),
  supplier: z.string(),
  location: z.string(),
});

export type ShoeFormData = z.infer<typeof shoeSchema>;

export const movementSchema = z.object({
  type: z.enum(["in", "out", "adjustment"]),
  quantity: z.number().int().min(1, "Min 1"),
  reason: z.string(),
});

export type MovementFormData = z.infer<typeof movementSchema>;
