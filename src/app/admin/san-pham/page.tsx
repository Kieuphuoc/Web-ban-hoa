import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProductManagement from "@/components/admin/ProductManagement";

export default async function AdminProductsPage({
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

    const where: any = {};
    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            category: { select: { name: true } },
            images: { take: 1, orderBy: { sortOrder: "asc" } },
        },
    });

    const serializedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        inStock: p.inStock,
        soldCount: p.soldCount,
        category: { name: p.category.name },
        images: p.images.map((img) => ({ url: img.url })),
        featured: p.featured,
    }));

    return <ProductManagement products={serializedProducts} />;
}
