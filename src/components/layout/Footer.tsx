"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{ backgroundColor: 'var(--surface-dark)', color: 'rgba(255,255,255,0.75)' }}>
            {/* Newsletter */}
            <div
                className="py-12"
                style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--matcha-600), var(--matcha-700))' }}
            >
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        Nhận ưu đãi đặc biệt 🌿
                    </h3>
                    <p className="mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Đăng ký nhận thông tin khuyến mãi và các mẫu hoa mới nhất từ BloomShop
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Email của bạn..."
                            className="flex-1 px-5 py-3 rounded-full outline-none"
                            style={{
                                color: 'var(--text-dark)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                            }}
                        />
                        <button
                            className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
                            style={{
                                backgroundColor: 'var(--accent)',
                                color: 'white',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-dark)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                        >
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>

            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))' }}
                            >
                                🌿
                            </div>
                            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                BloomShop
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-5">
                            BloomShop - Nơi mỗi bó hoa là một thông điệp yêu thương.
                            Chúng tôi mang đến những bó hoa tươi đẹp nhất, được kết bởi
                            đội ngũ nghệ nhân hoa hàng đầu.
                        </p>
                        <div className="flex gap-3">
                            {["facebook", "instagram", "tiktok", "zalo"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm capitalize transition-all duration-300"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)')}
                                >
                                    {social[0].toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                            Danh mục
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Hoa Tươi", href: "/san-pham?category=hoa-tuoi" },
                                { name: "Hoa Bó", href: "/san-pham?category=hoa-bo" },
                                { name: "Hoa Chúc Mừng", href: "/san-pham?category=hoa-chuc-mung" },
                                { name: "Giỏ Hoa", href: "/san-pham?category=gio-hoa" },
                                { name: "Hoa Cưới", href: "/san-pham?category=hoa-cuoi" },
                                { name: "Mix Hoa", href: "/mix-hoa" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-all duration-300 inline-block hover:pl-1"
                                        style={{ color: 'rgba(255,255,255,0.70)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                            Hỗ trợ
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Chính sách giao hàng", href: "#" },
                                { name: "Chính sách đổi trả", href: "#" },
                                { name: "Hướng dẫn đặt hàng", href: "#" },
                                { name: "Câu hỏi thường gặp", href: "#" },
                                { name: "Điều khoản sử dụng", href: "#" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-all duration-300 inline-block hover:pl-1"
                                        style={{ color: 'rgba(255,255,255,0.70)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                            Liên hệ
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                                <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                                <a
                                    href="tel:0901234567"
                                    className="transition-colors"
                                    style={{ color: 'rgba(255,255,255,0.75)' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                                >
                                    0901 234 567
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                                <a
                                    href="mailto:hello@bloomshop.vn"
                                    className="transition-colors"
                                    style={{ color: 'rgba(255,255,255,0.75)' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                                >
                                    hello@bloomshop.vn
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Clock size={16} className="flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                                <span>7:00 - 21:00, T2 - CN</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        © 2024 BloomShop. Tất cả quyền được bảo lưu.
                    </p>
                    <p className="text-sm flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Made with <Heart size={14} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} /> in Vietnam
                    </p>
                </div>
            </div>
        </footer>
    );
}
