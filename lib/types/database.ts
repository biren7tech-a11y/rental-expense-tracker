export type ScheduleECategory =
  | 'Advertising'
  | 'Auto and travel'
  | 'Cleaning and maintenance'
  | 'Commissions'
  | 'Insurance'
  | 'Legal and professional fees'
  | 'Management fees'
  | 'Mortgage interest'
  | 'Other interest'
  | 'Repairs'
  | 'Supplies'
  | 'Taxes'
  | 'Utilities'
  | 'Depreciation'
  | 'Other';

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  address: string;
  nickname: string | null;
  monthly_rent: number;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  property_id: string;
  vendor: string;
  amount: number;
  expense_date: string;
  category: ScheduleECategory;
  description: string | null;
  source_email_subject: string | null;
  confirmed: boolean;
  created_at: string;
}

export type PropertyInsert = Omit<Property, 'id' | 'created_at'>;
export type PropertyUpdate = Partial<Omit<Property, 'id' | 'user_id' | 'created_at'>>;
export type ExpenseInsert = Omit<Expense, 'id' | 'created_at'>;
export type ExpenseUpdate = Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>;
