import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Author } from '../../services/api.js';

export function RequireRole({ children }) {
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        let cancelled = false;

        Author()
            .then(({ user }) => {
                if (!cancelled) {
                    setStatus(user?.role === 'seller' ? 'allowed' : 'forbidden');
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setStatus(error.status === 401 ? 'unauthenticated' : 'error');
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (status === 'checking') return <p>Đang xác minh quyền truy cập...</p>;
    if (status === 'unauthenticated') return <Navigate to="/login" replace />;
    if (status === 'seller') return <Navigate to="/admin" replace />;
    if (status === 'forbidden') return <Navigate to="/" replace />;
    if (status === 'error') return <p>Không thể xác minh tài khoản. Vui lòng thử lại.</p>;

    return children;
}