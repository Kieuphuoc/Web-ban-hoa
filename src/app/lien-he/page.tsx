"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1500));
        toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gold)] py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                        Liên Hệ Với Chúng Tôi 💬
                    </h1>
                    <p className="text-white/90 text-lg max-w-md mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact info cards */}
                    <div className="space-y-4">
                        {[
                            { icon: <MapPin />, title: "Địa chỉ", content: "123 Nguyễn Huệ, Quận 1\nTP. Hồ Chí Minh", color: "from-red-100 to-pink-100" },
                            { icon: <Phone />, title: "Hotline", content: "0901 234 567\n(7:00 - 21:00 hàng ngày)", color: "from-blue-100 to-indigo-100" },
                            { icon: <Mail />, title: "Email", content: "hello@bloomshop.vn\nhotro@bloomshop.vn", color: "from-green-100 to-teal-100" },
                            { icon: <Clock />, title: "Giờ mở cửa", content: "Thứ 2 - Chủ nhật\n7:00 - 21:00", color: "from-yellow-100 to-orange-100" },
                        ].map((item, i) => (
                            <div key={i} className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 flex items-start gap-4`}>
                                <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--color-dark)] mb-1">{item.title}</h3>
                                    <p className="text-sm text-[var(--color-text)] whitespace-pre-line">{item.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Social */}
                        <div className="bg-white rounded-2xl p-5">
                            <h3 className="font-semibold text-[var(--color-dark)] mb-4">Kết nối với chúng tôi</h3>
                            <div className="flex gap-3">
                                {[
                                    { name: "Zalo", emoji: "💬", color: "bg-blue-500" },
                                    { name: "Facebook", emoji: "📘", color: "bg-blue-600" },
                                    { name: "Messenger", emoji: "💜", color: "bg-purple-500" },
                                    { name: "Instagram", emoji: "📸", color: "bg-pink-500" },
                                ].map((s) => (
                                    <a key={s.name} href="#" className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-md`} title={s.name}>
                                        {s.emoji}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
                                Gửi tin nhắn cho chúng tôi
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Họ tên *</label>
                                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Nhập họ tên" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Email *</label>
                                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="your@email.com" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Số điện thoại</label>
                                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="0901 234 567" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Chủ đề</label>
                                        <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field">
                                            <option value="">Chọn chủ đề</option>
                                            <option>Hỏi về sản phẩm</option>
                                            <option>Thông tin đơn hàng</option>
                                            <option>Khiếu nại / Đổi trả</option>
                                            <option>Hợp tác kinh doanh</option>
                                            <option>Khác</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Nội dung *</label>
                                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none h-32" placeholder="Nhập nội dung tin nhắn..." required />
                                </div>
                                <button type="submit" disabled={isSubmitting} className={`btn-primary py-3.5 px-8 text-base ${isSubmitting ? 'opacity-70' : ''}`}>
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang gửi...</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><Send size={18} /> Gửi tin nhắn</span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Map placeholder */}
                        <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-lg">
                            <div className="bg-gradient-to-br from-green-100 to-blue-100 h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin size={48} className="mx-auto text-[var(--color-primary)] mb-3" />
                                    <p className="font-semibold text-[var(--color-dark)]">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                                    <p className="text-sm text-[var(--color-text-light)]">Google Maps sẽ được tích hợp tại đây</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
