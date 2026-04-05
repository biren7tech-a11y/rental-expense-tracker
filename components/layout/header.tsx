import { UserNav } from './user-nav';

interface HeaderProps {
  user: { name: string | null; email: string } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="md:hidden text-lg font-semibold">DoorTracker</div>
      <div className="flex-1" />
      {user && <UserNav name={user.name} email={user.email} />}
    </header>
  );
}
