
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js'
import { useState } from 'react'

import { Link } from 'react-router-dom';
export function Header({ onSearch, onAccountClick, openForm }) {
  const { openCart, cart } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="sticky top-0 z-100 bg-blue-600 text-white p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
      <h1 className="text-2xl font-bold">VMO Shop</h1>
      <div className="relative w-full flex justify-between md:w-1/3 order-last md:order-0">
        <input type="text" placeholder="Tìm kiếm sản phẩm..."
          className="bg-white w-full px-4 py-2 pl-10 rounded text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => onSearch(e.target.value)} />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
            stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-4 relative ">
        {/* Chưa đăng nhập  */}
        {!isAuthenticated && (
          <a onClick={onAccountClick} className="mr-10 font-bold cursor-pointer hover:underline">
            Tài khoản
          </a>
        )}
        {/* Đã đăng nhập */}
        {isAuthenticated && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 hover:bg-white/20 transition px-3 py-1.5 rounded-lg font-semibold text-white">
              <span >{user.name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`${menuOpen ? 'block' : 'hidden'} absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden min-w-62.5`}
            >
              {/* Thông tin user  */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center gap-2.5 mt-1.5">
                  <i className="fa-regular fa-envelope text-gray-400 text-xs w-4 text-center"></i>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <i className="fa-solid fa-user-tag text-blue-500 text-xs w-4 text-center"></i>
                  <p className="text-xs font-semibold text-blue-600">{user.role}</p>
                </div>
              </div>

              {/* Menu items  */}
              <div className="px-2 py-2 flex flex-col gap-1">
                {/* Lịch sử đơn hàng  */}
                <div onClick={openForm} className="flex items-center gap-2.5 px-3 py-2">
                  <i className="fa-solid fa-receipt text-blue-500 text-xs w-4 text-center"></i>
                  <a
                    className="cursor-pointer text-sm font-semibold text-indigo-600 hover:bg-indigo-50">Lịch sử đơn hàng</a>
                </div>
                {user.role === 'seller' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50 font-semibold transition"
                  >
                    <svg className="w-4 h-4 -shrink-0" fill="none" stroke="currentColor" strokeWidth="2"
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Trang Quản Trị
                  </Link>
                )}

                {/* Đăng xuất  */}
                <button onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="flex items-center gap-4 relative ">
          <button onClick={() => openCart(true)} className="bg-white text-blue-600 px-2 py-2 rounded font-bold whitespace-nowrap">
            Giỏ hàng (<span>{cart.length}</span>)
          </button>
        </div>
      </div>
    </header >
  )
}