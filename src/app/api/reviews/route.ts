import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/reviews — create review
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { productId, rating, comment } = await request.json();

        if (!productId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Vui lòng chọn số sao (1-5)" },
                { status: 400 }
            );
        }

        // Check if user already reviewed
        const existing = await prisma.review.findFirst({
            where: { productId, userId },
        });

        if (existing) {
            // Update existing review
            const review = await prisma.review.update({
                where: { id: existing.id },
                data: { rating, comment },
                include: { user: { select: { name: true, image: true } } },
            });
            return NextResponse.json({ review, updated: true });
        }

        const review = await prisma.review.create({
            data: { productId, userId, rating, comment },
            include: { user: { select: { name: true, image: true } } },
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Lỗi khi gửi đánh giá" }, { status: 500 });
    }
}

// GET /api/reviews?productId=xxx — get reviews for product
export async function GET(request: NextRequest) {
    try {
        const productId = new URL(request.url).searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Thiếu productId" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });

        const stats = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: true,
        });

        return NextResponse.json({
            reviews,
            stats: {
                avgRating: stats._avg.rating || 0,
                totalReviews: stats._count,
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Lỗi khi tải đánh giá" }, { status: 500 });
    }
}
