"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                toast.error("Email hoặc mật khẩu không đúng!");
            } else {
                toast.success("Đăng nhập thành công!");
                router.push("/");
                router.refresh(); // Refresh to update session state in server components
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Lỗi đăng nhập");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-rose)] via-[var(--color-cream)] to-[var(--color-accent)] px-4 py-12">
            {/* Decorative */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-1/4 text-6xl floating-animation opacity-10">🌸</div>
                <div className="absolute bottom-1/3 left-1/5 text-5xl floating-animation opacity-10" style={{ animationDelay: "3s" }}>🌹</div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gold)] flex items-center justify-center text-2xl shadow-lg">🌸</div>
                    </Link>
                    <h1 className="text-3xl font-bold text-[var(--color-dark)] mt-4" style={{ fontFamily: "var(--font-display)" }}>
                        Chào mừng trở lại
                    </h1>
                    <p className="text-[var(--color-text-light)] mt-1">Đăng nhập để tiếp tục</p>
                </div>

                {/* Form */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-dark)] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-11" placeholder="your@email.com" required />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-[var(--color-dark)]">Mật khẩu</label>
                                <Link href="#" className="text-xs text-[var(--color-primary)] hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-11 pr-11" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text)]">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className={`btn-primary w-full py-3.5 text-base ${isLoading ? 'opacity-70' : ''}`}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">Đăng nhập <ArrowRight size={18} /></span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-[var(--color-text-light)]">hoặc</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Social login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                            <span>🔴</span> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                            <span>🔵</span> Facebook
                        </button>
                    </div>

                    {/* Register link */}
                    <p className="text-center mt-6 text-sm text-[var(--color-text-light)]">
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
