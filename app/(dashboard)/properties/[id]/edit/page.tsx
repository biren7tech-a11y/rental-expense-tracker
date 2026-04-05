import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyEditForm } from '@/components/properties/property-edit-form';
import type { Property } from '@/lib/types';

export const metadata = { title: 'Edit property' };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Edit property</CardTitle>
          <CardDescription>
            Update the details for this property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyEditForm property={property as Property} />
        </CardContent>
      </Card>
    </div>
  );
}
