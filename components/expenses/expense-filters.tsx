'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SCHEDULE_E_CATEGORIES } from '@/lib/constants';
import type { Property } from '@/lib/types';

interface ExpenseFiltersProps {
  properties: Property[];
}

export function ExpenseFilters({ properties }: ExpenseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/expenses?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get('property') ?? 'all'}
        onValueChange={(v) => updateFilter('property', v ?? 'all')}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All properties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All properties</SelectItem>
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.nickname || p.address}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('category') ?? 'all'}
        onValueChange={(v) => updateFilter('category', v ?? 'all')}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {SCHEDULE_E_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
