
import { Link, Outlet } from "react-router-dom"
export function AdminPage() {
    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-x-hidden">
            <div
                className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="text-blue-600 text-base font-extrabold">VMO SHOP</span>
                <div className="w-9"></div>
            </div>
            <aside
                className="fixed lg:static inset-y-0 left-0 -translate-x-full lg:translate-x-0 z-50 w-64 h-full bg-white border-r border-gray-200 flex flex-col justify-between p-4 transition-transform duration-300 shrink-0">
                <div className="flex flex-col">

                    <div className="flex items-center gap-3 mb-6 px-2">

                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-500" fill="none"
                                viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 3l8.25 4.5v9L12 21l-8.25-4.5v-9L12 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V12l8.25-4.5M12 12L3.75 7.5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 5.625L15.75 9.75" />
                            </svg>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-blue-600 text-lg font-extrabold tracking-tight">VMO SHOP</span>
                            <span className="text-black text-xs font-medium">Trang quản trị</span>
                        </div>
                    </div>

                    <div className="px-2 mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">QUẢN LÝ CỬA HÀNG</span>
                    </div>

                    <nav className="flex flex-col gap-1">
                        <Link to="/"
                            className="nav-link group flex items-center gap-3.5 px-3 py-3 rounded-xl text-black hover:bg-blue-50/70 hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6 text-black group-hover:text-blue-600 transition-colors" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                                <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                                <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                                <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                            </svg>
                            <span className="font-medium text-base">Tổng quan</span>
                        </Link>

                        <Link to="/admin/product"
                            className="nav-link group flex items-center gap-3.5 px-3 py-3 rounded-xl text-black hover:bg-blue-50/70 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-50/70 transition-colors">
                            <svg className="w-6 h-6 text-black group-hover:text-blue-600 group-focus:text-blue-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                                </path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            <span className="text-base font-medium">Sản phẩm</span>
                        </Link>

                        <Link to="/admin/order"
                            className="nav-link group flex items-center justify-between px-3 py-3 rounded-xl text-black hover:bg-blue-50/70 hover:text-blue-600 focus:bg-blue-50/70 focus:text-blue-600 transition-colors">
                            <div className="flex items-center gap-3.5">
                                <svg className="w-6 h-6 text-black group-hover:text-blue-600 group-focus:text-blue-600 transition-colors" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                <span className="font-medium text-base">Đơn hàng</span>
                            </div>
                        </Link>


                        <Link to="/admin/client"
                            className="nav-link group flex items-center gap-3.5 px-3 py-3 rounded-xl text-black hover:bg-blue-50/70 hover:text-blue-600 focus:bg-blue-50/70 focus:text-blue-600 transition-colors">
                            <svg className="w-6 h-6 text-black group-hover:text-blue-600 group-focus:text-blue-600 transition-colors" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span className="font-medium text-base">Khách hàng</span>
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                    <Link to="/"
                        className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-black hover:bg-blue-50/70 hover:text-blue-600 transition-colors focus:text-blue-600 focus:bg-blue-50/70 ">
                        <svg className="w-5 h-5 text-black group-hover:text-blue-600 transition-colors group-focus:text-blue-600"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span className="font-medium text-sm">Xem cửa hàng</span>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div
                            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                            AD
                        </div>
                        <div className="flex flex-col gap-0.75">
                            <span className="text-gray-900 font-bold text-sm leading-tight">Admin </span>
                            <span className="text-gray-600 text-xs mt-0.5">Quản trị viên</span>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col pt-20 lg:pt-6 min-w-0">
                <div className="w-full flex flex-col min-h-full">
                    <Outlet/>
                </div>

            </main>
        </div>
    )
}