import { Link } from "react-router-dom";
export function Mockup({ onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-80 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth="1.5" className="w-6 h-6 stroke-blue-500">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-blue-500 text-xs font-semibold">VMO SHOP</p>
                        <p className="text-xl font-bold text-gray-900">Member</p>
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-5">
                    Vui lòng đăng nhập tài khoản member để thanh toán.
                </p>

                <div className="flex gap-3">
                    < Link to="/login" onClick={onClose} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 rounded-lg text-center transition">
                        Đăng nhập
                    </Link>
                    <Link to="/register" onClick={onClose} className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 text-sm font-bold py-2 rounded-lg text-center transition">
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
}

