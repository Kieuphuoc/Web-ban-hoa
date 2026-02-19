import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌸 Bắt đầu seed dữ liệu...");

    // Clean existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.review.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.mixedBouquet.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Đã xoá dữ liệu cũ");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
        data: {
            name: "Admin BloomShop",
            email: "admin@bloomshop.vn",
            password: adminPassword,
            role: "ADMIN",
            phone: "0901234567",
        },
    });

    // Create sample users
    const userPassword = await bcrypt.hash("user123", 10);
    const users = await Promise.all([
        prisma.user.create({
            data: { name: "Nguyễn Thị Mai", email: "mai@example.com", password: userPassword, phone: "0912345678" },
        }),
        prisma.user.create({
            data: { name: "Trần Văn Hùng", email: "hung@example.com", password: userPassword, phone: "0923456789" },
        }),
        prisma.user.create({
            data: { name: "Lê Thu Hà", email: "ha@example.com", password: userPassword, phone: "0934567890" },
        }),
    ]);

    console.log(`✅ Tạo ${users.length + 1} users (admin + ${users.length} users)`);

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({ data: { name: "Hoa Tươi", slug: "hoa-tuoi", description: "Bó hoa tươi đẹp mỗi ngày", image: "/images/cat-hoa-tuoi.jpg", sortOrder: 1 } }),
        prisma.category.create({ data: { name: "Hoa Chúc Mừng", slug: "hoa-chuc-mung", description: "Hoa khai trương, chúc mừng", image: "/images/cat-chuc-mung.jpg", sortOrder: 2 } }),
        prisma.category.create({ data: { name: "Hoa Cưới", slug: "hoa-cuoi", description: "Hoa cầm tay cô dâu, trang trí", image: "/images/cat-cuoi.jpg", sortOrder: 3 } }),
        prisma.category.create({ data: { name: "Hoa Chia Buồn", slug: "hoa-chia-buon", description: "Vòng hoa, lẵng hoa chia buồn", image: "/images/cat-chia-buon.jpg", sortOrder: 4 } }),
        prisma.category.create({ data: { name: "Giỏ Hoa", slug: "gio-hoa", description: "Giỏ hoa quà tặng sang trọng", image: "/images/cat-gio-hoa.jpg", sortOrder: 5 } }),
        prisma.category.create({ data: { name: "Hoa Sinh Nhật", slug: "hoa-sinh-nhat", description: "Hoa sinh nhật ý nghĩa", image: "/images/cat-sinh-nhat.jpg", sortOrder: 6 } }),
    ]);

    console.log(`✅ Tạo ${categories.length} categories`);

    // Create products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: "Bó Hồng Đỏ Tình Yêu",
                slug: "bo-hong-do-tinh-yeu",
                description: "Bó hoa hồng đỏ rực rỡ - biểu tượng của tình yêu mãnh liệt. Được gói trong giấy kraft sang trọng kết hợp nơ satin.",
                meaning: "Hồng đỏ tượng trưng cho tình yêu mãnh liệt, sự đam mê và lòng chung thủy.",
                basePrice: 450000, salePrice: 380000,
                categoryId: categories[0].id,
                occasion: ["Valentine", "Sinh nhật", "Kỷ niệm"],
                colors: ["Đỏ"], featured: true, bestseller: true, soldCount: 128, viewCount: 1520,
                images: { create: [{ url: "/images/hong-do-1.jpg", alt: "Bó hồng đỏ tình yêu", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "20 bông", price: 380000, sortOrder: 0 },
                        { name: "30 bông", price: 520000, sortOrder: 1 },
                        { name: "50 bông", price: 850000, sortOrder: 2 },
                        { name: "99 bông", price: 1500000, sortOrder: 3 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Hoa Ly Trắng Tinh Khôi",
                slug: "hoa-ly-trang-tinh-khoi",
                description: "Bó hoa ly trắng tinh khôi, thanh lịch và sang trọng.",
                meaning: "Hoa ly trắng tượng trưng cho sự thuần khiết, cao quý.",
                basePrice: 520000, categoryId: categories[0].id,
                occasion: ["Sinh nhật", "Kỷ niệm", "Cảm ơn"], colors: ["Trắng"],
                featured: true, soldCount: 76, viewCount: 890,
                images: { create: [{ url: "/images/ly-trang-1.jpg", alt: "Hoa ly trắng", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "5 cành", price: 520000, sortOrder: 0 },
                        { name: "10 cành", price: 950000, sortOrder: 1 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Bó Tulip Pastel",
                slug: "bo-tulip-pastel",
                description: "Bó tulip mix màu pastel dịu dàng, phong cách châu Âu.",
                meaning: "Hoa tulip tượng trưng cho tình yêu hoàn hảo.",
                basePrice: 680000, categoryId: categories[0].id,
                occasion: ["Sinh nhật", "Valentine", "8/3"], colors: ["Hồng", "Tím", "Trắng"],
                featured: true, soldCount: 54, viewCount: 720,
                images: { create: [{ url: "/images/tulip-pastel-1.jpg", alt: "Bó tulip pastel", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "10 bông", price: 680000, sortOrder: 0 },
                        { name: "20 bông", price: 1200000, sortOrder: 1 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Hoa Cẩm Chướng Hồng",
                slug: "hoa-cam-chuong-hong",
                description: "Bó hoa cẩm chướng hồng nhẹ nhàng, tươi tắn. Bền, giữ được lâu ngày.",
                meaning: "Hoa cẩm chướng hồng biểu trưng cho tình mẫu tử.",
                basePrice: 280000, categoryId: categories[0].id,
                occasion: ["Ngày của Mẹ", "Sinh nhật", "Cảm ơn"], colors: ["Hồng"],
                bestseller: true, soldCount: 142, viewCount: 1100,
                images: { create: [{ url: "/images/cam-chuong-1.jpg", alt: "Hoa cẩm chướng hồng", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "Nhỏ (10 bông)", price: 280000, sortOrder: 0 },
                        { name: "Vừa (20 bông)", price: 480000, sortOrder: 1 },
                        { name: "Lớn (30 bông)", price: 650000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Lan Hồ Điệp Tím",
                slug: "lan-ho-diep-tim",
                description: "Chậu lan hồ điệp tím quý phái, sang trọng.",
                meaning: "Lan hồ điệp tượng trưng cho sự sang trọng, thịnh vượng.",
                basePrice: 850000, categoryId: categories[1].id,
                occasion: ["Khai trương", "Chúc mừng", "Tân gia"], colors: ["Tím"],
                featured: true, soldCount: 67, viewCount: 950,
                images: { create: [{ url: "/images/lan-ho-diep-1.jpg", alt: "Lan hồ điệp tím", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "5 cành", price: 850000, sortOrder: 0 },
                        { name: "7 cành", price: 1200000, sortOrder: 1 },
                        { name: "10 cành", price: 1800000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Lẵng Hoa Khai Trương",
                slug: "lang-hoa-khai-truong",
                description: "Lẵng hoa lớn với lily, hồng, cẩm chướng và lá bạc.",
                meaning: "Biểu trưng cho sự khởi đầu tốt đẹp.",
                basePrice: 1200000, categoryId: categories[1].id,
                occasion: ["Khai trương", "Chúc mừng"], colors: ["Đỏ", "Vàng", "Trắng"],
                soldCount: 45, viewCount: 680,
                images: { create: [{ url: "/images/lang-khai-truong-1.jpg", alt: "Lẵng hoa khai trương", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "Size M", price: 1200000, sortOrder: 0 },
                        { name: "Size L", price: 1800000, sortOrder: 1 },
                        { name: "Size XL", price: 2500000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Bó Hoa Cô Dâu",
                slug: "bo-hoa-co-dau",
                description: "Bó hoa cầm tay cô dâu với hồng trắng, cát tường, baby.",
                meaning: "Tượng trưng cho sự thuần khiết, hạnh phúc vĩnh cửu.",
                basePrice: 750000, categoryId: categories[2].id,
                occasion: ["Cưới"], colors: ["Trắng", "Hồng nhạt"],
                featured: true, soldCount: 33, viewCount: 540,
                images: { create: [{ url: "/images/hoa-co-dau-1.jpg", alt: "Bó hoa cô dâu", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "Tròn nhỏ", price: 750000, sortOrder: 0 },
                        { name: "Tròn lớn", price: 1100000, sortOrder: 1 },
                        { name: "Thác nước", price: 1500000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Giỏ Hoa Hướng Dương",
                slug: "gio-hoa-huong-duong",
                description: "Giỏ hoa hướng dương rực rỡ, tràn đầy năng lượng tích cực.",
                meaning: "Hướng dương tượng trưng cho sự lạc quan, niềm vui.",
                basePrice: 580000, categoryId: categories[4].id,
                occasion: ["Sinh nhật", "Tốt nghiệp", "Cảm ơn"], colors: ["Vàng"],
                featured: true, bestseller: true, soldCount: 89, viewCount: 1200,
                images: { create: [{ url: "/images/gio-huong-duong-1.jpg", alt: "Giỏ hoa hướng dương", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "Giỏ nhỏ (3 bông)", price: 580000, sortOrder: 0 },
                        { name: "Giỏ vừa (5 bông)", price: 780000, sortOrder: 1 },
                        { name: "Giỏ lớn (7 bông)", price: 980000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Giỏ Hoa Mùa Xuân",
                slug: "gio-hoa-mua-xuan",
                description: "Giỏ hoa mix nhiều loại hoa theo mùa. Tươi tắn, rực rỡ sắc màu.",
                meaning: "Mang đến sự tươi mới, hy vọng và niềm vui.",
                basePrice: 620000, categoryId: categories[4].id,
                occasion: ["Sinh nhật", "8/3", "20/10"], colors: ["Mix"],
                bestseller: true, soldCount: 91, viewCount: 1050,
                images: { create: [{ url: "/images/gio-mua-xuan-1.jpg", alt: "Giỏ hoa mùa xuân", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "Size S", price: 620000, sortOrder: 0 },
                        { name: "Size M", price: 850000, sortOrder: 1 },
                        { name: "Size L", price: 1100000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Hoa Baby Trắng",
                slug: "hoa-baby-trang",
                description: "Bó baby trắng tinh khôi, dễ thương. Bó to, đầy.",
                meaning: "Baby trắng tượng trưng cho sự hồn nhiên, trong sáng.",
                basePrice: 350000, categoryId: categories[5].id,
                occasion: ["Sinh nhật", "Valentine", "Tốt nghiệp"], colors: ["Trắng"],
                soldCount: 95, viewCount: 880,
                images: { create: [{ url: "/images/baby-trang-1.jpg", alt: "Hoa baby trắng", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "Bó vừa", price: 350000, sortOrder: 0 },
                        { name: "Bó lớn", price: 550000, sortOrder: 1 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Bó Hồng Mix Pastel",
                slug: "bo-hong-mix-pastel",
                description: "Bó hồng mix nhiều sắc pastel dịu dàng.",
                meaning: "Mỗi màu hồng mang một ý nghĩa riêng.",
                basePrice: 520000, categoryId: categories[5].id,
                occasion: ["Sinh nhật", "8/3", "20/10"], colors: ["Hồng", "Cam", "Trắng"],
                featured: true, soldCount: 72, viewCount: 790,
                images: { create: [{ url: "/images/hong-pastel-1.jpg", alt: "Bó hồng mix pastel", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "15 bông", price: 520000, sortOrder: 0 },
                        { name: "25 bông", price: 780000, sortOrder: 1 },
                        { name: "40 bông", price: 1100000, sortOrder: 2 },
                    ]
                },
            },
        }),
        prisma.product.create({
            data: {
                name: "Hoa Hướng Dương Bó",
                slug: "hoa-huong-duong-bo",
                description: "Bó hoa hướng dương rực rỡ kết hợp lá xanh tươi.",
                meaning: "Hướng dương là biểu tượng của sự lạc quan.",
                basePrice: 420000, categoryId: categories[0].id,
                occasion: ["Sinh nhật", "Tốt nghiệp", "Cảm ơn"], colors: ["Vàng"],
                soldCount: 65, viewCount: 640,
                images: { create: [{ url: "/images/huong-duong-bo-1.jpg", alt: "Hoa hướng dương bó", sortOrder: 0 }] },
                variants: {
                    create: [
                        { name: "3 bông", price: 420000, sortOrder: 0 },
                        { name: "5 bông", price: 620000, sortOrder: 1 },
                    ]
                },
            },
        }),
    ]);

    console.log(`✅ Tạo ${products.length} products`);

    // Create reviews
    const reviewData = [
        { productId: products[0].id, userId: users[0].id, rating: 5, comment: "Hoa rất đẹp, tươi lâu. Giao hàng nhanh!" },
        { productId: products[0].id, userId: users[1].id, rating: 5, comment: "Bạn gái rất thích, hoa tươi và thơm." },
        { productId: products[0].id, userId: users[2].id, rating: 4, comment: "Hoa đẹp nhưng giao hơi trễ 30 phút." },
        { productId: products[3].id, userId: users[0].id, rating: 5, comment: "Hoa cẩm chướng bền, để được 2 tuần!" },
        { productId: products[4].id, userId: users[1].id, rating: 5, comment: "Lan hồ điệp tuyệt đẹp, ai cũng khen." },
        { productId: products[7].id, userId: users[2].id, rating: 5, comment: "Giỏ hướng dương rực rỡ, đẹp đúng hình." },
        { productId: products[7].id, userId: users[0].id, rating: 4, comment: "Hoa đẹp, giỏ hơi nhỏ so với hình." },
    ];

    await prisma.review.createMany({ data: reviewData });
    console.log(`✅ Tạo ${reviewData.length} reviews`);

    // Create sample orders
    await prisma.order.create({
        data: {
            orderNumber: "DH20240214ABC123",
            userId: users[0].id,
            recipientName: "Nguyễn Thị Mai", recipientPhone: "0912345678",
            deliveryAddress: "123 Nguyễn Huệ, Q1, TP.HCM",
            deliveryDate: new Date("2024-02-14"), deliveryTime: "9:00 - 11:00",
            giftMessage: "Chúc em Valentine vui vẻ! ❤️",
            status: "DELIVERED", paymentMethod: "COD",
            subtotal: 520000, shippingFee: 0, total: 520000,
            items: { create: [{ productId: products[0].id, name: "Bó Hồng Đỏ - 30 bông", price: 520000, quantity: 1 }] },
        },
    });

    await prisma.order.create({
        data: {
            orderNumber: "DH20240214DEF456",
            userId: users[1].id,
            recipientName: "Phạm Hồng Anh", recipientPhone: "0987654321",
            deliveryAddress: "456 Lê Lợi, Q3, TP.HCM",
            status: "PROCESSING", paymentMethod: "MOMO",
            subtotal: 850000, shippingFee: 0, total: 850000,
            items: { create: [{ productId: products[4].id, name: "Lan Hồ Điệp Tím - 5 cành", price: 850000, quantity: 1 }] },
        },
    });

    await prisma.order.create({
        data: {
            orderNumber: "DH20240213GHI789",
            userId: users[2].id,
            recipientName: "Trần Văn Minh", recipientPhone: "0976543210",
            deliveryAddress: "789 Pasteur, Q3, TP.HCM",
            status: "SHIPPING", paymentMethod: "BANK_TRANSFER",
            subtotal: 1450000, shippingFee: 0, total: 1450000,
            items: {
                create: [
                    { productId: products[6].id, name: "Bó Hoa Cô Dâu - Tròn lớn", price: 1100000, quantity: 1 },
                    { productId: products[9].id, name: "Hoa Baby Trắng - Bó vừa", price: 350000, quantity: 1 },
                ]
            },
        },
    });

    console.log("✅ Tạo 3 đơn hàng mẫu");

    await prisma.contactMessage.createMany({
        data: [
            { name: "Nguyễn Văn A", email: "a@example.com", phone: "0901111111", subject: "Hỏi về sản phẩm", message: "Cho tôi hỏi bó hồng 50 bông có giao trong ngày không ạ?" },
            { name: "Trần Thị B", email: "b@example.com", subject: "Hợp tác kinh doanh", message: "Tôi muốn đặt hoa số lượng lớn cho event công ty." },
        ],
    });

    console.log("✅ Tạo 2 contact messages");
    console.log("\n🎉 Seed hoàn tất! Đăng nhập:");
    console.log("  Admin: admin@bloomshop.vn / admin123");
    console.log("  User:  mai@example.com / user123");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
