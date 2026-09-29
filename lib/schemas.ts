import { z } from "zod";

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC",
] as const;

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Enter a valid phone number"),
  city: z.string().min(2, "City is required"),
  state: z.enum(US_STATES, { message: "Select a state" }),
  experience: z.enum(["none", "hobbyist", "some_commercial", "military", "professional"], {
    message: "Select your experience level",
  }),
  targetExamDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .nullable()
    .optional(),
  referralSource: z.enum(["search", "social", "friend", "military_unit", "employer", "other"], {
    message: "Select an option",
  }),
});

export const checkoutRequestSchema = z.object({
  planId: z.enum(["monthly", "sixMonth", "annual"]),
  registration: registrationSchema,
});

export const adminSubscriptionActionSchema = z.object({
  action: z.enum(["cancel", "resume", "revoke", "grant"]),
  planId: z.enum(["monthly", "sixMonth", "annual"]).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
export type AdminSubscriptionActionInput = z.infer<typeof adminSubscriptionActionSchema>;
