export interface ProductType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    meaning: string | null;
    basePrice: number;
    salePrice: number | null;
    categoryId: string;
    occasion: string[];
    colors: string[];
    inStock: boolean;
    featured: boolean;
    bestseller: boolean;
    viewCount: number;
    soldCount: number;
    createdAt: string;
    updatedAt: string;
    category: CategoryType;
    images: ProductImageType[];
    variants: ProductVariantType[];
    reviews?: ReviewType[];
}

export interface CategoryType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    sortOrder: number;
    _count?: {
        products: number;
    };
}

export interface ProductImageType {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
}

export interface ProductVariantType {
    id: string;
    name: string;
    price: number;
    sortOrder: number;
}

export interface ReviewType {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

export interface OrderType {
    id: string;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    recipientName: string;
    recipientPhone: string;
    deliveryAddress: string;
    deliveryDate: string | null;
    deliveryTime: string | null;
    giftMessage: string | null;
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    notes: string | null;
    createdAt: string;
    items: OrderItemType[];
}

export interface OrderItemType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    variantId: string | null;
}

export interface AddressType {
    id: string;
    name: string;
    phone: string;
    address: string;
    ward: string | null;
    district: string | null;
    city: string;
    isDefault: boolean;
}
