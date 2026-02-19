import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: "asc" },
            include: {
                _count: { select: { products: true } },
            },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Lỗi khi tải danh mục" }, { status: 500 });
    }
}
