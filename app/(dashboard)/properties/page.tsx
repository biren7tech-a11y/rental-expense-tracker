import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/property-card';
import { Plus } from 'lucide-react';
import type { Property } from '@/lib/types';

export const metadata = { title: 'Properties' };

export default async function PropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your rental properties.
          </p>
        </div>
        <Button render={<Link href="/properties/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Add property
        </Button>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(properties as Property[]).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No properties yet. Add your first one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
