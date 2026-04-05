import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseForm } from '@/components/expenses/expense-form';
import type { Property } from '@/lib/types';

export const metadata = { title: 'Add expense' };

export default async function NewExpensePage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: true });

  if (!properties || properties.length === 0) {
    redirect('/onboarding');
  }

  const { property } = await searchParams;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Add an expense</CardTitle>
          <CardDescription>
            Record an expense for one of your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            properties={properties as Property[]}
            defaultPropertyId={property}
          />
        </CardContent>
      </Card>
    </div>
  );
}
