import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Receipt, FileText } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Check onboarding
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id');

  if (!error && (!properties || properties.length === 0)) {
    redirect('/onboarding');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('name')
    .eq('id', user.id)
    .single();

  const propertyCount = properties?.length ?? 0;

  // Expenses YTD
  const yearStart = `${new Date().getFullYear()}-01-01`;
  const { data: expensesYtd } = await supabase
    .from('expenses')
    .select('amount')
    .gte('expense_date', yearStart);

  const totalExpensesYtd =
    expensesYtd?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{profile?.name ? `, ${profile.name}` : ''}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your rental properties.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses (YTD)</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpensesYtd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schedule E</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Coming in Phase 3</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Quick actions</h2>
        <div className="flex gap-3">
          <Button render={<Link href="/properties/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            Add property
          </Button>
          <Button variant="outline" render={<Link href="/expenses/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            Add expense
          </Button>
        </div>
      </div>
    </div>
  );
}
