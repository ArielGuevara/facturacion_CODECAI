import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>

      <div className="md:hidden">
        <Sidebar />
      </div>

      <main className="md:pl-72">
        <div className="h-full p-8 space-y-4">
            {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
