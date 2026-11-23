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