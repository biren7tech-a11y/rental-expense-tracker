'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProperty } from '@/app/(dashboard)/onboarding/actions';

interface PropertyFormProps {
  submitLabel?: string;
}

export function PropertyForm({ submitLabel = 'Add property' }: PropertyFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createProperty(formData);
      return result ?? null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Property address</Label>
        <Input
          id="address"
          name="address"
          placeholder="123 Main St, Apt 1, City, ST 12345"
          required
          minLength={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">
          Nickname <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="nickname"
          name="nickname"
          placeholder='e.g. "Oak St duplex"'
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthly_rent">Monthly rent ($)</Label>
        <Input
          id="monthly_rent"
          name="monthly_rent"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
