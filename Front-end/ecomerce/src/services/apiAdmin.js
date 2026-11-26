import { BASE_URL, authHeader } from '../services/api.js'
export async function adminGetOrders() {
    const res = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: { ...authHeader() }
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Lỗi tải danh sách đơn hàng');
    }
    return res.json();
}
export async function adminCreateProduct(productData) {
    const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(productData)
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Lỗi thêm sản phẩm');
    }
    return res.json();
}
export async function adminUpdateProduct(id, productData) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(productData)
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Lỗi cập nhật sản phẩm');
    }
    return res.json();
}
export async function adminDeleteProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            ...authHeader()
        }
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Lỗi xóa sản phẩm');
    }
    return res.json();
}

