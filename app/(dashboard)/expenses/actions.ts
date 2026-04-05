'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { expenseSchema } from '@/lib/validators';

export async function createExpense(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const parsed = expenseSchema.safeParse({
    property_id: formData.get('property_id'),
    vendor: formData.get('vendor'),
    amount: formData.get('amount'),
    expense_date: formData.get('expense_date'),
    category: formData.get('category'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid form data' };
  }

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    property_id: parsed.data.property_id,
    vendor: parsed.data.vendor,
    amount: parsed.data.amount,
    expense_date: parsed.data.expense_date,
    category: parsed.data.category,
    description: parsed.data.description || null,
    confirmed: true,
  });

  if (error) {
    return { error: 'Failed to create expense. Please try again.' };
  }

  revalidatePath('/expenses');
  revalidatePath('/');
  redirect('/expenses');
}

export async function updateExpense(
  expenseId: string,
  _prev: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const parsed = expenseSchema.safeParse({
    property_id: formData.get('property_id'),
    vendor: formData.get('vendor'),
    amount: formData.get('amount'),
    expense_date: formData.get('expense_date'),
    category: formData.get('category'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid form data' };
  }

  const { error } = await supabase
    .from('expenses')
    .update({
      property_id: parsed.data.property_id,
      vendor: parsed.data.vendor,
      amount: parsed.data.amount,
      expense_date: parsed.data.expense_date,
      category: parsed.data.category,
      description: parsed.data.description || null,
    })
    .eq('id', expenseId)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Failed to update expense. Please try again.' };
  }

  revalidatePath('/expenses');
  revalidatePath('/');
  redirect('/expenses');
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Failed to delete expense.' };
  }

  revalidatePath('/expenses');
  revalidatePath('/');
}
