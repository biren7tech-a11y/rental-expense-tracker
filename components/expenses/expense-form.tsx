'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createExpense } from '@/app/(dashboard)/expenses/actions';
import { SCHEDULE_E_CATEGORIES } from '@/lib/constants';
import type { Property } from '@/lib/types';

interface ExpenseFormProps {
  properties: Property[];
  defaultPropertyId?: string;
}

export function ExpenseForm({ properties, defaultPropertyId }: ExpenseFormProps) {
  const [state, formAction, isPending] = useActionState(createExpense, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="property_id">Property</Label>
        <Select name="property_id" defaultValue={defaultPropertyId} required>
          <SelectTrigger id="property_id">
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nickname || p.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vendor">Vendor</Label>
        <Input
          id="vendor"
          name="vendor"
          placeholder="e.g. Home Depot, plumber"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expense_date">Date</Label>
          <Input
            id="expense_date"
            name="expense_date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Schedule E category</Label>
        <Select name="category" defaultValue="Repairs" required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {SCHEDULE_E_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="description"
          name="description"
          placeholder="Notes about this expense"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Add expense'}
      </Button>
    </form>
  );
}
