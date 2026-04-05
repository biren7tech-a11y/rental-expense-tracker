import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { buttonVariants } from '@/lib/button-variants';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { ExpenseFilters } from '@/components/expenses/expense-filters';
import { Filter, Plus, Receipt } from 'lucide-react';
import type { Expense, Property } from '@/lib/types';

export const metadata = { title: 'Expenses' };

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string; category?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { property, category } = await searchParams;

  let expenseQuery = supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false });

  if (property) {
    expenseQuery = expenseQuery.eq('property_id', property);
  }
  if (category) {
    expenseQuery = expenseQuery.eq('category', category);
  }

  const [{ data: expenses }, { data: properties }] = await Promise.all([
    expenseQuery,
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

      <ExpenseFilters properties={(properties as Property[]) ?? []} />

      {expenses && expenses.length > 0 ? (
        <ExpenseTable
          expenses={expenses as Expense[]}
          properties={(properties as Property[]) ?? []}
        />
      ) : (
        <div className="rounded-md border border-dashed p-10 text-center space-y-3">
          {property || category ? (
            <>
              <Filter className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <div>
                <p className="font-medium">No matching expenses</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters or add an expense that matches.
                </p>
              </div>
            </>
          ) : (
            <>
              <Receipt className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <div>
                <p className="font-medium">No expenses yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Record repairs, insurance, utilities, and other costs for your
                  properties. Each expense is mapped to an IRS Schedule E
                  category for tax time.
                </p>
              </div>
              <Link href="/expenses/new" className={buttonVariants()}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first expense
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
