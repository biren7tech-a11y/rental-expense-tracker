'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteExpense } from '@/app/(dashboard)/expenses/actions';
import type { Expense, Property } from '@/lib/types';

interface ExpenseTableProps {
  expenses: Expense[];
  properties: Property[];
}

export function ExpenseTable({ expenses, properties }: ExpenseTableProps) {
  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Vendor</th>
            <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Property</th>
            <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              propertyName={
                propertyMap.get(expense.property_id)?.nickname ||
                propertyMap.get(expense.property_id)?.address ||
                '—'
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExpenseRow({
  expense,
  propertyName,
}: {
  expense: Expense;
  propertyName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteExpense(expense.id);
    });
  };

  return (
    <tr className={`border-b last:border-0 ${isPending ? 'opacity-40' : ''}`}>
      <td className="px-4 py-3 whitespace-nowrap">
        {new Date(expense.expense_date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </td>
      <td className="px-4 py-3">{expense.vendor}</td>
      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground truncate max-w-[200px]">
        {propertyName}
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
        {expense.category}
      </td>
      <td className="px-4 py-3 text-right font-medium">
        ${Number(expense.amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })}
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
