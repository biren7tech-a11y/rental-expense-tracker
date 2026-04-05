import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyForm } from '@/components/properties/property-form';

export const metadata = { title: 'Get started' };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // If user already has properties, skip onboarding
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .limit(1);

  if (properties && properties.length > 0) {
    redirect('/');
  }

  return (
    <div className="mx-auto max-w-lg pt-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to DoorTracker</CardTitle>
          <CardDescription>
            Add your first rental property to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm submitLabel="Get started" />
        </CardContent>
      </Card>
    </div>
  );
}
