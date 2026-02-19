const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    // Flowers (Mix Hoa)
    { url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200&h=200&fit=crop", path: "public/images/flowers/rose-red.png" },
    { url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=200&h=200&fit=crop", path: "public/images/flowers/tulip-pink.png" },
    { url: "https://images.unsplash.com/photo-1597848212624-e530bb465129?w=200&h=200&fit=crop", path: "public/images/flowers/sunflower.png" },
    { url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop", path: "public/images/flowers/daisy-white.png" },
    { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=200&fit=crop", path: "public/images/flowers/cherry-blossom.png" },
    { url: "https://images.unsplash.com/photo-1462275646964-a73b294e6f2d?w=200&h=200&fit=crop", path: "public/images/flowers/hibiscus.png" },
    { url: "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=200&h=200&fit=crop", path: "public/images/flowers/lily-white.png" },
    { url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=200&h=200&fit=crop", path: "public/images/flowers/lavender.png" },

    // Products
    { url: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&h=800&fit=crop", path: "public/images/products/hong-do-1.jpg" }, // Red Roses
    { url: "https://images.unsplash.com/photo-1599587328905-2b22570b553e?w=800&h=800&fit=crop", path: "public/images/products/ly-trang-1.jpg" }, // White Lilies
    { url: "https://images.unsplash.com/photo-1572454591674-2739f30d8c40?w=800&h=800&fit=crop", path: "public/images/products/tulip-pastel-1.jpg" }, // Tulips
    { url: "https://images.unsplash.com/photo-1591871960243-7f74226d70a7?w=800&h=800&fit=crop", path: "public/images/products/cam-chuong-1.jpg" }, // Carnations
    { url: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=800&h=800&fit=crop", path: "public/images/products/lan-ho-diep-1.jpg" }, // Orchid
    { url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&h=800&fit=crop", path: "public/images/products/lang-khai-truong-1.jpg" }, // Grand Opening
    { url: "https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=800&h=800&fit=crop", path: "public/images/products/hoa-co-dau-1.jpg" }, // Bridal
    { url: "https://images.unsplash.com/photo-1621849400072-f554417f7051?w=800&h=800&fit=crop", path: "public/images/products/gio-huong-duong-1.jpg" }, // Sunflower Basket
    { url: "https://images.unsplash.com/photo-1588625500854-1d58a6a8bd7c?w=800&h=800&fit=crop", path: "public/images/products/gio-mua-xuan-1.jpg" }, // Spring Basket
    { url: "https://images.unsplash.com/photo-1613539246066-78db6ec4ff0f?w=800&h=800&fit=crop", path: "public/images/products/baby-trang-1.jpg" }, // Baby Breath
    { url: "https://images.unsplash.com/photo-1561191341-35b8004f2605?w=800&h=800&fit=crop", path: "public/images/products/hong-pastel-1.jpg" }, // Pastel Roses
    { url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=800&fit=crop", path: "public/images/products/huong-duong-bo-1.jpg" }, // Sunflower Bouquet

    // Categories
    { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=800&fit=crop", path: "public/images/categories/cat-hoa-tuoi.jpg" },
    { url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&h=800&fit=crop", path: "public/images/categories/cat-chuc-mung.jpg" },
    { url: "https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=800&h=800&fit=crop", path: "public/images/categories/cat-cuoi.jpg" },
    { url: "https://images.unsplash.com/photo-1596792370724-4f59c884c4e0?w=800&h=800&fit=crop", path: "public/images/categories/cat-chia-buon.jpg" },
    { url: "https://images.unsplash.com/photo-1602615576820-ea14cf3e476a?w=800&h=800&fit=crop", path: "public/images/categories/cat-gio-hoa.jpg" },
    { url: "https://images.unsplash.com/photo-1530103862676-de3c9a59af57?w=800&h=800&fit=crop", path: "public/images/categories/cat-sinh-nhat.jpg" },
];

async function downloadImage(url, filepath) {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded: ${filepath}`);
                    resolve();
                });
            } else {
                console.error(`Failed to download ${url}: Status Code ${res.statusCode}`);
                res.resume(); // Consumes response data to free up memory
                resolve(); // Resolve anyway to continue
            }
        }).on('error', (err) => {
            console.error(`Error downloading ${url}: ${err.message}`);
            resolve(); // Resolve anyway
        });
    });
}

async function main() {
    console.log('Starting download...');
    for (const img of images) {
        await downloadImage(img.url, img.path);
    }
    console.log('All downloads completed.');
}

main();
