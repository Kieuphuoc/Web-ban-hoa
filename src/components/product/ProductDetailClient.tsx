"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Minus, Plus, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";

interface ProductVariant {
    id: string;
    name: string;
    price: number;
}

interface ProductImage {
    id: string;
    url: string;
    alt: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ProductDetail {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    meaning: string | null;
    basePrice: number;
    salePrice: number | null;
    category: { name: string; slug: string };
    images: ProductImage[];
    variants: ProductVariant[];
    colors: string[];
    occasion: string[];
    reviews: Review[];
    rating: number;
    soldCount: number;
}

interface ProductDetailClientProps {
    product: ProductDetail;
    relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants.length > 0 ? product.variants[0] : null
    );
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"desc" | "meaning" | "reviews">("desc");
    const addItem = useCartStore((state) => state.addItem);

    const currentPrice = selectedVariant ? selectedVariant.price : (product.salePrice || product.basePrice);

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
            price: currentPrice,
            image: product.images[0]?.url || "/images/placeholder.jpg",
            quantity,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
        });
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, { icon: "🌸" });
    };

    const discount = product.salePrice && !selectedVariant
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/san-pham" className="hover:text-[var(--color-primary)] transition-colors">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-[var(--color-dark)] font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Images */}
                    <div>
                        <div className="relative aspect-square bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-accent)] rounded-3xl overflow-hidden flex items-center justify-center mb-4">
                            {product.images.length > 0 ? (
                                <img src={product.images[0].url} alt={product.images[0].alt} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[120px] opacity-60">🌹</div>
                            )}

                            {discount > 0 && (
                                <div className="absolute top-4 left-4 badge bg-[var(--color-primary)] text-white">
                                    -{discount}%
                                </div>
                            )}
                            <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md">
                                <Heart size={20} className="text-[var(--color-primary)]" />
                            </button>
                        </div>
                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-auto">
                                {product.images.map((img, i) => (
                                    <button key={img.id} className={`aspect-square w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? 'border-[var(--color-primary)]' : 'border-gray-200 hover:border-[var(--color-primary-light)]'}`}>
                                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-2">
                            <span className="text-sm text-[var(--color-text-light)]">{product.category.name}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={16} className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                            <span className="text-sm text-[var(--color-text-light)]">|</span>
                            <span className="text-sm text-[var(--color-text-light)]">{product.soldCount} đã bán</span>
                            <button className="ml-auto p-2 hover:bg-[var(--color-rose)] rounded-full transition-all">
                                <Share2 size={18} className="text-[var(--color-text-light)]" />
                            </button>
                        </div>

                        {/* Price */}
                        <div className="bg-[var(--color-rose)] rounded-2xl p-5 mb-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-[var(--color-primary)]">
                                    {formatPrice(currentPrice)}
                                </span>
                                {product.salePrice && !selectedVariant && (
                                    <>
                                        <span className="text-lg text-[var(--color-text-light)] line-through">{formatPrice(product.basePrice)}</span>
                                        <span className="badge bg-[var(--color-primary)] text-white">-{discount}%</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Variants */}
                        {product.variants.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">Kích cỡ</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedVariant?.id === variant.id
                                                ? "bg-[var(--color-primary)] text-white shadow-md"
                                                : "bg-white border border-gray-200 text-[var(--color-text)] hover:border-[var(--color-primary)]"
                                                }`}
                                        >
                                            {variant.name} - {formatPrice(variant.price)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">Số lượng</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 mb-8">
                            <button onClick={handleAddToCart} className="flex-1 btn-primary text-lg py-4">
                                <ShoppingBag size={20} className="mr-2" />
                                Thêm vào giỏ
                            </button>
                            <Link href="/gio-hang" onClick={handleAddToCart} className="flex-1 btn-gold text-lg py-4 text-center">
                                Mua ngay
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: <Truck size={20} />, text: "Giao nhanh 2h" },
                                { icon: <Shield size={20} />, text: "Cam kết tươi" },
                                { icon: <RotateCcw size={20} />, text: "Đổi trả miễn phí" },
                            ].map((benefit, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl text-center">
                                    <div className="text-[var(--color-primary)]">{benefit.icon}</div>
                                    <span className="text-xs font-medium text-[var(--color-text)]">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-16">
                    <div className="flex gap-1 border-b border-gray-200 mb-8">
                        {[
                            { key: "desc", label: "Mô tả" },
                            { key: "meaning", label: "Ý nghĩa hoa" },
                            { key: "reviews", label: `Đánh giá (${product.reviews.length})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${activeTab === tab.key
                                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                        : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-3xl">
                        {activeTab === "desc" && (
                            <div className="prose prose-lg animate-fade-in-up">
                                <p className="text-[var(--color-text)] leading-relaxed">{product.description}</p>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4">
                                        <h4 className="font-semibold text-sm mb-2">Màu sắc</h4>
                                        <p className="text-sm text-[var(--color-text-light)]">{product.colors.join(", ")}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <h4 className="font-semibold text-sm mb-2">Dịp tặng</h4>
                                        <p className="text-sm text-[var(--color-text-light)]">{product.occasion.join(", ")}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "meaning" && (
                            <div className="animate-fade-in-up">
                                <p className="text-[var(--color-text)] leading-relaxed text-lg">{product.meaning || "Đang cập nhật..."}</p>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="space-y-6 animate-fade-in-up">
                                {product.reviews.length > 0 ? (
                                    product.reviews.map((review) => (
                                        <div key={review.id} className="bg-white rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--color-rose)] flex items-center justify-center text-lg overflow-hidden">
                                                    {review.user.image ? <img src={review.user.image} alt={review.user.name || ""} /> : (review.user.name?.[0] || "U")}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{review.user.name || "Khách hàng"}</p>
                                                    <p className="text-xs text-[var(--color-text-light)]">{formatDate(review.createdAt)}</p>
                                                </div>
                                                <div className="ml-auto flex gap-0.5">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-[var(--color-text)]">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">Chưa có đánh giá nào.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                <div className="mt-20">
                    <h2 className="section-title text-left">Sản Phẩm Liên Quan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
                        {relatedProducts.map((product, i) => (
                            // @ts-ignore
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
