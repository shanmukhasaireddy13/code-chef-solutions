// In production, use relative URLs (proxied by Next.js rewrites)
// In development, use the backend URL directly
export const API_BASE_URL =
    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? '' // Use relative URLs in production (same-origin via Next.js proxy)
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const runtime = "nodejs";

export async function safeFetch(url: string, options: any = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: "include",
    });

    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        console.log("Raw response:", text);
        throw new Error("Invalid JSON from server");
    }
}

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        GOOGLE: `${API_BASE_URL}/auth/google`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
    },
    USER: {
        ME: `${API_BASE_URL}/api/user/me`,
        PROFILE: `${API_BASE_URL}/api/user/profile`,
        TRANSACTIONS: `${API_BASE_URL}/api/user/transactions`,
        PASSWORD: `${API_BASE_URL}/api/user/password`,
        TOUR_STATUS: `${API_BASE_URL}/api/user/tour-status`,
    },
    REFERRAL: {
        STATS: `${API_BASE_URL}/api/referral/stats`,
    },
    ADMIN: {
        OFFERS: `${API_BASE_URL}/api/admin/offers`,
        OFFERS_TOGGLE: (id: string) => `${API_BASE_URL}/api/admin/offers/${id}/toggle`,
        OFFERS_DELETE: (id: string) => `${API_BASE_URL}/api/admin/offers/${id}`,
        ORDERS: `${API_BASE_URL}/api/admin/orders`,
        VERIFY_ORDER: `${API_BASE_URL}/api/admin/verify-order`,
        ANALYTICS: `${API_BASE_URL}/api/admin/analytics`,
        SUPPORT: `${API_BASE_URL}/api/admin/support`,
        SUPPORT_REPLY: (id: string) => `${API_BASE_URL}/api/admin/support/${id}`,
    },
    OFFERS: {
        ACTIVE: `${API_BASE_URL}/api/offers/active`,
        VALIDATE: `${API_BASE_URL}/api/offers/validate`,
    },
    SOLUTIONS: {
        BASE: `${API_BASE_URL}/api/solutions`,
        BUY_CART: `${API_BASE_URL}/api/solutions/buy-cart`,
        FULL: (id: string) => `${API_BASE_URL}/api/solutions/${id}/full`,
    },
    PAYMENT: {
        CREATE_ORDER: `${API_BASE_URL}/api/payment/create-order`,
    },
    CONTESTS: `${API_BASE_URL}/api/contests`,
    CONTEST_PROBLEMS: (id: string) => `${API_BASE_URL}/api/contests/${id}/problems`,
    SUPPORT: `${API_BASE_URL}/api/support`,
    HEALTH: `${API_BASE_URL}/health`,
};

export const NEXT_API_ROUTES = {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
};
