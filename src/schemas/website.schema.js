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
    .union([z.number({
                required_error: 'Price is required',
                invalid_type_error: 'Price must be a valid number'
            }),z.string()])
    .refine((val) => val !== "" && !isNaN(Number(val)), {
      message: "Publishing price is required.",
    }).
    refine((val) => Number(val) >= 0.01, {
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
// csv bulk upload schema
export const csvWebsiteRowSchema = z.object({
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
    country: z
        .string({ required_error: 'Country is mandatory' })
        .trim()
        .min(2, 'Country is mandatory and must be at least 2 characters'),
    category: z
        .string()
        .trim()
        .optional()
        .transform((val) => (val && val.length > 0 ? val : 'All')),
    price: z.coerce
        .number({ invalid_type_error: 'Price must be a valid number' })
        .min(5, 'Price must be between $5 and $20,000')
        .max(20000, 'Price must be between $5 and $20,000'),
    turnaroundDays: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? 3 : Number(val)),
        z
            .number({ invalid_type_error: 'Turnaround days must be a number' })
            .int('Turnaround days must be an integer')
            .min(1, 'Turnaround days must be between 1 and 30 days')
            .max(30, 'Turnaround days must be between 1 and 30 days')
    ),
    language: z
        .string()
        .trim()
        .optional()
        .transform((val) => (val && val.length > 0 ? val : 'English')),
    mozDA: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
        z.number().int().min(0, 'Moz DA must be between 0 and 100').max(100, 'Moz DA must be between 0 and 100').nullable()
    ),
    ahrefsDR: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
        z.number().int().min(0, 'Ahrefs DR must be between 0 and 100').max(100, 'Ahrefs DR must be between 0 and 100').nullable()
    ),
    semrushAS: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
        z.number().int().min(0, 'Semrush AS must be between 0 and 100').max(100, 'Semrush AS must be between 0 and 100').nullable()
    ),
    monthlyTraffic: z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((val) => (val ? String(val) : null)),
    domainAge: z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((val) => (val ? String(val) : null)),
    samplePostUrl: z
        .string()
        .trim()
        .url('Sample post URL must be a valid URL')
        .optional()
        .nullable()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val ?? null))
});