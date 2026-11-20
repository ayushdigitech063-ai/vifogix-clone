// src/schemas/package.schema.js
import { z } from "zod";

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Create Single Package Validation
export const createPackageSchema = z
  .object({
    name: z
      .string({ required_error: "Package name is required" })
      .trim()
      .min(2, "Package name must be at least 2 characters")
      .max(50, "Package name cannot exceed 50 characters"),
    tagline: z
      .string({ required_error: "Tagline is required" })
      .trim()
      .min(2, "Tagline must be at least 2 characters")
      .max(120, "Tagline cannot exceed 120 characters"),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .min(0, "Price cannot be negative")
      .nullable()
      .optional(),
    isCustomPrice: z.boolean().default(false),
    customPriceLabel: z.string().trim().max(30).default("Custom"),
    billingCycle: z.string().trim().max(20).nullable().default("/mo"),
    features: z
      .array(z.string().trim().min(1, "Feature cannot be empty"))
      .min(1, "At least one feature is required"),
    isPopular: z.boolean().default(false),
    badgeText: z.string().trim().max(30).nullable().optional(),
    buttonText: z.string().trim().max(30).default("Get Started"),
    displayOrder: z
      .number({ invalid_type_error: "Display order must be an integer" })
      .int("Display order must be an integer")
      .min(1, "Display order must be at least 1")
      .default(1),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => data.isCustomPrice || (data.price !== undefined && data.price !== null),
    {
      message: "Price is required when Custom Price is not enabled",
      path: ["price"],
    }
  );

// 2. Update Single Package Validation
export const updatePackageSchema = z
  .object({
    name: z.string().trim().min(2).max(50).optional(),
    tagline: z.string().trim().min(2).max(120).optional(),
    price: z.number().min(0).nullable().optional(),
    isCustomPrice: z.boolean().optional(),
    customPriceLabel: z.string().trim().max(30).optional(),
    billingCycle: z.string().trim().max(20).nullable().optional(),
    features: z.array(z.string().trim().min(1)).min(1).optional(),
    isPopular: z.boolean().optional(),
    badgeText: z.string().trim().max(30).nullable().optional(),
    buttonText: z.string().trim().max(30).optional(),
    displayOrder: z.number().int().min(1, "Display order must be at least 1").optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

// 3. Package ID Param Validation
export const packageIdParamSchema = z.object({
  packageId: z.string().regex(objectIdRegex, "Invalid Package ID format"),
});
