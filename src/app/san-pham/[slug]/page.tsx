import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { use } from "react";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug },
        select: { name: true, description: true },
    });

    if (!product) {
        return {
            title: "Sản phẩm không tìm thấy",
        };
    }

    return {
        title: `${product.name} | BloomShop`,
        description: product.description || `Mua ${product.name} tại BloomShop`,
    };
}

async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: { select: { name: true, slug: true } },
            images: { orderBy: { sortOrder: "asc" } },
            variants: { orderBy: { sortOrder: "asc" } },
            reviews: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!product) return null;

    // Calculate rating
    const avgRating = await prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true }
    });

    return { ...product, rating: avgRating._avg.rating || 5 };
}

async function getRelatedProducts(categoryId: string, currentId: string) {
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            id: { not: currentId },
            inStock: true,
        },
        take: 4,
        orderBy: { soldCount: "desc" },
        include: {
            category: { select: { name: true } },
            images: { take: 1 },
        },
    });

    // Attach ratings to related products mostly for display consistency
    return Promise.all(products.map(async (p) => {
        const avg = await prisma.review.aggregate({
            where: { productId: p.id },
            _avg: { rating: true }
        });
        return {
            ...p,
            category: p.category.name,
            image: p.images[0]?.url || "",
            rating: avg._avg.rating || 5, // Default or fetch
        }
    }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

    // Serialize dates for Client Component
    const serializedProduct = {
        ...product,
        images: product.images.map(img => ({ id: img.id, url: img.url, alt: img.alt || "" })),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        reviews: product.reviews.map(r => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            comment: r.comment || "", // Ensure string
            user: {
                name: r.user.name || "Khách hàng",
                image: r.user.image,
            }
        })),
    };

    return (
        <ProductDetailClient
            product={serializedProduct}
            relatedProducts={relatedProducts}
        />
    );
}
