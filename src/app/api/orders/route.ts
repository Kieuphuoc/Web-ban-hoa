import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/orders — get user's orders
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const where: any = { userId };
        if (status) where.status = status;

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: { select: { slug: true } },
                    },
                },
            },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Lỗi khi tải đơn hàng" }, { status: 500 });
    }
}

// POST /api/orders — create new order
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await request.json();

        const {
            recipientName,
            recipientPhone,
            deliveryAddress,
            deliveryDate,
            deliveryTime,
            giftMessage,
            paymentMethod,
            items,
        } = body;

        if (!recipientName || !recipientPhone || !deliveryAddress || !items?.length) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin" },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        const total = subtotal + shippingFee;

        // Generate order number
        const now = new Date();
        const orderNumber = `DH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                recipientName,
                recipientPhone,
                deliveryAddress,
                deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
                deliveryTime,
                giftMessage,
                paymentMethod: paymentMethod || "COD",
                subtotal,
                shippingFee,
                total,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId || null,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image || null,
                    })),
                },
            },
            include: { items: true },
        });

        // Update product sold counts
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { soldCount: { increment: item.quantity } },
            });
        }

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Lỗi khi tạo đơn hàng" }, { status: 500 });
    }
}
