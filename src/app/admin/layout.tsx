import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
    title: "Admin Dashboard - BloomShop",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <main className="flex-1 ml-0 lg:ml-64">
                <div className="p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
}
