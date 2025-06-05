import z from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1)
});

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const blogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required")
});

export const updateBlogSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional()
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type BlogSchema = z.infer<typeof blogSchema>;
export type UpdateBlogSchema = z.infer<typeof updateBlogSchema>;
