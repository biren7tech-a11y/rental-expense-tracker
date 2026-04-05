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

export const expenseSchema = z.object({
  property_id: z.string().uuid('Please select a property'),
  vendor: z.string().min(1, 'Vendor is required').max(200),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(99999999.99),
  expense_date: z.string().min(1, 'Date is required'),
  category: z.enum([
    'Advertising',
    'Auto and travel',
    'Cleaning and maintenance',
    'Commissions',
    'Insurance',
    'Legal and professional fees',
    'Management fees',
    'Mortgage interest',
    'Other interest',
    'Repairs',
    'Supplies',
    'Taxes',
    'Utilities',
    'Depreciation',
    'Other',
  ]),
  description: z.string().optional().or(z.literal('')),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
