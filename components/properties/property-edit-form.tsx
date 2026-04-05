'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProperty } from '@/app/(dashboard)/properties/actions';
import type { Property } from '@/lib/types';

interface PropertyEditFormProps {
  property: Property;
}

export function PropertyEditForm({ property }: PropertyEditFormProps) {
  const updateWithId = updateProperty.bind(null, property.id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Property address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={property.address}
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
          defaultValue={property.nickname ?? ''}
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
          defaultValue={Number(property.monthly_rent).toFixed(2)}
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
