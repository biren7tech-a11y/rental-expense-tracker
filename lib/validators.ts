import { z } from 'zod';

export const propertySchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  nickname: z.string().optional().or(z.literal('')),
  monthly_rent: z.coerce.number().min(0, 'Rent must be zero or more').max(99999999.99),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
