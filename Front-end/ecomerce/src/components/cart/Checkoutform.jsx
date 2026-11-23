import { useState } from "react"
import { useCart } from "../../hooks/useCart.js";
import { showAlert } from "../ui/Alert.jsx";
import { createOrder } from "../../services/api.js"
export function Checkoutform({ onClose1 }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const { cart, clearCart, openCart } = useCart()
    async function submit() {
        if (phoneNumber === '' || address === '') {
            showAlert("Vui lòng nhập đầy đủ thông tin", "error")
            return;
        }
        const orderData = {
            shippingAddress: address,
            phone: phoneNumber,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        }
        try {
            const result = await createOrder(orderData);
            showAlert(`Đặt hàng thành công ${result.orderId}`, "success");
            clearCart();
            onClose1();
            openCart(false);
            return;
        }
        catch (error) {
            showAlert(error.messager, "error")
        }
    }
    return (
        <div onClick={onClose1}
            className="fixed inset-0 bg-black/50 z-9999 flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-120 overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none"
                                viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <span className="text-blue-500 text-xs font-bold uppercase">VMO SHOP</span>
                    </div>

                </div>
                <div className="px-6 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900 ">Xác nhận thông tin giao hàng</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Cho chúng tôi biết số điện thoại và địa chỉ để đơn hàng được giao đến bạn chính xác.
                    </p>
                    <p className="text-red-500 text-xs mt-1 font-medium">* Thông tin bắt buộc</p>
                </div>
                <div className="border-t border-gray-100 mx-6 my-3"></div>
                <div className="px-6 pb-4 space-y-5 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label className="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
                            {/* Icon Điện thoại dạng SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4 text-blue-500"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>

                            <span>
                                Số điện thoại <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            value={phoneNumber}
                            type="tel"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Nhập số điện thoại nhận hàng"
                            maxLength="11"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path fillRule="evenodd"
                                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-2.078 3.509-4.793 3.509-8.327a8.25 8.25 0 0 0-16.5 0c0 3.534 1.565 6.249 3.508 8.327a19.58 19.58 0 0 0 2.684 2.282 16.975 16.975 0 0 0 1.144.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                    clipule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-800">Địa chỉ giao hàng</span>
                        </div>
                        <div>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                placeholder="Nhập số nhà, tên đường"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                            ></textarea>
                            <p className="text-black font-medium text-xs mt-1">Ví dụ: 18 IDMC, Tôn Thất Thuyết, Cầu Giấy, Hà Nội</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                        <p className="text-blue-700 text-xs leading-relaxed">
                            Thông tin của bạn được bảo mật và chỉ sử dụng để liên hệ, giao nhận đơn hàng.
                        </p>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose1}
                        className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm
                           hover:bg-gray-50 transition">
                        Hủy
                    </button>
                    <button
                        onClick={submit}
                        className="flex-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl text-sm transition"
                        style={{ flex: 2 }}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    )
}