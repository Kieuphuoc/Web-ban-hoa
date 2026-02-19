"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutGrid } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Product {
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
}

interface ProductListingProps {
    initialProducts: Product[];
    categories: Category[];
    totalProducts: number;
    currentPage: number;
    totalPages: number;
}

const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá thấp → cao", value: "price-asc" },
    { label: "Giá cao → thấp", value: "price-desc" },
    { label: "Phổ biến nhất", value: "popular" },
];

export default function ProductListing({
    initialProducts,
    categories,
    totalProducts,
}: ProductListingProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryParam = searchParams.get("category") || "";
    const sortParam = searchParams.get("sort") || "newest";
    const searchParam = searchParams.get("search") || "";

    const [gridCols, setGridCols] = useState(4);
    const [showFilters, setShowFilters] = useState(false);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page on filter change
        if (key !== "page") params.delete("page");

        router.push(`/san-pham?${params.toString()}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Info */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
                {searchParam ? `Kết quả cho "${searchParam}"` : "Bộ Sưu Tập Hoa 🌷"}
            </h1>
            <p className="text-[var(--color-text-light)] text-center mb-8">
                {totalProducts} sản phẩm được tìm thấy
            </p>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => updateFilters("category", "")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!categoryParam
                                ? "bg-[var(--color-primary)] text-white shadow-md"
                                : "bg-white text-[var(--color-text)] hover:bg-[var(--color-rose)]"
                            }`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => updateFilters("category", cat.slug)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${categoryParam === cat.slug
                                    ? "bg-[var(--color-primary)] text-white shadow-md"
                                    : "bg-white text-[var(--color-text)] hover:bg-[var(--color-rose)]"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortParam}
                            onChange={(e) => updateFilters("sort", e.target.value)}
                            className="appearance-none bg-white px-4 py-2 pr-8 rounded-xl text-sm border border-gray-200 outline-none focus:border-[var(--color-primary)] cursor-pointer"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Grid toggle */}
                    <div className="hidden md:flex items-center gap-1 bg-white rounded-xl p-1">
                        <button
                            onClick={() => setGridCols(3)}
                            className={`p-2 rounded-lg transition-all ${gridCols === 3 ? 'bg-[var(--color-rose)] text-[var(--color-primary)]' : 'text-gray-400'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setGridCols(4)}
                            className={`p-2 rounded-lg transition-all ${gridCols === 4 ? 'bg-[var(--color-rose)] text-[var(--color-primary)]' : 'text-gray-400'}`}
                        >
                            <Grid3X3 size={16} />
                        </button>
                    </div>

                    {/* Filter button (mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm border border-gray-200"
                    >
                        <SlidersHorizontal size={16} />
                        Bộ lọc
                    </button>
                </div>
            </div>

            {/* Products grid */}
            {initialProducts.length > 0 ? (
                <div className={`grid grid-cols-2 ${gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4 md:gap-6 pb-10`}>
                    {initialProducts.map((product, i) => (
                        // @ts-ignore
                        <ProductCard key={product.id} product={product} index={i} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-[var(--color-dark)] mb-2">
                        Không tìm thấy sản phẩm
                    </h3>
                    <p className="text-[var(--color-text-light)] mb-6">
                        Thử thay đổi bộ lọc hoặc tìm kiếm khác
                    </p>
                    <button
                        onClick={() => updateFilters("category", "")}
                        className="btn-primary"
                    >
                        Xem tất cả sản phẩm
                    </button>
                </div>
            )}
        </div>
    );
}
