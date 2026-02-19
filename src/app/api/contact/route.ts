import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/contact — submit contact message
export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Vui lòng điền tên, email và nội dung" },
                { status: 400 }
            );
        }

        const contactMessage = await prisma.contactMessage.create({
            data: { name, email, phone, subject, message },
        });

        return NextResponse.json(
            { message: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.", contactMessage },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating contact message:", error);
        return NextResponse.json({ error: "Lỗi khi gửi tin nhắn" }, { status: 500 });
    }
}
