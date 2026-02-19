"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Sparkles, RotateCcw, Download, Share2, ShoppingBag, Palette, Gift, Printer, QrCode, Trash2, Plus, Minus, Move } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface FlowerItem {
    id: string;
    type: string;
    emoji: string;
    image?: string;
    name: string;
    price: number;
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

const availableFlowers = [
    { type: "rose-red", emoji: "🌹", image: "/images/flowers/rose-red.png", name: "Hồng Đỏ", price: 15000 },
    { type: "rose-pink", emoji: "🌷", image: "/images/flowers/tulip-pink.png", name: "Tulip Hồng", price: 25000 },
    { type: "sunflower", emoji: "🌻", image: "/images/flowers/sunflower.png", name: "Hướng Dương", price: 20000 },
    { type: "daisy", emoji: "🌼", image: "/images/flowers/daisy-white.png", name: "Cúc Trắng", price: 10000 },
    { type: "cherry", emoji: "🌸", image: "/images/flowers/cherry-blossom.png", name: "Anh Đào", price: 18000 },
    { type: "hibiscus", emoji: "🌺", image: "/images/flowers/hibiscus.png", name: "Dâm Bụt", price: 12000 },
    { type: "lily", emoji: "💐", image: "/images/flowers/lily-white.png", name: "Bó Lily", price: 30000 },
    { type: "lavender", emoji: "💜", image: "/images/flowers/lavender.png", name: "Lavender", price: 22000 },
];

const bowColors = [
    { name: "Đỏ", color: "#e74c3c" },
    { name: "Hồng", color: "#e91e8c" },
    { name: "Vàng", color: "#f1c40f" },
    { name: "Trắng", color: "#ecf0f1" },
    { name: "Tím", color: "#9b59b6" },
    { name: "Xanh", color: "#2ecc71" },
];

const wrapColors = [
    { name: "Kraft", color: "#c4a882" },
    { name: "Trắng", color: "#f5f5f5" },
    { name: "Hồng nhạt", color: "#fadde1" },
    { name: "Tím nhạt", color: "#e8daef" },
    { name: "Xanh mint", color: "#d5f5e3" },
    { name: "Vàng nhạt", color: "#fef9e7" },
];

export default function MixHoaPage() {
    const [flowers, setFlowers] = useState<FlowerItem[]>([]);
    const [selectedBow, setSelectedBow] = useState(bowColors[0]);
    const [selectedWrap, setSelectedWrap] = useState(wrapColors[0]);
    const [printOnReal, setPrintOnReal] = useState(false);
    const [activeTab, setActiveTab] = useState<"flowers" | "bow" | "wrap" | "options">("flowers");
    const [dragItem, setDragItem] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const addItem = useCartStore((state) => state.addItem);

    const addFlower = (flower: typeof availableFlowers[0]) => {
        const newFlower: FlowerItem = {
            id: `${flower.type}-${Date.now()}`,
            type: flower.type,
            emoji: flower.emoji,
            image: flower.image,
            name: flower.name,
            price: flower.price,
            x: 50 + Math.random() * 100 - 50,
            y: 50 + Math.random() * 100 - 50,
            scale: 1,
            rotation: Math.random() * 40 - 20,
        };
        setFlowers((prev) => [...prev, newFlower]);
        toast.success(`Đã thêm ${flower.name}`, { icon: flower.emoji, duration: 1500 });
    };

    const removeFlower = (id: string) => {
        setFlowers((prev) => prev.filter((f) => f.id !== id));
    };

    const clearAll = () => {
        setFlowers([]);
        toast("Đã xoá tất cả hoa", { icon: "🗑️" });
    };

    const totalPrice = flowers.reduce((sum, f) => sum + f.price, 0) + (printOnReal ? 50000 : 0);

    const flowerCounts = flowers.reduce((acc, f) => {
        acc[f.name] = (acc[f.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleAddToCart = () => {
        if (flowers.length === 0) {
            toast.error("Vui lòng thêm ít nhất một loại hoa!");
            return;
        }
        addItem({
            productId: `mix-${Date.now()}`,
            name: `Bó Hoa Mix (${flowers.length} bông)`,
            price: totalPrice,
            image: "",
            quantity: 1,
        });
        toast.success("Đã thêm bó hoa mix vào giỏ hàng!", { icon: "🎉" });
    };

    const handleShare = () => {
        toast.success("Link chia sẻ đã được copy! (Demo)", { icon: "🔗" });
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] via-[#d98a86] to-[var(--color-gold)] py-10 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm mb-4">
                        <Sparkles size={16} />
                        <span>Tính năng độc quyền</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                        Tự Mix Bó Hoa Của Bạn ✨
                    </h1>
                    <p className="text-white/90 max-w-lg mx-auto">
                        Chọn từng bông hoa, phối màu nơ và giấy gói. Tạo bó hoa độc nhất vô nhị!
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Canvas */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: "var(--font-display)" }}>
                                    Bàn Mix Hoa
                                </h2>
                                <div className="flex gap-2">
                                    <button onClick={clearAll} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xoá tất cả">
                                        <RotateCcw size={18} />
                                    </button>
                                    <button onClick={handleShare} className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-rose)] rounded-lg transition-all" title="Chia sẻ">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Bouquet canvas */}
                            <div
                                ref={canvasRef}
                                className="relative aspect-[3/4] rounded-2xl overflow-hidden"
                                style={{ backgroundColor: selectedWrap.color }}
                            >
                                {/* Wrap pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                                </div>

                                {/* Bow ribbon */}
                                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-20">
                                    <div className="relative">
                                        <div className="w-20 h-8 rounded-full" style={{ backgroundColor: selectedBow.color, opacity: 0.9 }} />
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full" style={{ backgroundColor: selectedBow.color, opacity: 0.9 }} />
                                        {/* Ribbon tails */}
                                        <div className="absolute -bottom-6 left-2 w-3 h-8 rounded-b-full transform -rotate-12" style={{ backgroundColor: selectedBow.color, opacity: 0.7 }} />
                                        <div className="absolute -bottom-6 right-2 w-3 h-8 rounded-b-full transform rotate-12" style={{ backgroundColor: selectedBow.color, opacity: 0.7 }} />
                                    </div>
                                </div>

                                {/* Flowers */}
                                {flowers.length === 0 ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                        <div className="text-6xl mb-4 opacity-30">🌸</div>
                                        <p className="text-sm font-medium">Nhấn vào hoa bên phải để thêm vào bó</p>
                                        <p className="text-xs mt-1">Kéo thả để sắp xếp vị trí</p>
                                    </div>
                                ) : (
                                    flowers.map((flower, index) => (
                                        <div
                                            key={flower.id}
                                            className="absolute cursor-move group transition-transform hover:z-30"
                                            style={{
                                                left: `calc(50% + ${flower.x}px - 24px)`,
                                                top: `calc(40% + ${flower.y}px - 24px)`,
                                                transform: `scale(${flower.scale}) rotate(${flower.rotation}deg)`,
                                                zIndex: 10 + index,
                                            }}
                                            draggable
                                            onDragStart={() => setDragItem(flower.id)}
                                            onDragEnd={(e) => {
                                                if (canvasRef.current) {
                                                    const rect = canvasRef.current.getBoundingClientRect();
                                                    const x = e.clientX - rect.left - rect.width / 2;
                                                    const y = e.clientY - rect.top - rect.height * 0.4;
                                                    setFlowers((prev) =>
                                                        prev.map((f) =>
                                                            f.id === flower.id ? { ...f, x, y } : f
                                                        )
                                                    );
                                                }
                                                setDragItem(null);
                                            }}
                                        >
                                            {flower.image ? (
                                                <img
                                                    src={flower.image}
                                                    alt={flower.name}
                                                    className="w-16 h-16 object-cover rounded-full select-none drop-shadow-md"
                                                />
                                            ) : (
                                                <span className="text-5xl select-none drop-shadow-md">{flower.emoji}</span>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFlower(flower.id); }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}

                                {/* Stem area at bottom */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[20%]">
                                    <div className="w-full h-full bg-gradient-to-b from-transparent via-green-600/20 to-green-700/30 rounded-b-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Summary under canvas */}
                        {flowers.length > 0 && (
                            <div className="bg-white rounded-2xl p-5 mt-4 shadow-lg">
                                <h3 className="font-semibold text-[var(--color-dark)] mb-3">Tóm tắt bó hoa của bạn</h3>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {Object.entries(flowerCounts).map(([name, count]) => (
                                        <span key={name} className="badge bg-[var(--color-rose)] text-[var(--color-dark)]">
                                            {name} x{count}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-[var(--color-text-light)]">Tổng: {flowers.length} bông</span>
                                        {printOnReal && <span className="text-xs text-[var(--color-primary)] ml-3">+ In lên hoa thật</span>}
                                    </div>
                                    <span className="text-xl font-bold text-[var(--color-primary)]">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right panel */}
                    <div className="space-y-4">
                        {/* Tab navigation */}
                        <div className="bg-white rounded-2xl p-2 shadow-lg flex gap-1">
                            {[
                                { key: "flowers", label: "Hoa", icon: "🌸" },
                                { key: "bow", label: "Nơ", icon: "🎀" },
                                { key: "wrap", label: "Giấy", icon: "📜" },
                                { key: "options", label: "Tuỳ chọn", icon: "⚙️" },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === tab.key
                                        ? "bg-[var(--color-primary)] text-white shadow-md"
                                        : "text-[var(--color-text-light)] hover:bg-gray-50"
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Flowers panel */}
                        {activeTab === "flowers" && (
                            <div className="bg-white rounded-2xl p-5 shadow-lg animate-fade-in-up">
                                <h3 className="font-semibold text-[var(--color-dark)] mb-4">Chọn hoa 🌸</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableFlowers.map((flower) => (
                                        <button
                                            key={flower.type}
                                            onClick={() => addFlower(flower)}
                                            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-rose)] transition-all duration-300 group"
                                        >
                                            {flower.image ? (
                                                <img
                                                    src={flower.image}
                                                    alt={flower.name}
                                                    className="w-12 h-12 object-cover rounded-full group-hover:scale-125 transition-transform"
                                                />
                                            ) : (
                                                <span className="text-3xl group-hover:scale-125 transition-transform">{flower.emoji}</span>
                                            )}
                                            <span className="text-xs font-medium text-[var(--color-dark)]">{flower.name}</span>
                                            <span className="text-xs text-[var(--color-primary)] font-semibold">{formatPrice(flower.price)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bow panel */}
                        {activeTab === "bow" && (
                            <div className="bg-white rounded-2xl p-5 shadow-lg animate-fade-in-up">
                                <h3 className="font-semibold text-[var(--color-dark)] mb-4">Màu nơ 🎀</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {bowColors.map((bow) => (
                                        <button
                                            key={bow.name}
                                            onClick={() => setSelectedBow(bow)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedBow.name === bow.name
                                                ? "border-[var(--color-primary)] bg-[var(--color-rose)]"
                                                : "border-gray-100 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: bow.color }} />
                                            <span className="text-xs font-medium">{bow.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wrap panel */}
                        {activeTab === "wrap" && (
                            <div className="bg-white rounded-2xl p-5 shadow-lg animate-fade-in-up">
                                <h3 className="font-semibold text-[var(--color-dark)] mb-4">Giấy gói 📜</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {wrapColors.map((wrap) => (
                                        <button
                                            key={wrap.name}
                                            onClick={() => setSelectedWrap(wrap)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedWrap.name === wrap.name
                                                ? "border-[var(--color-primary)] bg-[var(--color-rose)]"
                                                : "border-gray-100 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg shadow-inner" style={{ backgroundColor: wrap.color }} />
                                            <span className="text-xs font-medium">{wrap.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Options panel */}
                        {activeTab === "options" && (
                            <div className="bg-white rounded-2xl p-5 shadow-lg animate-fade-in-up space-y-4">
                                <h3 className="font-semibold text-[var(--color-dark)] mb-2">Tuỳ chọn thêm ⚙️</h3>

                                {/* Print on real */}
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${printOnReal ? "border-[var(--color-primary)] bg-[var(--color-rose)]" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                    <input type="checkbox" checked={printOnReal} onChange={() => setPrintOnReal(!printOnReal)} className="hidden" />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${printOnReal ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-gray-300"
                                        }`}>
                                        {printOnReal && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Printer size={16} className="text-[var(--color-primary)]" />
                                            <span className="font-medium text-sm">In lên bó hoa thật</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-light)] mt-0.5">In hình bó hoa bạn mix đính kèm vào bó hoa thật (+50,000₫)</p>
                                    </div>
                                </label>

                                {/* QR Code voice */}
                                <div className="p-4 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <QrCode size={16} className="text-[var(--color-primary)]" />
                                        <span className="font-medium text-sm">Gửi voice kèm QR</span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-light)] mb-3">Ghi lại lời nhắn giọng nói, tạo QR code đính kèm lên bó hoa</p>
                                    <button className="btn-secondary text-xs py-2 px-4 w-full">
                                        🎤 Ghi âm lời nhắn
                                    </button>
                                </div>

                                {/* Share */}
                                <div className="p-4 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Share2 size={16} className="text-[var(--color-primary)]" />
                                        <span className="font-medium text-sm">Chia sẻ bó hoa</span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-light)] mb-3">Chia sẻ thiết kế lên trang cá nhân để người khác có thể lưu và đặt</p>
                                    <button onClick={handleShare} className="btn-secondary text-xs py-2 px-4 w-full">
                                        🔗 Tạo link chia sẻ
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="bg-white rounded-2xl p-5 shadow-lg space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-[var(--color-text)]">Tổng ước tính</span>
                                <span className="text-xl font-bold text-[var(--color-primary)]">{formatPrice(totalPrice)}</span>
                            </div>
                            <button onClick={handleAddToCart} className="btn-primary w-full py-3.5">
                                <ShoppingBag size={18} className="mr-2" />
                                Thêm vào giỏ hàng
                            </button>
                            <button onClick={handleShare} className="btn-secondary w-full py-3">
                                <Share2 size={18} className="mr-2" />
                                Chia sẻ bó hoa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
