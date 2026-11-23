import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/api.js';

export function useMyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchOrders() {
            try {
                setLoading(true);
                const data = await getMyOrders();

                if (!cancelled) {
                    setOrders(data.orders);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchOrders();

        return () => {
            cancelled = true;
        };
    }, []);

    return { orders, loading, error };
}