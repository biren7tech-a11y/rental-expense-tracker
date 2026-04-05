'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validators';

export async function updateProperty(
  propertyId: string,
  _prev: { error?: string } | null,
  formData: FormData
) {
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

  const { error } = await supabase
    .from('properties')
    .update({
      address: parsed.data.address,
      nickname: parsed.data.nickname || null,
      monthly_rent: parsed.data.monthly_rent,
    })
    .eq('id', propertyId)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Failed to update property. Please try again.' };
  }

  revalidatePath('/properties');
  revalidatePath('/');
  redirect('/properties');
}

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Failed to delete property. May have linked expenses.' };
  }

  revalidatePath('/properties');
  revalidatePath('/');
}
