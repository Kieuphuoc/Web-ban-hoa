"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (form.password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                }),
            });

            if (res.ok) {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                router.push("/login");
            } else {
                const data = await res.json();
                toast.error(data.error || "Đăng ký thất bại");
            }
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-rose)] via-[var(--color-cream)] to-[var(--color-accent)] px-4 py-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gold)] flex items-center justify-center text-2xl shadow-lg">🌸</div>
                    </Link>
                    <h1 className="text-3xl font-bold text-[var(--color-dark)] mt-4" style={{ fontFamily: "var(--font-display)" }}>
                        Tạo tài khoản
                    </h1>
                    <p className="text-[var(--color-text-light)] mt-1">Đặt hoa nhanh hơn, ưu đãi nhiều hơn</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Họ tên</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-11" placeholder="Nguyễn Văn A" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-11" placeholder="your@email.com" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Số điện thoại</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-11" placeholder="0901 234 567" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Mật khẩu</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-11 pr-11" placeholder="Tối thiểu 6 ký tự" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input-field pl-11" placeholder="Nhập lại mật khẩu" required />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className={`btn-primary w-full py-3.5 text-base ${isLoading ? 'opacity-70' : ''}`}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang tạo tài khoản...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">Đăng ký <ArrowRight size={18} /></span>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-[var(--color-text-light)]">hoặc</span><div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                            <span>🔴</span> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                            <span>🔵</span> Facebook
                        </button>
                    </div>

                    <p className="text-center mt-6 text-sm text-[var(--color-text-light)]">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
