'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validators';

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const parsed = propertySchema.safeParse({
    address: formData.get('address'),
    nickname: formData.get('nickname'),
    monthly_rent: formData.get('monthly_rent'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid form data' };
  }

  const { error } = await supabase.from('properties').insert({
    user_id: user.id,
    address: parsed.data.address,
    nickname: parsed.data.nickname || null,
    monthly_rent: parsed.data.monthly_rent,
  });

  if (error) {
    return { error: 'Failed to create property. Please try again.' };
  }

  redirect('/');
}
