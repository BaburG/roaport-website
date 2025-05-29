"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const isAdmin = session?.user?.groups?.includes('admin');
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
} 