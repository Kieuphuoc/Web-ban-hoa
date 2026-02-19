import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone, User, Package, CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: { select: { name: true, slug: true, images: { take: 1 } } } },
            },
        },
    });

    if (!order) {
        notFound();
    }

    // Security check: only owner or admin can view
    if (order.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
        redirect("/don-hang"); // Or 403
    }

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                        <Link href="/">Trang chủ</Link><span>/</span>
                        <Link href="/don-hang">Đơn hàng của tôi</Link><span>/</span>
                        <span className="text-[var(--color-dark)] font-medium">#{order.orderNumber || order.id.slice(-8)}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/don-hang" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm text-[var(--color-dark)]">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-dark)] flex items-center gap-3">
                            Chi tiết đơn hàng
                            <span className={`badge text-sm ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                            </span>
                        </h1>
                        <p className="text-sm text-[var(--color-text-light)] mt-1 flex items-center gap-1">
                            <Clock size={14} />
                            Đã đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                                <Package size={20} className="text-[var(--color-primary)]" />
                                Sản phẩm ({order.items.length})
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                                        {item.image || item.product?.images[0]?.url ? (
                                            <img src={item.image || item.product?.images[0]?.url} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-accent)] flex-shrink-0 flex items-center justify-center text-2xl">🌸</div>
                                        )}
                                        <div className="flex-1">
                                            <Link href={`/san-pham/${item.product?.slug}`} className="font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-[var(--color-text-light)] mt-1">Số lượng: {item.quantity}</p>
                                            <p className="text-sm font-bold text-[var(--color-primary)] mt-1">{formatPrice(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[var(--color-dark)]">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-[var(--color-text-light)]">Tạm tính</span>
                                <span>{formatPrice(order.subtotal || order.total - (order.shippingFee || 0))}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[var(--color-text-light)]">Phí vận chuyển</span>
                                <span>{formatPrice(order.shippingFee || 0)}</span>
                            </div>
                            <hr className="border-gray-100 my-3" />
                            <div className="flex justify-between text-xl font-bold text-[var(--color-dark)]">
                                <span>Tổng cộng</span>
                                <span className="text-[var(--color-primary)]">{formatPrice(order.total)}</span>
                            </div>
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-3 text-sm text-[var(--color-text)]">
                                <CheckCircle size={18} className="text-green-500" />
                                Phương thức thanh toán: <span className="font-semibold uppercase">{order.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Customer Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                                <User size={20} className="text-[var(--color-primary)]" />
                                Thông tin người nhận
                            </h3>
                            <div className="space-y-3 text-sm text-[var(--color-text)]">
                                <p><span className="text-[var(--color-text-light)] block text-xs">Họ tên:</span> {order.recipientName}</p>
                                <p><span className="text-[var(--color-text-light)] block text-xs">Số điện thoại:</span> {order.recipientPhone}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-[var(--color-primary)]" />
                                Địa chỉ giao hàng
                            </h3>
                            <p className="text-sm text-[var(--color-text)] leading-relaxed">
                                {order.deliveryAddress}
                            </p>
                            {order.deliveryDate && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-[var(--color-text-light)] mb-1">Thời gian giao dự kiến:</p>
                                    <p className="text-sm font-medium">{new Date(order.deliveryDate).toLocaleDateString("vi-VN")} {order.deliveryTime}</p>
                                </div>
                            )}
                        </div>

                        {order.giftMessage && (
                            <div className="bg-[var(--color-rose)]/10 rounded-2xl p-6 shadow-sm border border-[var(--color-rose)]/20">
                                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                                    Lời nhắn yêu thương 💌
                                </h3>
                                <p className="italic text-[var(--color-dark)]">"{order.giftMessage}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
