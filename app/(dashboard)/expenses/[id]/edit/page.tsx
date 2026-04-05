import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseEditForm } from '@/components/expenses/expense-edit-form';
import type { Expense, Property } from '@/lib/types';

export const metadata = { title: 'Edit expense' };

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: expense }, { data: properties }] = await Promise.all([
    supabase.from('expenses').select('*').eq('id', id).single(),
    supabase.from('properties').select('*').order('created_at', { ascending: true }),
  ]);

  if (!expense) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Edit expense</CardTitle>
          <CardDescription>
            Update the details for this expense.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseEditForm
            expense={expense as Expense}
            properties={(properties as Property[]) ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
