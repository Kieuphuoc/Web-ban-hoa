"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut, ChevronLeft, Menu, Flower2 } from "lucide-react";
import { useState } from "react";

const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Tổng quan" },
    { href: "/admin/san-pham", icon: Package, label: "Sản phẩm" },
    { href: "/admin/don-hang", icon: ShoppingCart, label: "Đơn hàng" },
    { href: "/admin/khach-hang", icon: Users, label: "Khách hàng" },
    { href: "/admin/thong-ke", icon: BarChart3, label: "Thống kê" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg"
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full z-40 bg-white shadow-xl transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                    } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 border-b border-gray-100">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gold)] flex items-center justify-center text-white flex-shrink-0">
                                <Flower2 size={22} />
                            </div>
                            {!collapsed && (
                                <div>
                                    <h2 className="font-bold text-[var(--color-dark)] text-lg" style={{ fontFamily: "var(--font-display)" }}>
                                        BloomShop
                                    </h2>
                                    <p className="text-[10px] text-[var(--color-text-light)] -mt-0.5">Admin Panel</p>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 p-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                            ? "bg-[var(--color-primary)] text-white shadow-md"
                                            : "text-[var(--color-text)] hover:bg-[var(--color-rose)] hover:text-[var(--color-primary)]"
                                        }`}
                                >
                                    <item.icon size={20} className="flex-shrink-0" />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="p-3 border-t border-gray-100 space-y-1">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[var(--color-text-light)] hover:bg-gray-50 transition-all"
                        >
                            <LogOut size={20} className="flex-shrink-0" />
                            {!collapsed && <span>Về trang chủ</span>}
                        </Link>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[var(--color-text-light)] hover:bg-gray-50 transition-all w-full"
                        >
                            <ChevronLeft size={20} className={`flex-shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                            {!collapsed && <span>Thu gọn</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
