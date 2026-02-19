import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import OrderManagement from "@/components/admin/OrderManagement";

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        redirect("/");
    }

    const resolvedSearchParams = await searchParams;
    const search = resolvedSearchParams.search as string | undefined;
    const status = resolvedSearchParams.status as string | undefined;

    const where: any = {};
    if (status) {
        where.status = status;
    }
    if (search) {
        where.OR = [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { recipientName: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
        ];
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true } },
            items: { include: { product: { select: { name: true, images: { take: 1 } } } } },
        },
    });

    const serializedOrders = orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt.toISOString(),
        recipientName: o.recipientName,
        recipientPhone: o.recipientPhone,
        recipientAddress: o.recipientAddress,
        user: o.user,
        items: o.items.map((i) => ({
            id: i.id,
            productId: i.productId,
            variantId: i.variantId || undefined,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            image: i.image || i.product?.images[0]?.url || "",
        })),
    }));

    return <OrderManagement orders={serializedOrders} />;
}
