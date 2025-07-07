import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  userId: z
    .string()
    .refine((val) => /^\d+$/.test(val), "User ID must be a number."),
  body: z.string().min(5, "Body must be at least 5 characters."),
  tags: z
    .string()
    .optional()
    .transform((val) => val ? val.split(",").map((t) => t.trim()) : []),
});

export type BlogSchemaType = z.infer<typeof blogSchema>;
