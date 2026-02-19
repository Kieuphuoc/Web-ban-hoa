"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Gift } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-4xl animate-pulse">🛒</div></div>;

    const shippingFee = getTotal() >= 500000 ? 0 : 30000;
    const total = getTotal() + shippingFee;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="text-8xl mb-6">🛒</div>
                <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    Giỏ hàng trống
                </h2>
                <p className="text-[var(--color-text-light)] mb-8 text-center max-w-md">
                    Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập hoa tươi của chúng tôi nhé!
                </p>
                <Link href="/san-pham" className="btn-primary text-lg">
                    <ShoppingBag size={20} className="mr-2" />
                    Khám phá sản phẩm
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-[var(--color-dark)] font-medium">Giỏ hàng ({items.length})</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
                    Giỏ Hàng Của Bạn 🛒
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 md:p-6 flex gap-4 group transition-all hover:shadow-md">
                                {/* Image */}
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-accent)] flex-shrink-0 flex items-center justify-center text-4xl">
                                    🌸
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-dark)] text-sm md:text-base line-clamp-2">
                                                {item.name}
                                            </h3>
                                            {item.variantName && (
                                                <p className="text-xs text-[var(--color-text-light)] mt-1">
                                                    Kích cỡ: {item.variantName}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.productId, item.variantId)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            aria-label="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="font-bold text-[var(--color-primary)]">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between items-center pt-4">
                            <Link href="/san-pham" className="flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                                <ArrowLeft size={16} />
                                Tiếp tục mua sắm
                            </Link>
                            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">
                                Xóa tất cả
                            </button>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 sticky top-28">
                            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
                                Tóm tắt đơn hàng
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-text-light)]">Tạm tính ({items.length} sản phẩm)</span>
                                    <span className="font-medium">{formatPrice(getTotal())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-text-light)]">Phí giao hàng</span>
                                    <span className={`font-medium ${shippingFee === 0 ? 'text-green-500' : ''}`}>
                                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                                    </span>
                                </div>
                                {shippingFee > 0 && (
                                    <div className="bg-[var(--color-rose)] rounded-xl p-3 text-xs text-[var(--color-text)]">
                                        🚚 Mua thêm {formatPrice(500000 - getTotal())} để được miễn phí giao hàng
                                    </div>
                                )}
                                <hr className="border-gray-100" />
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[var(--color-dark)]">Tổng cộng</span>
                                    <span className="text-xl font-bold text-[var(--color-primary)]">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Gift message */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-[var(--color-dark)]">
                                    <Gift size={16} className="text-[var(--color-primary)]" />
                                    Thiệp tặng kèm
                                </div>
                                <textarea
                                    placeholder="Viết lời nhắn cho người nhận..."
                                    className="input-field text-sm resize-none h-20"
                                />
                            </div>

                            <Link href="/thanh-toan" className="btn-primary w-full text-center text-lg py-4 block">
                                Tiến hành thanh toán
                            </Link>

                            <p className="text-xs text-center text-[var(--color-text-light)] mt-3">
                                🔒 Thanh toán an toàn & bảo mật
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
