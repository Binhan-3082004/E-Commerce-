export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'


export function authHeader() {
    const token = localStorage.getItem('Token');
    if (token !== null && token != undefined && token !== "") {
        return {
            'Authorization': 'Bearer ' + token
        };
    }
    else {
        return {};
    }
}
export async function getProducts({ search = '', category = '', sort = '' } = {}) {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);

    const query = params.toString();
    const url = query
        ? `${BASE_URL}/products?${query}`
        : `${BASE_URL}/products`;

    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error('Lỗi tải sản phẩm');
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);

    if (!response.ok) {
        const error = new Error('Lỗi tải danh mục');
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export async function login(email, password, role) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.message || "Lỗi đăng nhập");
        err.status = res.status;
        throw err;
    }
    return res.json();
}


export async function register(name, email, password, role) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });
    if (!res.ok) {
        const data = await res.json();
        const err = new Error(data.message);
        err.status = res.status;
        throw err;
    }
    return res.json();

}

export async function createOrder(orderData) {
    const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(orderData)
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.message || "Lỗi đặt hàng");
        err.status = res.status;
        throw err;
    }
    return res.json();
}

export async function getMyOrders() {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
            ...authHeader()
        }
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.message || "Lỗi hiển thị đơn hàng");
        err.status = res.status;
        throw err;
    }
    return res.json();
}

export async function Author() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { ...authHeader() }
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const error = new Error(data.message || 'Lỗi xác thực');
        error.status = res.status;
        throw error;
    }
    return res.json();
}