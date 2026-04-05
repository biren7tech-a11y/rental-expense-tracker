import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { buttonVariants } from '@/lib/button-variants';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { Plus } from 'lucide-react';
import type { Expense, Property } from '@/lib/types';

export const metadata = { title: 'Expenses' };

export default async function ExpensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: expenses }, { data: properties }] = await Promise.all([
    supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false }),
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track expenses across your properties.
          </p>
        </div>
        <Link href="/expenses/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add expense
        </Link>
      </div>

      {expenses && expenses.length > 0 ? (
        <ExpenseTable
          expenses={expenses as Expense[]}
          properties={(properties as Property[]) ?? []}
        />
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No expenses yet. Add your first one to start tracking.
          </p>
        </div>
      )}
    </div>
  );
}
