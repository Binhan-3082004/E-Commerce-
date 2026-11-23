import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import { useDebounce } from './useDebounce.js';

export function useProducts(searchQuery, category, sort) {
    const [products, setProducts] = useState([]);     // toàn bộ sản phẩm từ API
    const [loading, setLoading] = useState(true);     // đang tải không
    const [error, setError] = useState(null);         // lỗi nếu có
    const [categories, setCategories] = useState([]); // danh sách danh mục


    const debouncedQuery = useDebounce(searchQuery, 500);
    const debouncedCategory = useDebounce(category, 500);
    const debouncedSort = useDebounce(sort, 500);

    
    useEffect(() => {
        const controller = new AbortController();

        async function fetchProducts() {
            try {
                setLoading(true);
                const data = await getProducts({
                    search: debouncedQuery,
                    category: debouncedCategory,
                    sort: debouncedSort,
                });
                setProducts(data.products);
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false); // tắt loading ngay khi xong, không delay giả
            }
        }

        fetchProducts();

        return () => controller.abort();
    }, [debouncedQuery, debouncedCategory, debouncedSort]);

    // Fetch danh mục (chỉ chạy 1 lần khi mount)
    useEffect(() => {
        let cancelled = false;

        async function fetchCategories() {
            try {
                const data = await getCategories();
                if (!data.success || !Array.isArray(data.categories)) {
                    throw new Error('Dữ liệu danh mục không hợp lệ');
                }
                if (!cancelled) {
                    setCategories(data.categories);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            }
        }

        fetchCategories();

        return () => { cancelled = true; };
    }, []);

    // isDebouncing: true khi user vừa thay đổi filter nhưng debounce chưa kích hoạt
    const isDebouncing =
        searchQuery !== debouncedQuery ||
        category !== debouncedCategory ||
        sort !== debouncedSort;

    return { products, loading: loading || isDebouncing, error, categories };
}
