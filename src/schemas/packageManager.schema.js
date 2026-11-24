// src/schemas/packageManager.schema.js
import { z } from "zod";

export const packageActivitySchema = z.object({
  activityName: z
    .string({ error: "SEO activity name is required", required_error: "SEO activity name is required" })
    .trim()
    .min(1, "SEO activity name cannot be empty"),
  monthlyCount: z.coerce
    .number({ invalid_type_error: "Monthly quantity must be a number" })
    .min(1, "Monthly quantity must be at least 1"),
  unitAddonPrice: z.coerce
    .number({ invalid_type_error: "Unit add-on price must be a number" })
    .min(0, "Unit add-on price cannot be negative")
    .default(0),
  isAddonAllowed: z.boolean().default(true),
});

export const createPackageManagerPackageSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: "Package name is required", required_error: "Package name is required" })
        .trim()
        .min(2, "Package name must be at least 2 characters")
        .max(80, "Package name cannot exceed 80 characters"),
      tagline: z
        .string({ error: "Tagline is required", required_error: "Tagline is required" })
        .trim()
        .min(2, "Tagline must be at least 2 characters")
        .max(150, "Tagline cannot exceed 150 characters"),
      price: z.coerce.number().min(0, "Price cannot be negative").nullable().optional(),
      isCustomPrice: z.boolean().optional().default(false),
      customPriceLabel: z.string().trim().max(30).optional().default("Custom"),
      billingCycle: z.string().trim().max(20).nullable().optional().default("/mo"),
      activities: z
        .array(packageActivitySchema, {
          error: "Activities list is required",
          required_error: "At least one SEO activity is required",
        })
        .min(1, "At least one SEO activity is required"),
      isPopular: z.boolean().optional().default(false),
      badgeText: z.string().trim().max(30).nullable().optional(),
      displayOrder: z.coerce.number().int().min(1, "Display order must be at least 1").optional(),
      isActive: z.boolean().optional().default(true),
    })
    .strict()
    .refine(
      (data) => data.isCustomPrice || (data.price !== undefined && data.price !== null),
      {
        message: "Price is required when isCustomPrice is false",
        path: ["price"],
      }
    ),
});

export const updatePackageManagerPackageSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: "Package name is required", required_error: "Package name is required" })
        .trim()
        .min(2, "Package name must be at least 2 characters")
        .max(80, "Package name cannot exceed 80 characters"),
      tagline: z
        .string({ error: "Tagline is required", required_error: "Tagline is required" })
        .trim()
        .min(2, "Tagline must be at least 2 characters")
        .max(150, "Tagline cannot exceed 150 characters"),
      price: z.coerce.number().min(0, "Price cannot be negative").nullable().optional(),
      isCustomPrice: z.boolean().optional().default(false),
      customPriceLabel: z.string().trim().max(30).optional().default("Custom"),
      billingCycle: z.string().trim().max(20).nullable().optional().default("/mo"),
      activities: z
        .array(packageActivitySchema, {
          error: "Activities list is required",
          required_error: "At least one SEO activity is required",
        })
        .min(1, "At least one SEO activity is required"),
      isPopular: z.boolean().optional().default(false),
      badgeText: z.string().trim().max(30).nullable().optional(),
      displayOrder: z.coerce.number().int().min(1, "Display order must be at least 1").optional(),
      isActive: z.boolean().optional().default(true),
    })
    .strict()
    .refine(
      (data) => data.isCustomPrice || (data.price !== undefined && data.price !== null),
      {
        message: "Price is required when isCustomPrice is false",
        path: ["price"],
      }
    ),
});
