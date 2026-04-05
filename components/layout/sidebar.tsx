'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/expenses', label: 'Expenses', icon: Receipt, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="text-lg font-semibold">
          {APP_NAME}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                item.disabled && 'pointer-events-none opacity-40'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-[10px] uppercase tracking-wider opacity-60">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
