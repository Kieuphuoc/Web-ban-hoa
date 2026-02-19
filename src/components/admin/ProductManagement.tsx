"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Eye, Edit, Trash2, Package, X, Upload } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice: number | null;
    inStock: boolean;
    soldCount: number;
    category: { name: string };
    images: { url: string }[];
    featured: boolean;
}

export default function ProductManagement({ products }: { products: Product[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "", // In real app, fetch categories
        basePrice: "",
        salePrice: "",
        description: "",
        images: [] as string[], // Simplified for now
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        if (search) params.set("search", search);
        else params.delete("search");
        router.push(`/admin/san-pham?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

        const toastId = toast.loading("Đang xoá...");
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Đã xoá sản phẩm", { id: toastId });
                router.refresh();
            } else {
                toast.error("Xoá thất bại", { id: toastId });
            }
        } catch (error) {
            toast.error("Lỗi khi xoá", { id: toastId });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Note: This needs a robust implementation with file upload and categories
        // For this demo, we assume categories are pre-seeded or hardcoded IDs, and image is a text URL
        // In a real scenario, we would use a proper file uploader and fetch categories.

        toast.error("Chức năng thêm/sửa chi tiết đang được phát triển. Vui lòng sử dụng Seed Data hoặc API trực tiếp.");
        setIsLoading(false);
        // Implement POST/PUT here
    };

    // Simplify for demo: only Delete is fully functional via UI
    // Add/Edit usually requires a complex form with variant management.

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                        Quản Lý Sản Phẩm 📦
                    </h1>
                    <p className="text-[var(--color-text-light)] mt-1">{products.length} sản phẩm (hiển thị)</p>
                </div>
                <button
                    onClick={() => toast.success("Vui lòng sử dụng API hoặc chức năng Import để thêm sản phẩm số lượng lớn.")}
                    className="btn-primary"
                >
                    <Plus size={18} className="mr-2" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="input-field pl-11"
                    />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase tracking-wider">Sản phẩm</th>
                                <th className="text-left text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                                <th className="text-right text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase tracking-wider">Giá</th>
                                <th className="text-center text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase tracking-wider hidden md:table-cell">Tồn kho</th>
                                <th className="text-center text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase tracking-wider hidden md:table-cell">Đã bán</th>
                                <th className="text-center text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {product.images[0] ? (
                                                <img src={product.images[0].url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-accent)] flex items-center justify-center text-xl flex-shrink-0">🌸</div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-sm text-[var(--color-dark)]">{product.name}</p>
                                                {product.featured && <span className="badge bg-yellow-100 text-yellow-700 text-[10px] mt-0.5">Nổi bật</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--color-text)] hidden md:table-cell">{product.category.name}</td>
                                    <td className="p-4 text-right text-sm font-semibold text-[var(--color-primary)]">{formatPrice(product.basePrice)}</td>
                                    <td className="p-4 text-center hidden md:table-cell">
                                        <span className={`badge ${!product.inStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {product.inStock ? "Còn hàng" : "Hết hàng"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-sm text-[var(--color-text)] hidden md:table-cell">{product.soldCount}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-all" title="Xem"><Eye size={16} /></button>
                                            <button className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-all" title="Sửa"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all" title="Xoá"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[var(--color-text-light)]">
                                        Không tìm thấy sản phẩm nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
