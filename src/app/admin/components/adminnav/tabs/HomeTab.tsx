'use client';

import { useSession } from 'next-auth/react';
import AdminNavItem from '../AdminNavItem';
import { MdDashboard } from 'react-icons/md';
import Link from 'next/link';

export default function HomeTab() {
  const { data: session, status } = useSession();

  // Optional: Handle loading state
  if (status === 'loading') {
    return null; // Or a loading indicator
  }

  return (
    <Link href="/admin">
      {session ? (
        <AdminNavItem label="Summary" icon={MdDashboard} />
      ) : (
        <AdminNavItem label="Login" icon={MdDashboard} />
      )}
    </Link>
  );
}
