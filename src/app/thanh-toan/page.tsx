"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { MapPin, Phone, User, Calendar, Clock, FileText, CreditCard, ShieldCheck, ArrowLeft, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const paymentMethods = [
    { id: "cod", name: "Thanh toán khi nhận hàng (COD)", icon: "💵", desc: "Thanh toán bằng tiền mặt khi nhận hoa" },
    { id: "bank", name: "Chuyển khoản ngân hàng", icon: "🏦", desc: "Chuyển khoản qua tài khoản ngân hàng" },
    { id: "momo", name: "Ví MoMo", icon: "📱", desc: "Thanh toán qua ví điện tử MoMo" },
    { id: "vnpay", name: "VNPAY", icon: "💳", desc: "Thanh toán qua cổng VNPAY" },
    { id: "paypal", name: "PayPal", icon: "🌐", desc: "Thanh toán quốc tế qua PayPal" },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, getTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("cod");
    const [form, setForm] = useState({
        recipientName: "",
        recipientPhone: "",
        deliveryAddress: "",
        city: "TP. Hồ Chí Minh",
        deliveryDate: "",
        deliveryTime: "",
        giftMessage: "",
        notes: "",
    });

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-4xl animate-pulse">💳</div></div>;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="text-8xl mb-6">🛒</div>
                <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-3">Giỏ hàng trống</h2>
                <p className="text-[var(--color-text-light)] mb-8">Hãy thêm sản phẩm trước khi thanh toán</p>
                <Link href="/san-pham" className="btn-primary">Xem sản phẩm</Link>
            </div>
        );
    }

    const shippingFee = getTotal() >= 500000 ? 0 : 30000;
    const total = getTotal() + shippingFee;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            toast.error("Vui lòng đăng nhập để đặt hàng");
            signIn();
            return;
        }

        if (!form.recipientName || !form.recipientPhone || !form.deliveryAddress) {
            toast.error("Vui lòng điền đầy đủ thông tin người nhận");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    recipientName: form.recipientName,
                    recipientPhone: form.recipientPhone,
                    deliveryAddress: `${form.deliveryAddress}, ${form.city}`,
                    deliveryDate: form.deliveryDate || null,
                    deliveryTime: form.deliveryTime || null,
                    giftMessage: form.giftMessage,
                    notes: form.notes,
                    paymentMethod: selectedPayment,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                toast.success("🎉 Đặt hàng thành công!", { duration: 5000 });
                router.push("/don-hang"); // Assume this page exists or redirect to specific order
            } else {
                const data = await res.json();
                toast.error(data.error || "Đặt hàng thất bại");
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Lỗi khi tạo đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateForm = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                        <Link href="/">Trang chủ</Link><span>/</span>
                        <Link href="/gio-hang">Giỏ hàng</Link><span>/</span>
                        <span className="text-[var(--color-dark)] font-medium">Thanh toán</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
                    Thanh Toán 💳
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left - Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Recipient info */}
                            <div className="bg-white rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                                    <User size={20} className="text-[var(--color-primary)]" />
                                    Thông tin người nhận
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Họ tên *</label>
                                        <input type="text" value={form.recipientName} onChange={(e) => updateForm("recipientName", e.target.value)} className="input-field" placeholder="Nguyễn Văn A" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Số điện thoại *</label>
                                        <input type="tel" value={form.recipientPhone} onChange={(e) => updateForm("recipientPhone", e.target.value)} className="input-field" placeholder="0901 234 567" required />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery info */}
                            <div className="bg-white rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                                    <MapPin size={20} className="text-[var(--color-primary)]" />
                                    Địa chỉ giao hoa
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Địa chỉ chi tiết *</label>
                                        <input type="text" value={form.deliveryAddress} onChange={(e) => updateForm("deliveryAddress", e.target.value)} className="input-field" placeholder="Số nhà, tên đường, phường/xã" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Thành phố</label>
                                        <select value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="input-field">
                                            <option>TP. Hồ Chí Minh</option>
                                            <option>Hà Nội</option>
                                            <option>Đà Nẵng</option>
                                            <option>Cần Thơ</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5 flex items-center gap-1"><Calendar size={14} /> Ngày giao</label>
                                            <input type="date" value={form.deliveryDate} onChange={(e) => updateForm("deliveryDate", e.target.value)} className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5 flex items-center gap-1"><Clock size={14} /> Giờ giao</label>
                                            <select value={form.deliveryTime} onChange={(e) => updateForm("deliveryTime", e.target.value)} className="input-field">
                                                <option value="">Chọn khung giờ</option>
                                                <option>7:00 - 9:00</option>
                                                <option>9:00 - 11:00</option>
                                                <option>11:00 - 13:00</option>
                                                <option>13:00 - 15:00</option>
                                                <option>15:00 - 17:00</option>
                                                <option>17:00 - 19:00</option>
                                                <option>19:00 - 21:00</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gift message */}
                            <div className="bg-white rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                                    <FileText size={20} className="text-[var(--color-primary)]" />
                                    Thiệp & Ghi chú
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Nội dung thiệp (miễn phí)</label>
                                        <textarea value={form.giftMessage} onChange={(e) => updateForm("giftMessage", e.target.value)} className="input-field resize-none h-24" placeholder="Gửi người anh yêu, chúc em ngày Valentine hạnh phúc..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Ghi chú cho shop</label>
                                        <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} className="input-field resize-none h-20" placeholder="Ghi chú thêm cho đơn hàng..." />
                                    </div>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="bg-white rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                                    <CreditCard size={20} className="text-[var(--color-primary)]" />
                                    Phương thức thanh toán
                                </h3>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedPayment === method.id ? 'border-[var(--color-primary)] bg-[var(--color-rose)]' : 'border-gray-200 hover:border-[var(--color-primary-light)]'}`}>
                                            <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="hidden" />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPayment === method.id ? 'border-[var(--color-primary)]' : 'border-gray-300'}`}>
                                                {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                                            </div>
                                            <span className="text-2xl">{method.icon}</span>
                                            <div>
                                                <p className="font-medium text-sm text-[var(--color-dark)]">{method.name}</p>
                                                <p className="text-xs text-[var(--color-text-light)]">{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right - Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 sticky top-28">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-5" style={{ fontFamily: "var(--font-display)" }}>
                                    Đơn hàng của bạn
                                </h3>

                                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-accent)] flex-shrink-0 flex items-center justify-center text-xl">🌸</div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[var(--color-dark)] line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-[var(--color-text-light)]">x{item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-[var(--color-primary)]">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <hr className="border-gray-100 mb-4" />

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-light)]">Tạm tính</span>
                                        <span>{formatPrice(getTotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-light)]">Phí giao hàng</span>
                                        <span className={shippingFee === 0 ? "text-green-500" : ""}>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold">Tổng cộng</span>
                                        <span className="font-bold text-[var(--color-primary)]">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn-primary w-full text-lg py-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <ShieldCheck size={20} />
                                            Đặt hàng ({formatPrice(total)})
                                        </span>
                                    )}
                                </button>

                                <p className="text-xs text-center text-[var(--color-text-light)] mt-3">
                                    🔒 Thông tin của bạn được bảo mật 100%
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
