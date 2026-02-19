"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Eye, Clock, CheckCircle } from "lucide-react";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderItem {
    id: string;
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
}

interface Order {
    id: string;
    orderNumber: string | null;
    status: string;
    total: number;
    createdAt: string;
    recipientName: string | null;
    recipientPhone: string | null;
    recipientAddress: string | null;
    user: { name: string | null } | null;
    items: OrderItem[];
}

export default function OrderManagement({ orders }: { orders: Order[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        if (search) params.set("search", search);
        else params.delete("search");
        if (statusFilter) params.set("status", statusFilter);
        router.push(`/admin/don-hang?${params.toString()}`);
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        const toastId = toast.loading("Đang cập nhật trạng thái...");
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            });

            if (res.ok) {
                toast.success("Đã cập nhật trạng thái", { id: toastId });
                router.refresh();
            } else {
                toast.error("Cập nhật thất bại", { id: toastId });
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật", { id: toastId });
        } finally {
            setUpdatingId(null);
        }
    };

    const applyFilter = (status: string) => {
        setStatusFilter(status);
        const params = new URLSearchParams(window.location.search);
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        else params.delete("status");
        router.push(`/admin/don-hang?${params.toString()}`);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                    Quản Lý Đơn Hàng 🛒
                </h1>
                <p className="text-[var(--color-text-light)] mt-1">{orders.length} đơn hàng (hiển thị)</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo mã đơn hoặc tên khách..." className="input-field pl-11" />
                </form>
                <div className="flex gap-2 flex-wrap">
                    {["", "PENDING", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"].map((s) => (
                        <button key={s} onClick={() => applyFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-[var(--color-text)] hover:bg-gray-200'}`}>
                            {s ? getStatusLabel(s) : "Tất cả"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase">Mã đơn</th>
                                <th className="text-left text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase">Khách hàng</th>
                                <th className="text-left text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase hidden md:table-cell">Địa chỉ</th>
                                <th className="text-right text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase">Tổng tiền</th>
                                <th className="text-center text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase">Trạng thái</th>
                                <th className="text-center text-xs font-semibold text-[var(--color-text-light)] p-4 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-mono text-sm font-semibold text-[var(--color-dark)]">#{order.orderNumber?.slice(-6) || order.id.slice(-6)}</span>
                                        <p className="text-xs text-[var(--color-text-light)] flex items-center gap-1 mt-0.5">
                                            <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-[var(--color-dark)]">{order.recipientName || order.user?.name || "Khách lẻ"}</p>
                                        <p className="text-xs text-[var(--color-text-light)]">{order.recipientPhone}</p>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--color-text)] hidden md:table-cell max-w-[200px] truncate">{order.recipientAddress}</td>
                                    <td className="p-4 text-right text-sm font-semibold text-[var(--color-primary)]">{formatPrice(order.total)}</td>
                                    <td className="p-4 text-center">
                                        <div className="relative inline-block">
                                            {updatingId === order.id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                                                    <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-white rounded-full animate-spin" />
                                                </div>
                                            )}
                                            <select
                                                className={`badge ${getStatusColor(order.status)} border-0 text-[10px] cursor-pointer appearance-none pr-6`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={updatingId === order.id}
                                            >
                                                <option value="PENDING">Chờ xác nhận</option>
                                                <option value="PROCESSING">Đang xử lý</option>
                                                <option value="SHIPPING">Đang giao</option>
                                                <option value="DELIVERED">Đã giao</option>
                                                <option value="CANCELLED">Đã huỷ</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-all" title="Xem chi tiết"><Eye size={16} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[var(--color-text-light)]">
                                        Không tìm thấy đơn hàng nào.
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
