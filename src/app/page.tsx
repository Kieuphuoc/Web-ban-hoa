import Link from "next/link";
import { ArrowRight, Star, Truck, Shield, Gift, Sparkles, Clock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import prisma from "@/lib/prisma";

// Static Data
const banners = [
  {
    title: "Bộ Sưu Tập Mùa Xuân",
    subtitle: "Gửi yêu thương qua từng cánh hoa",
    description: "Hoa tươi mỗi ngày — Giao trong 2 giờ nội thành. Tặng kèm thiệp handmade.",
    cta: "Đặt hoa ngay",
    link: "/san-pham",
    emoji: "🌿",
  },
];

const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Giao hoa siêu tốc",
    desc: "Giao trong 2 giờ nội thành HCM",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Cam kết hoa tươi",
    desc: "Đổi mới 100% nếu hoa héo",
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: "Thiệp miễn phí",
    desc: "Tặng kèm thiệp handmade",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Hỗ trợ 24/7",
    desc: "Luôn sẵn sàng phục vụ bạn",
  },
];

const categoryIcons: Record<string, string> = {
  "hoa-tuoi": "🌹",
  "hoa-bo": "💐",
  "hoa-chuc-mung": "🎉",
  "gio-hoa": "🧺",
  "hoa-cuoi": "💒",
  "hoa-chia-buon": "🕊️",
  "hoa-sinh-nhat": "🎂",
  "lan-ho-diep": "🦋",
};

// Matcha pastel category gradients
const categoryColors = [
  { from: "#E8F4E4", to: "#CFE8C6" },
  { from: "#F5F3EA", to: "#EEE8D8" },
  { from: "#CFE8C6", to: "#B7D3A8" },
  { from: "#F5F3EA", to: "#E8F4E4" },
  { from: "#E8F4E4", to: "#F5F3EA" },
  { from: "#F5C6CF", to: "#F5F3EA" },
];

async function getHomePageData() {
  const [categories, featuredProducts, bestsellerProducts, recentReviews] = await Promise.all([
    prisma.category.findMany({
      take: 6,
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { featured: true, inStock: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
    prisma.product.findMany({
      where: { bestseller: true, inStock: true },
      take: 4,
      orderBy: { soldCount: "desc" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
    prisma.review.findMany({
      take: 3,
      orderBy: { rating: "desc" },
      where: { rating: 5, comment: { not: "" } },
      include: { user: { select: { name: true, image: true } } },
    }),
  ]);

  const attachRatings = async (products: any[]) => {
    return Promise.all(
      products.map(async (p) => {
        const avg = await prisma.review.aggregate({
          where: { productId: p.id },
          _avg: { rating: true },
        });
        return {
          ...p,
          rating: avg._avg.rating || 5,
          image: p.images[0]?.url || "/images/placeholder.jpg",
          category: p.category.name,
        };
      })
    );
  };

  const featured = await attachRatings(featuredProducts);
  const bestsellers = await attachRatings(bestsellerProducts);

  return { categories, featured, bestsellers, recentReviews };
}

export default async function HomePage() {
  const { categories, featured, bestsellers, recentReviews } = await getHomePageData();

  return (
    <div style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden">
        <div
          className="min-h-[500px] md:min-h-[600px] flex items-center relative"
          style={{ background: 'linear-gradient(135deg, var(--matcha-500) 0%, var(--matcha-600) 50%, var(--matcha-700) 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute top-1/4 right-1/4 text-8xl floating-animation" style={{ opacity: 0.15 }}>🌿</div>
            <div className="absolute bottom-1/4 left-1/6 text-6xl floating-animation" style={{ opacity: 0.12, animationDelay: '2s' }}>🌸</div>
            <div className="absolute top-1/3 left-1/3 text-7xl floating-animation" style={{ opacity: 0.08, animationDelay: '4s' }}>💐</div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white text-sm mb-6 animate-fade-in-up"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <span className="text-lg">{banners[0].emoji}</span>
                <span>{banners[0].title}</span>
              </div>
              <h2
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up"
                style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
              >
                {banners[0].subtitle}
              </h2>
              <p
                className="text-lg md:text-xl mb-8 max-w-lg animate-fade-in-up"
                style={{ color: 'rgba(255,255,255,0.85)', animationDelay: "0.2s" }}
              >
                {banners[0].description}
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <Link
                  href={banners[0].link}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1"
                  style={{ backgroundColor: 'white', color: 'var(--accent-dark)' }}
                >
                  {banners[0].cta}
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/mix-hoa"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg transition-all duration-300"
                >
                  <Sparkles size={20} />
                  Tự mix hoa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features bar ── */}
      <section className="relative -mt-8 z-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid rgba(183,211,168,0.3)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'var(--primary-xlight)', color: 'var(--primary-dark)' }}
                >
                  {feature.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>{feature.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Danh Mục Hoa 🌿</h2>
          <p className="section-subtitle">Khám phá bộ sưu tập hoa đa dạng của chúng tôi</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const colors = categoryColors[i % categoryColors.length];
              return (
                <Link
                  key={cat.slug}
                  href={`/san-pham?category=${cat.slug}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="rounded-2xl p-6 text-center transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                      border: '1px solid rgba(183,211,168,0.2)',
                    }}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-500">
                      {categoryIcons[cat.slug] || "🌸"}
                    </div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-dark)' }}>
                      {cat.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {cat._count.products} sản phẩm
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title text-left mb-1">Sản Phẩm Nổi Bật ✨</h2>
              <p style={{ color: 'var(--text-muted)' }}>Được yêu thích nhất tuần này</p>
            </div>
            <Link
              href="/san-pham?sort=popular"
              className="btn-secondary text-sm hidden md:inline-flex"
            >
              Xem tất cả
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              // @ts-ignore
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/san-pham" className="btn-primary">
              Xem tất cả sản phẩm
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mix Hoa CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden p-8 md:p-16"
            style={{ background: 'linear-gradient(135deg, var(--matcha-400) 0%, var(--matcha-500) 50%, var(--matcha-700) 100%)' }}
          >
            {/* Decorative */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <div className="absolute top-1/4 right-1/6 text-6xl floating-animation" style={{ opacity: 0.15 }}>🌿</div>
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white text-sm mb-6"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <Sparkles size={16} />
                <span>Tính năng độc quyền</span>
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tự Tay Mix Bó Hoa Của Bạn
              </h2>
              <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Chọn từng bông hoa yêu thích, phối màu nơ và giấy gói.
                Tạo nên bó hoa độc nhất vô nhị cho người bạn yêu thương.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/mix-hoa"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:-translate-y-1"
                  style={{ backgroundColor: 'white', color: 'var(--accent-dark)' }}
                >
                  <Sparkles size={20} />
                  Bắt đầu mix hoa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bestsellers ── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-matcha-soft)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Bán Chạy Nhất 🔥</h2>
          <p className="section-subtitle">Được khách hàng tin tưởng lựa chọn</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((product, i) => (
              // @ts-ignore
              <ProductCard key={`best-${product.id}`} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Khách Hàng Nói Gì 💬</h2>
          <p className="section-subtitle">Hơn 10,000 khách hàng hài lòng</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReviews.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 animate-fade-in-up"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid rgba(183,211,168,0.25)',
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-body)' }}>
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {review.user.image
                        ? <img src={review.user.image} alt={review.user.name || "user"} className="w-8 h-8 rounded-full" />
                        : "👤"}
                    </span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>
                        {review.user.name || "Khách hàng"}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Mới đây
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
