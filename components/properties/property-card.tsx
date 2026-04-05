import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card>
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
