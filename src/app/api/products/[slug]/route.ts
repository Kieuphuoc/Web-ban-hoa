import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products/[slug]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: { select: { name: true, slug: true } },
                images: { orderBy: { sortOrder: "asc" } },
                variants: { orderBy: { sortOrder: "asc" } },
                reviews: {
                    include: { user: { select: { name: true, image: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
                _count: { select: { reviews: true } },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
        }

        // Increment view count
        await prisma.product.update({
            where: { id: product.id },
            data: { viewCount: { increment: 1 } },
        });

        // Average rating
        const avgRating = await prisma.review.aggregate({
            where: { productId: product.id },
            _avg: { rating: true },
        });

        // Related products (same category)
        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                inStock: true,
            },
            take: 4,
            include: {
                images: { take: 1, orderBy: { sortOrder: "asc" } },
                variants: { orderBy: { sortOrder: "asc" }, take: 1 },
                _count: { select: { reviews: true } },
            },
        });

        return NextResponse.json({
            product: { ...product, avgRating: avgRating._avg.rating || 0 },
            relatedProducts,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Lỗi khi tải sản phẩm" }, { status: 500 });
    }
}
