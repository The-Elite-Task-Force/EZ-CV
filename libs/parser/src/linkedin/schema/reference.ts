import { z } from "zod";

export const referenceSchema = z.object({
  "First Name": z.string(),
  "Last Name": z.string(),
  Company: z.string(),
  "Job Title": z.string().optional(),
  Text: z.string().optional(),
  "Creation Date": z.string(),
  Status: z.string().optional(),
});
