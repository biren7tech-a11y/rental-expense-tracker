import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { buttonVariants } from '@/lib/button-variants';
import { PropertyCard } from '@/components/properties/property-card';
import { Building2, Plus } from 'lucide-react';
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
        <Link href="/properties/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add property
        </Link>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(properties as Property[]).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-10 text-center space-y-3">
          <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="font-medium">No properties yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add each rental property you manage. You&apos;ll track expenses
              and generate Schedule E reports per property.
            </p>
          </div>
          <Link href="/properties/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first property
          </Link>
        </div>
      )}
    </div>
  );
}
