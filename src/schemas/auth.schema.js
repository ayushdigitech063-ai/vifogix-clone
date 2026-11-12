import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional(),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "Password must be at least 8 characters."),
  terms: z.boolean().refine((val) => val === true, {
    message: "You need to accept the terms to continue.",
  }),
  remember: z.boolean().optional(),
});

