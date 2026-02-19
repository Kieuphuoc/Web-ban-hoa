import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function isAdmin() {
    const session = await auth();
    return session?.user && (session.user as any).role === "ADMIN";
}

// GET /api/admin/orders — admin order list
export async function GET(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const where: any = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: "insensitive" } },
                { recipientName: { contains: search, mode: "insensitive" } },
                { recipientPhone: { contains: search } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: { select: { name: true, email: true } },
                    items: true,
                },
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            orders,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Admin orders error:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// PUT /api/admin/orders — update order status
export async function PUT(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const { id, status } = await request.json();
        const validStatuses = ["PENDING", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"];

        if (!id || !status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: true },
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json({ error: "Lỗi khi cập nhật đơn hàng" }, { status: 500 });
    }
}
