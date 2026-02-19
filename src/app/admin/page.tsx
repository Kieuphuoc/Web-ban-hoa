import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

async function getAdminStats() {
    const [
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        recentOrders,
        topProducts
    ] = await Promise.all([
        prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.product.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true } }, items: { take: 1, select: { name: true } } }
        }),
        prisma.product.findMany({
            take: 4,
            orderBy: { soldCount: "desc" },
            select: { name: true, soldCount: true, basePrice: true } // revenue approx sold * price
        })
    ]);

    // Calculate growth (mock logic for now or compare with last month)
    // For real app, we'd query last month's data.
    const stats = [
        { label: "Doanh thu", value: formatPrice(totalRevenue._sum.total || 0), change: "+12.5%", up: true, icon: DollarSign, color: "from-green-400 to-emerald-500" },
        { label: "Đơn hàng", value: totalOrders.toString(), change: "+8.3%", up: true, icon: ShoppingCart, color: "from-blue-400 to-indigo-500" },
        { label: "Khách hàng", value: totalUsers.toString(), change: "+5.2%", up: true, icon: Users, color: "from-purple-400 to-pink-500" },
        { label: "Sản phẩm", value: totalProducts.toString(), change: "+2", up: true, icon: Package, color: "from-orange-400 to-red-500" },
    ];

    return { stats, recentOrders, topProducts };
}

export default async function AdminDashboard() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        redirect("/");
    }

    const { stats, recentOrders, topProducts } = await getAdminStats();

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                    Tổng Quan 📊
                </h1>
                <p className="text-[var(--color-text-light)] mt-1">Chào mừng trở lại, {session.user.name}!</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-dark)]">{stat.value}</p>
                        <p className="text-xs text-[var(--color-text-light)] mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                            Đơn hàng gần đây
                        </h2>
                        <Link href="/admin/don-hang" className="text-sm text-[var(--color-primary)] hover:underline font-medium">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] pb-3 uppercase tracking-wider">Mã đơn</th>
                                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] pb-3 uppercase tracking-wider">Khách hàng</th>
                                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] pb-3 uppercase tracking-wider hidden md:table-cell">Sản phẩm</th>
                                    <th className="text-right text-xs font-semibold text-[var(--color-text-light)] pb-3 uppercase tracking-wider">Tổng tiền</th>
                                    <th className="text-center text-xs font-semibold text-[var(--color-text-light)] pb-3 uppercase tracking-wider">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5">
                                            <span className="text-sm font-medium text-[var(--color-dark)]">#{order.orderNumber?.slice(-6) || order.id.slice(-6)}</span>
                                            <p className="text-xs text-[var(--color-text-light)] flex items-center gap-1 mt-0.5">
                                                <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </td>
                                        <td className="py-3.5 text-sm text-[var(--color-text)]">{order.recipientName || order.user?.name || "Khách lẻ"}</td>
                                        <td className="py-3.5 text-sm text-[var(--color-text)] hidden md:table-cell">{order.items[0]?.name || "Sản phẩm"} {order.items.length > 1 ? `+${order.items.length - 1}` : ""}</td>
                                        <td className="py-3.5 text-right text-sm font-semibold text-[var(--color-primary)]">{formatPrice(order.total)}</td>
                                        <td className="py-3.5 text-center">
                                            <span className={`badge text-[10px] ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top products */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                            Sản phẩm bán chạy
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    i === 1 ? 'bg-gray-100 text-gray-700' :
                                        i === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-50 text-gray-500'
                                    }`}>
                                    #{i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--color-dark)] truncate">{product.name}</p>
                                    <p className="text-xs text-[var(--color-text-light)]">{product.soldCount} đã bán</p>
                                </div>
                                <span className="text-sm font-semibold text-[var(--color-primary)]">{formatPrice(product.soldCount * product.basePrice)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Quick chart placeholder */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">Doanh thu 7 ngày qua</h3>
                        <div className="flex items-end gap-2 h-24">
                            {[60, 45, 80, 70, 90, 75, 95].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full rounded-t-md bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-light)] transition-all duration-500 hover:opacity-80"
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-[9px] text-[var(--color-text-light)]">
                                        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
