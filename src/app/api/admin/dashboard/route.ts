import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function isAdmin() {
    const session = await auth();
    return session?.user && (session.user as any).role === "ADMIN";
}

// GET /api/admin/dashboard — dashboard stats
export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            totalProducts,
            totalOrders,
            totalCustomers,
            monthlyOrders,
            lastMonthOrders,
            recentOrders,
            topProducts,
            ordersByStatus,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count({ where: { role: "USER" } }),
            prisma.order.findMany({
                where: { createdAt: { gte: startOfMonth } },
                select: { total: true },
            }),
            prisma.order.findMany({
                where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
                select: { total: true },
            }),
            prisma.order.findMany({
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    user: { select: { name: true } },
                    items: { take: 2 },
                },
            }),
            prisma.product.findMany({
                orderBy: { soldCount: "desc" },
                take: 5,
                select: { name: true, soldCount: true, basePrice: true },
            }),
            prisma.order.groupBy({
                by: ["status"],
                _count: true,
            }),
        ]);

        const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
        const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
        const revenueGrowth = lastMonthRevenue > 0
            ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
            : "0";

        return NextResponse.json({
            stats: {
                totalProducts,
                totalOrders,
                totalCustomers,
                monthlyRevenue,
                revenueGrowth: parseFloat(revenueGrowth as string),
            },
            recentOrders,
            topProducts,
            ordersByStatus: ordersByStatus.reduce((acc: any, item) => {
                acc[item.status] = item._count;
                return acc;
            }, {}),
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
