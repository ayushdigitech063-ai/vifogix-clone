// src/schemas/user.schema.js
import { z } from "zod";

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. List Users Query Schema
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  search: z.string().trim().optional(),
  role: z.enum(["ALL", "BUYER", "SELLER", "ADMIN"]).default("ALL").optional(),
  status: z.enum(["ALL", "ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED"]).default("ALL").optional(),
  isEmailVerified: z.enum(["ALL", "TRUE", "FALSE"]).default("ALL").optional(),
});

// 2. User ID Param Schema
export const userIdParamSchema = z.object({
  userId: z.string().regex(objectIdRegex, "Invalid User ID format"),
});

// 3. Update User Status Schema
export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
  reason: z.string().trim().max(500).optional(),
});
