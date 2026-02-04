"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    Settings, 
    LogOut,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/pages/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Facturas",
            icon: FileText,
            href: "/pages/dashboard/invoices",
            color: "text-violet-500",
        },
        {
            label: "Clientes",
            icon: Users,
            href: "/pages/dashboard/users", // Assuming clients/users share module for now or explicitly users
            color: "text-pink-700",
        },
    ];

    const handleLogout = () => {
        document.cookie = "auth_token=; path=/; max-age=0";
        router.push("/pages/login");
    };

    const NavContent = () => (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/pages/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">
                        CODECAI
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            <div className="px-3 py-2">
                 <Button onClick={handleLogout} variant="ghost" className="w-full justify-start hover:text-white hover:bg-white/10 text-zinc-400">
                    <LogOut className="h-5 w-5 mr-3 text-red-500" />
                    Cerrar Sesión
                 </Button>
            </div>
        </div>
    );

    return ( 
        <>
            {/* Desktop Sidebar */}
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <NavContent />
            </div>

            {/* Mobile Sidebar (Sheet) */}
            <div className="md:hidden flex items-center p-4 border-b">
                 <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-slate-900 text-white border-none w-72">
                        <NavContent />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-bold text-xl">CODECAI</div>
            </div>
        </>
     );
}
 
export default Sidebar;
