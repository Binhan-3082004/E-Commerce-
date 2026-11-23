
import { useState, createContext, useEffect } from 'react';
import { login as loginApi, Author } from '../services/api.js'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("Token")
        return {
            user: null,
            token: token,
        };
    })
    // Nếu có token mới cần loading, không có token thì false luôn
    const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem("Token")))

    useEffect(() => {
        const token = localStorage.getItem("Token")

        if (!token) return   // isLoading đã là false từ đầu, không cần set gì

        Author()
            .then(({ user }) => {
                setAuth({ user: user, token: token })
            })
            .catch(() => {
                localStorage.removeItem('Token')
                setAuth({ user: null, token: null })
            })
            .finally(() => {
                setIsLoading(false)   // chỉ gọi setState trong callback → đúng rule
            })
    }, [])

    async function loginSuccess(email, password, role) {
        const res = await loginApi(email, password, role);
        if (res.success) {
            localStorage.setItem('Token', res.token);
            setAuth({ user: res.user, token: res.token });
            return { user: res.user, token: res.token, role: res.user.role }
        }
        return;
    }

    function logout() {
        localStorage.removeItem('Token');
        setAuth({ user: null, token: null });
    }

    const isAuthenticated = Boolean(auth.user && auth.token);

    return (
        <AuthContext.Provider value={{
            user: auth.user, token: auth.token,
            loginSuccess, logout, isAuthenticated, isLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}