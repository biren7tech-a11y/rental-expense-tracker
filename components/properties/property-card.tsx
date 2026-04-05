'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import { deleteProperty } from '@/app/(dashboard)/properties/actions';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Delete this property? Any linked expenses will also be deleted.')) return;
    startTransition(async () => {
      await deleteProperty(property.id);
    });
  };

  return (
    <Card className={isPending ? 'opacity-40' : ''}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate">
            {property.nickname || property.address}
          </CardTitle>
          {property.nickname && (
            <p className="text-sm text-muted-foreground truncate">
              {property.address}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            render={<Link href={`/properties/${property.id}/edit`} />}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Rent:{' '}
          <span className="font-medium text-foreground">
            ${Number(property.monthly_rent).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
            /mo
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
