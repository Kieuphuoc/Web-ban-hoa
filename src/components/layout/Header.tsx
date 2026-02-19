"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Search,
    ShoppingBag,
    User,
    Menu,
    X,
    Heart,
    Phone,
    MapPin,
    ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const categories = [
    { name: "Hoa Tươi", slug: "hoa-tuoi" },
    { name: "Hoa Bó", slug: "hoa-bo" },
    { name: "Hoa Chúc Mừng", slug: "hoa-chuc-mung" },
    { name: "Giỏ Hoa", slug: "gio-hoa" },
    { name: "Hoa Cưới", slug: "hoa-cuoi" },
    { name: "Hoa Chia Buồn", slug: "hoa-chia-buon" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const itemCount = useCartStore((state) => state.getItemCount());

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Top bar */}
            <div className="text-white text-sm py-2 hidden md:block" style={{ backgroundColor: 'var(--matcha-700)' }}>
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <a href="tel:0901234567" className="flex items-center gap-1 transition-colors" style={{ color: 'rgba(255,255,255,0.85)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}>
                            <Phone size={14} />
                            <span>0901 234 567</span>
                        </a>
                        <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                            <MapPin size={14} />
                            <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4" style={{ color: 'rgba(255,255,255,0.80)' }}>
                        <span>🌿 Miễn phí giao hàng đơn từ 500K</span>
                        <span>•</span>
                        <span>🌸 Hoa tươi mỗi ngày</span>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
                    ? "glass py-2"
                    : "py-3"
                    }`}
                style={!isScrolled ? { backgroundColor: 'rgba(250,250,247,0.96)' } : {}}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-transform group-hover:scale-110"
                                style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))' }}
                            >
                                🌿
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                                    <span className="gradient-text-matcha">Bloom</span>
                                    <span style={{ color: 'var(--text-dark)' }}>Shop</span>
                                </h1>
                                <p className="text-[10px] -mt-1 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                                    Hoa Tươi Mỗi Ngày
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                                style={{ color: 'var(--text-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--text-dark)';
                                }}
                            >
                                Trang chủ
                            </Link>

                            <div
                                className="relative"
                                onMouseEnter={() => setIsCategoryOpen(true)}
                                onMouseLeave={() => setIsCategoryOpen(false)}
                            >
                                <button
                                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                                    style={{ color: 'var(--text-dark)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                        e.currentTarget.style.color = 'var(--primary-dark)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = '';
                                        e.currentTarget.style.color = 'var(--text-dark)';
                                    }}
                                >
                                    Sản phẩm
                                    <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isCategoryOpen && (
                                    <div
                                        className="absolute top-full left-0 mt-1 w-56 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up py-2"
                                        style={{
                                            backgroundColor: 'var(--bg-main)',
                                            border: '1px solid rgba(183,211,168,0.35)'
                                        }}
                                    >
                                        <Link
                                            href="/san-pham"
                                            className="block px-5 py-2.5 text-sm transition-all"
                                            style={{ color: 'var(--text-dark)' }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                                e.currentTarget.style.color = 'var(--primary-dark)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.backgroundColor = '';
                                                e.currentTarget.style.color = 'var(--text-dark)';
                                            }}
                                        >
                                            Tất cả sản phẩm
                                        </Link>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/san-pham?category=${cat.slug}`}
                                                className="block px-5 py-2.5 text-sm transition-all"
                                                style={{ color: 'var(--text-dark)' }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.backgroundColor = '';
                                                    e.currentTarget.style.color = 'var(--text-dark)';
                                                }}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/mix-hoa"
                                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                                style={{
                                    color: 'var(--accent-dark)',
                                    backgroundColor: 'var(--accent-light)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                                    e.currentTarget.style.color = 'var(--accent-dark)';
                                }}
                            >
                                ✨ Mix Hoa
                            </Link>

                            <Link
                                href="/lien-he"
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                                style={{ color: 'var(--text-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--text-dark)';
                                }}
                            >
                                Liên hệ
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search toggle */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2.5 rounded-full transition-all duration-300"
                                style={{ color: 'var(--text-body)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-xlight)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                                aria-label="Tìm kiếm"
                            >
                                <Search size={20} />
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/yeu-thich"
                                className="p-2.5 rounded-full transition-all duration-300 hidden md:flex"
                                style={{ color: 'var(--text-body)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-xlight)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                                aria-label="Yêu thích"
                            >
                                <Heart size={20} />
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/gio-hang"
                                className="p-2.5 rounded-full transition-all duration-300 relative"
                                style={{ color: 'var(--text-body)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-xlight)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                                aria-label="Giỏ hàng"
                            >
                                <ShoppingBag size={20} />
                                {itemCount > 0 && (
                                    <span
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse"
                                        style={{ backgroundColor: 'var(--accent)' }}
                                    >
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* User */}
                            <Link
                                href="/login"
                                className="p-2.5 rounded-full transition-all duration-300 hidden md:flex"
                                style={{ color: 'var(--text-body)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-xlight)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                                aria-label="Tài khoản"
                            >
                                <User size={20} />
                            </Link>

                            {/* Mobile menu */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2.5 rounded-full transition-all duration-300 lg:hidden"
                                style={{ color: 'var(--text-body)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-xlight)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                                aria-label="Menu"
                            >
                                {isMenuOpen ? (
                                    <X size={20} />
                                ) : (
                                    <Menu size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search bar expanded */}
                    {isSearchOpen && (
                        <div className="mt-3 pb-3 animate-fade-in-up">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery)}`;
                                    }
                                }}
                                className="relative max-w-2xl mx-auto"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm hoa, dịp tặng, màu sắc..."
                                    className="input-field pl-12 pr-4"
                                    autoFocus
                                />
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--text-muted)' }}
                                />
                            </form>
                        </div>
                    )}
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div
                        className="lg:hidden mt-2 animate-fade-in-up"
                        style={{
                            backgroundColor: 'var(--bg-main)',
                            borderTop: '1px solid rgba(183,211,168,0.35)'
                        }}
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            <Link
                                href="/"
                                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{ color: 'var(--text-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--text-dark)';
                                }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                🏠 Trang chủ
                            </Link>
                            <Link
                                href="/san-pham"
                                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{ color: 'var(--text-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--text-dark)';
                                }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                🌿 Tất cả sản phẩm
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/san-pham?category=${cat.slug}`}
                                    className="block px-4 py-3 ml-4 rounded-xl text-sm transition-all"
                                    style={{ color: 'var(--text-body)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                        e.currentTarget.style.color = 'var(--primary-dark)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = '';
                                        e.currentTarget.style.color = 'var(--text-body)';
                                    }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                            <Link
                                href="/mix-hoa"
                                className="block px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                                style={{ color: 'var(--accent-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ✨ Mix Hoa
                            </Link>
                            <Link
                                href="/lien-he"
                                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{ color: 'var(--text-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--text-dark)';
                                }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                📞 Liên hệ
                            </Link>
                            <hr style={{ borderColor: 'rgba(183,211,168,0.4)' }} className="my-2" />
                            <Link
                                href="/login"
                                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{ color: 'var(--text-dark)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-xlight)';
                                    e.currentTarget.style.color = 'var(--primary-dark)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--text-dark)';
                                }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                👤 Đăng nhập
                            </Link>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
