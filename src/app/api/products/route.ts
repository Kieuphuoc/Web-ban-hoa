import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products — list products with filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") || "newest";
        const featured = searchParams.get("featured");
        const bestseller = searchParams.get("bestseller");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const where: any = { inStock: true };

        if (category) {
            where.category = { slug: category };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        if (featured === "true") where.featured = true;
        if (bestseller === "true") where.bestseller = true;

        const orderBy: any = (() => {
            switch (sort) {
                case "price-asc": return { basePrice: "asc" };
                case "price-desc": return { basePrice: "desc" };
                case "popular": return { soldCount: "desc" };
                case "name": return { name: "asc" };
                default: return { createdAt: "desc" };
            }
        })();

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: { select: { name: true, slug: true } },
                    images: { orderBy: { sortOrder: "asc" }, take: 2 },
                    variants: { orderBy: { sortOrder: "asc" } },
                    _count: { select: { reviews: true } },
                },
            }),
            prisma.product.count({ where }),
        ]);

        // Calculate average rating for each product
        const productsWithRating = await Promise.all(
            products.map(async (product) => {
                const avgRating = await prisma.review.aggregate({
                    where: { productId: product.id },
                    _avg: { rating: true },
                });
                return {
                    ...product,
                    avgRating: avgRating._avg.rating || 0,
                };
            })
        );

        return NextResponse.json({
            products: productsWithRating,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Lỗi khi tải sản phẩm" }, { status: 500 });
    }
}
