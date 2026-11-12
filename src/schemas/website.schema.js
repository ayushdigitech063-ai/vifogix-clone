import { z } from "zod";

/**
 * Zod validation schema for Add Website form
 * Aligned with backend Mongoose websiteSchema constraints
 */
export const addWebsiteSchema = z.object({
  domain: z
    .string({ required_error: "Domain name is required." })
    .trim()
    .min(1, "Domain name is required.")
    .refine(
      (val) => {
        const clean = val
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .split("/")[0];
        return /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(clean);
      },
      {
        message: "Please enter a valid domain format (e.g., example.com).",
      }
    ),

  category: z.string().trim().default("All"),

  country: z
    .string({ required_error: "Target country is required." })
    .trim()
    .min(1, "Target country is required."),

  language: z.string().trim().default("English"),

  // Metrics (Optional, null/empty allowed, numbers constrained 0-100)
  mozDA: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .optional()
    .refine(
      (val) => {
        if (val === "" || val === null || val === undefined) return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "Moz DA must be between 0 and 100." }
    ),

  ahrefsDR: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .optional()
    .refine(
      (val) => {
        if (val === "" || val === null || val === undefined) return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "Ahrefs DR must be between 0 and 100." }
    ),

  semrushAS: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .optional()
    .refine(
      (val) => {
        if (val === "" || val === null || val === undefined) return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "Semrush AS must be between 0 and 100." }
    ),

  monthlyTraffic: z.string().trim().optional(),
  domainAge: z.string().trim().optional(),

  // Commercial Details
  price: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && !isNaN(Number(val)), {
      message: "Publishing price is required.",
    })
    .refine((val) => Number(val) >= 0.01, {
      message: "Price must be greater than $0.00.",
    }),

  contentWritingPrice: z
    .union([z.number(), z.string()])
    .optional()
    .refine(
      (val) => {
        if (val === "" || val === undefined) return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Content writing price cannot be negative." }
    ),

  turnaroundDays: z
    .union([z.number(), z.string()])
    .default(3)
    .refine((val) => Number(val) >= 1, {
      message: "Turnaround time must be at least 1 day.",
    }),

  maxLinksAllowed: z
    .union([z.number(), z.string()])
    .default(2)
    .refine((val) => Number(val) >= 1 && Number(val) <= 5, {
      message: "Max links must be between 1 and 5.",
    }),

  linkType: z.enum(["DoFollow", "NoFollow"]).default("DoFollow"),

  samplePostUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const url = new URL(val);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL (starting with http:// or https://)." }
    ),
});

