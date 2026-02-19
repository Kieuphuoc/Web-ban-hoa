"use client";

import Link from "next/link";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        basePrice: number;
        salePrice: number | null;
        image: string;
        category: string;
        rating: number;
        soldCount: number;
        featured?: boolean;
        isNew?: boolean;
    };
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.basePrice,
            image: product.image,
            quantity: 1,
        });
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, {
            icon: "🌿",
        });
    };

    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    return (
        <Link
            href={`/san-pham/${product.slug}`}
            className="card group animate-fade-in-up block"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Image */}
            <div
                className="relative overflow-hidden aspect-[3/4]"
                style={{ background: 'linear-gradient(135deg, var(--matcha-200), var(--matcha-300))' }}
            >
                {/* Placeholder gradient with emoji */}
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-40 group-hover:scale-110 transition-transform duration-700">
                    🌿
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                        <span
                            className="badge text-white text-[10px]"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            Mới
                        </span>
                    )}
                    {discount > 0 && (
                        <span
                            className="badge text-white text-[10px]"
                            style={{ backgroundColor: 'var(--accent)' }}
                        >
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Quick actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300"
                        style={{ color: 'var(--text-body)' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--accent)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'var(--text-body)';
                        }}
                        aria-label="Yêu thích"
                    >
                        <Heart size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300"
                        style={{ color: 'var(--text-body)' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--primary)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'var(--text-body)';
                        }}
                        aria-label="Xem nhanh"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Add to cart button */}
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-2.5 backdrop-blur-sm rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            color: 'var(--accent-dark)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--accent)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
                            e.currentTarget.style.color = 'var(--accent-dark)';
                        }}
                    >
                        <ShoppingBag size={16} />
                        Thêm vào giỏ
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{product.category}</p>
                <h3
                    className="font-semibold text-sm mb-2 line-clamp-2 transition-colors min-h-[2.5rem]"
                    style={{ color: 'var(--text-dark)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-dark)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dark)')}
                >
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-dark)' }}>{product.rating}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ({product.soldCount} đã bán)
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: 'var(--accent-dark)' }}>
                        {formatPrice(product.salePrice || product.basePrice)}
                    </span>
                    {product.salePrice && (
                        <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>
                            {formatPrice(product.basePrice)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
