import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function isAdmin() {
    const session = await auth();
    return session?.user && (session.user as any).role === "ADMIN";
}

// GET /api/admin/products — admin product list
export async function GET(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: { select: { name: true } },
                    images: { take: 1 },
                    _count: { select: { reviews: true, orderItems: true } },
                },
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Admin products error:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// POST /api/admin/products — create product
export async function POST(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const {
            name, slug, description, meaning, basePrice, salePrice,
            categoryId, occasion, colors, featured, bestseller,
            variants, images,
        } = body;

        if (!name || !slug || !basePrice || !categoryId) {
            return NextResponse.json(
                { error: "Tên, slug, giá và danh mục là bắt buộc" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                meaning,
                basePrice,
                salePrice,
                categoryId,
                occasion: occasion || [],
                colors: colors || [],
                featured: featured || false,
                bestseller: bestseller || false,
                variants: variants?.length
                    ? { create: variants.map((v: any, i: number) => ({ name: v.name, price: v.price, sortOrder: i })) }
                    : undefined,
                images: images?.length
                    ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt, sortOrder: i })) }
                    : undefined,
            },
            include: {
                category: true,
                variants: true,
                images: true,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });
        }
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Lỗi khi tạo sản phẩm" }, { status: 500 });
    }
}

// PUT /api/admin/products — update product
export async function PUT(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: "Thiếu ID sản phẩm" }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                meaning: data.meaning,
                basePrice: data.basePrice,
                salePrice: data.salePrice,
                categoryId: data.categoryId,
                occasion: data.occasion,
                colors: data.colors,
                featured: data.featured,
                bestseller: data.bestseller,
                inStock: data.inStock,
            },
            include: { category: true, variants: true, images: true },
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json({ error: "Lỗi khi cập nhật sản phẩm" }, { status: 500 });
    }
}

// DELETE /api/admin/products?id=xxx
export async function DELETE(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    try {
        const id = new URL(request.url).searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
        }

        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ message: "Đã xoá sản phẩm" });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json({ error: "Lỗi khi xoá sản phẩm" }, { status: 500 });
    }
}
