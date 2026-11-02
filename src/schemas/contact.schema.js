import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  countryCode: z.string().default("us +1"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[\d\s+()-]{6,20}$/.test(val),
      "Please enter a valid phone number."
    ),
  companySize: z.string().optional(),
  goal: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .min(10, "Message should be at least 10 characters long."),
  consent: z.boolean().optional(),
});

