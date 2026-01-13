import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Minimum 3 characters for the username')
    .max(20, 'Maximum 20 characters for the username'),
  password: z.string().min(8, 'Minimum password 8 characters')
});

export type RegisterInput = z.infer<typeof registerSchema>;
