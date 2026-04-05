import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyForm } from '@/components/properties/property-form';

export const metadata = { title: 'Add property' };

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Add a property</CardTitle>
          <CardDescription>
            Enter the details for your rental property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm />
        </CardContent>
      </Card>
    </div>
  );
}
