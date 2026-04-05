import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/lib/button-variants';
import { SCHEDULE_E_CATEGORIES } from '@/lib/constants';
import { FileText, Plus } from 'lucide-react';
import type { Property } from '@/lib/types';

export const metadata = { title: 'Schedule E Report' };

interface ExpenseRow {
  property_id: string;
  category: string;
  amount: number;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { year: yearParam } = await searchParams;
  const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  const [{ data: expenses }, { data: properties }] = await Promise.all([
    supabase
      .from('expenses')
      .select('property_id, category, amount')
      .gte('expense_date', yearStart)
      .lte('expense_date', yearEnd),
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: true }),
  ]);

  // Build per-property category totals
  const totals = new Map<string, Map<string, number>>();
  const grandTotals = new Map<string, number>();

  for (const exp of (expenses as ExpenseRow[]) ?? []) {
    if (!totals.has(exp.property_id)) {
      totals.set(exp.property_id, new Map());
    }
    const propMap = totals.get(exp.property_id)!;
    propMap.set(exp.category, (propMap.get(exp.category) ?? 0) + Number(exp.amount));
    grandTotals.set(exp.category, (grandTotals.get(exp.category) ?? 0) + Number(exp.amount));
  }

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const activeCategories = SCHEDULE_E_CATEGORIES.filter(
    (cat) => grandTotals.has(cat) && grandTotals.get(cat)! > 0
  );

  const overallTotal = Array.from(grandTotals.values()).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Schedule E Report — {year}
        </h1>
        <p className="text-muted-foreground">
          Expense summary by property and IRS Schedule E category.
        </p>
      </div>

      {(properties as Property[])?.map((property) => {
        const propTotals = totals.get(property.id);
        if (!propTotals || propTotals.size === 0) return null;

        const propTotal = Array.from(propTotals.values()).reduce((a, b) => a + b, 0);

        return (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {property.nickname || property.address}
              </CardTitle>
              {property.nickname && (
                <p className="text-sm text-muted-foreground">{property.address}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium">Category</th>
                      <th className="px-4 py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCHEDULE_E_CATEGORIES.map((cat) => {
                      const amount = propTotals.get(cat);
                      if (!amount) return null;
                      return (
                        <tr key={cat} className="border-b last:border-0">
                          <td className="px-4 py-2">{cat}</td>
                          <td className="px-4 py-2 text-right font-medium">${fmt(amount)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-muted/30 font-semibold">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2 text-right">${fmt(propTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {activeCategories.length > 0 && (properties as Property[])?.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Properties Combined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Category</th>
                    <th className="px-4 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCategories.map((cat) => (
                    <tr key={cat} className="border-b last:border-0">
                      <td className="px-4 py-2">{cat}</td>
                      <td className="px-4 py-2 text-right font-medium">
                        ${fmt(grandTotals.get(cat)!)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30 font-semibold">
                    <td className="px-4 py-2">Total</td>
                    <td className="px-4 py-2 text-right">${fmt(overallTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeCategories.length === 0 && (
        <div className="rounded-md border border-dashed p-10 text-center space-y-3">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="font-medium">No data for {year}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Once you add expenses, this report groups them by property and
              IRS Schedule E category — ready to hand to your accountant or
              enter into your tax return.
            </p>
          </div>
          <Link href="/expenses/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Add an expense
          </Link>
        </div>
      )}
    </div>
  );
}
