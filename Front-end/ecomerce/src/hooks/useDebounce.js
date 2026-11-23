import { useState, useEffect } from 'react';

/**
 * Trả về giá trị bị "delay" sau mỗi lần value thay đổi.
 * Dùng để tránh gọi API liên tục khi user đang gõ.
 *
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian delay (ms), mặc định 500ms
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: hủy timer nếu value thay đổi trước khi hết delay
        return () => clearTimeout(timerId);
    }, [value, delay]);

    return debouncedValue;
}
