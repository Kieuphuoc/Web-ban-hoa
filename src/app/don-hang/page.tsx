import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Clock, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";

export default async function OrderHistoryPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                take: 2,
                include: { product: { select: { images: { take: 1 } } } },
            },
        },
    });

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <div className="bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-accent)] py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                        Đơn Hàng Của Tôi 📦
                    </h1>
                    <p className="text-[var(--color-text-light)] mt-2">Theo dõi trạng thái đơn hàng</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <Package size={18} className="text-[var(--color-primary)]" />
                                        <span className="font-semibold text-[var(--color-dark)] text-sm">#{order.orderNumber || order.id.slice(-8)}</span>
                                        <span className={`badge ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-light)] mt-1 flex items-center gap-1 md:ml-8">
                                        <Clock size={12} />
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-[var(--color-primary)]">{formatPrice(order.total)}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-5">
                                {order.items.map((item, i) => (
                                    <div key={item.id} className="flex items-center gap-4 mb-3 last:mb-0">
                                        {item.image || item.product?.images[0]?.url ? (
                                            <img src={item.image || item.product?.images[0]?.url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-accent)] flex-shrink-0 flex items-center justify-center text-2xl">🌸</div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[var(--color-dark)]">{item.name}</p>
                                            <p className="text-xs text-[var(--color-text-light)]">x{item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                                    </div>
                                ))}
                                {/* If more items exist, maybe show "+X items" but we took 2 */}
                            </div>

                            {/* Footer */}
                            <div className="px-5 pb-5 flex justify-end">
                                <Link href={`/don-hang/${order.id}`} className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline font-medium">
                                    Xem chi tiết <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6">📦</div>
                        <h3 className="text-xl font-semibold text-[var(--color-dark)] mb-2">Chưa có đơn hàng</h3>
                        <p className="text-[var(--color-text-light)] mb-6">Hãy đặt hoa ngay để trải nghiệm dịch vụ của chúng tôi!</p>
                        <Link href="/san-pham" className="btn-primary">Đặt hoa ngay</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
