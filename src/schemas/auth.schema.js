import { z } from "zod";

/**
 * Extracts a username slug from a raw input string or URL.
 * Handles trailing slashes, protocol (http/https), www/mobile prefixes, and domain paths.
 */
export const extractUsernameSlug = (input) => {
  if (!input || typeof input !== "string") return "";
  let val = input.trim();

  // Strip protocol and www/subdomain if URL was pasted
  val = val.replace(/^https?:\/\//i, "");
  val = val.replace(/^(?:[a-z0-9_-]+\.)*(?:linkedin\.com|facebook\.com|instagram\.com)\/?/i, "");
  
  // Remove specialized path prefixes like in/ or profile.php?id= or @
  val = val.replace(/^in\//i, "");
  val = val.replace(/^profile\.php\?id=/i, "");
  val = val.replace(/^@/, "");

  // Strip query params, hashes, and trailing slashes
  val = val.split(/[?#]/)[0].replace(/\/+$/, "");
  return val;
};

// Base string with slug extraction transform layer
const cleanSlug = z
  .string({ required_error: "Please enter your username or profile link." })
  .trim()
  .min(1, "Please enter your username or profile link.")
  .transform(extractUsernameSlug);

// LinkedIn: 3 to 100 characters, alphanumeric and hyphens only
const linkedInSchema = z.object({
  platform: z.literal("LinkedIn"),
  username: cleanSlug
    .refine((val) => val.length >= 3, {
      message: "LinkedIn username must be at least 3 characters long.",
    })
    .refine((val) => val.length <= 100, {
      message: "LinkedIn username cannot exceed 100 characters.",
    })
    .refine((val) => /^[a-zA-Z0-9-]+$/.test(val), {
      message: "LinkedIn username can only contain letters, numbers, and hyphens.",
    }),
});

// Facebook: Minimum 3 characters, alphanumeric, periods, and hyphens only
const facebookSchema = z.object({
  platform: z.literal("Facebook"),
  username: cleanSlug
    .refine((val) => val.length >= 3, {
      message: "Facebook username must be at least 3 characters long.",
    })
    .refine((val) => /^[a-zA-Z0-9.-]+$/.test(val), {
      message: "Facebook username can only contain letters, numbers, periods, and hyphens.",
    }),
});

// Instagram: 1 to 30 characters, alphanumeric, periods, and underscores only (cannot start or end with a period)
const instagramSchema = z.object({
  platform: z.literal("Instagram"),
  username: cleanSlug
    .refine((val) => val.length >= 1, {
      message: "Instagram username must be at least 1 character long.",
    })
    .refine((val) => val.length <= 30, {
      message: "Instagram username cannot exceed 30 characters.",
    })
    .refine((val) => !val.startsWith(".") && !val.endsWith("."), {
      message: "Instagram username cannot start or end with a period.",
    })
    .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
      message: "Instagram username can only contain letters, numbers, periods, and underscores.",
    }),
});

/**
 * Discriminated union schema for validating Social Media Profile
 */
export const socialMediaProfileSchema = z.discriminatedUnion("platform", [
  linkedInSchema,
  facebookSchema,
  instagramSchema,
]);

/**
 * @typedef {z.infer<typeof socialMediaProfileSchema>} SocialMediaProfile
 */

export const signInSchema = z.object({
  role: z.enum(["buyer", "seller"], {
    errorMap: () => ({ message: "Please select whether you are a buyer or seller." }),
  }),
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

export const signUpSchema = z
  .object({
    role: z.enum(["buyer", "seller"]).optional(),
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
    platform: z.enum(["LinkedIn", "Facebook", "Instagram"], {
      errorMap: () => ({ message: "Please select a platform: LinkedIn, Facebook, or Instagram." }),
    }),
    username: z.string({ required_error: "Please enter your username or profile link." }),
    // backward compatibility aliases
    socialPlatform: z.string().optional(),
    socialMediaId: z.string().optional(),
    password: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "Password must be at least 8 characters."),
    terms: z.boolean().refine((val) => val === true, {
      message: "You need to accept the terms to continue.",
    }),
    remember: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const res = socialMediaProfileSchema.safeParse({
      platform: data.platform,
      username: data.username,
    });
    if (!res.success) {
      for (const issue of res.error.issues) {
        ctx.addIssue({
          ...issue,
          path: issue.path[0] === "username" ? ["username"] : issue.path,
        });
      }
    }
  });

