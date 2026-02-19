import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductListing from "@/components/product/ProductListing";

export const metadata = {
    title: "Danh sách sản phẩm | BloomShop",
    description: "Khám phá bộ sưu tập hoa tươi, hoa bó, hoa chúc mừng đa dạng.",
};

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
    const categorySlug = searchParams.category as string;
    const sort = (searchParams.sort as string) || "newest";
    const search = searchParams.search as string;
    const page = parseInt((searchParams.page as string) || "1");
    const limit = 20;

    const where: any = { inStock: true };

    if (categorySlug) {
        where.category = { slug: categorySlug };
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const orderBy: any = (() => {
        switch (sort) {
            case "price-asc": return { basePrice: "asc" };
            case "price-desc": return { basePrice: "desc" };
            case "popular": return { soldCount: "desc" };
            case "bestselling": return { soldCount: "desc" };
            default: return { createdAt: "desc" };
        }
    })();

    const [products, total, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                category: { select: { name: true, slug: true } },
                images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
        }),
        prisma.product.count({ where }),
        prisma.category.findMany({
            orderBy: { sortOrder: "asc" },
            select: { id: true, name: true, slug: true },
        }),
    ]);

    // Attach ratings (mock or distinct query if needed, here we use avg from API logic or just 5 for list view perf)
    // For better perf, we can fetch aggregates or just let it be.
    // The ProductCard expects `rating`.
    const productsWithRating = await Promise.all(
        products.map(async (p) => {
            const avg = await prisma.review.aggregate({
                where: { productId: p.id },
                _avg: { rating: true },
            });
            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                basePrice: p.basePrice,
                salePrice: p.salePrice,
                image: p.images[0]?.url || "/images/placeholder.jpg",
                category: p.category.name,
                rating: avg._avg.rating || 0,
                soldCount: p.soldCount,
                featured: p.featured,
                isNew: (new Date().getTime() - new Date(p.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000, // 7 days
            };
        })
    );

    return {
        products: productsWithRating,
        total,
        categories,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

export default async function ProductListingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const data = await getProducts(resolvedSearchParams);

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-accent)] py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Bộ Sưu Tập Hoa 🌷
                    </h1>
                    <p className="text-[var(--color-text-light)]">
                        Trao gửi yêu thương qua từng cánh hoa
                    </p>
                </div>
            </div>

            <ProductListing
                initialProducts={data.products}
                categories={data.categories}
                totalProducts={data.total}
                currentPage={data.page}
                totalPages={data.totalPages}
            />
        </div>
    );
}
