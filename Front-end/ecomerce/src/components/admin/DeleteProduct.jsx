import { adminDeleteProduct } from "../../services/apiAdmin"
import { showAlert } from "../ui/Alert";
export function DeleteProduct({ product, onClose }) {
    async function submit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const id = formData.get('id');
        try {
            const result = await adminDeleteProduct(id)
            if (result) {
                showAlert(`Xóa sản phẩm thành công`, "success");
                setTimeout(() => {
                    window.location.reload()
                    onClose()
                }, 1000);
            }
        }
        catch (error) {
            showAlert(error.message, "error")
        }
    }
    return (
        <div className="fixed flex inset-0 z-600 items-center justify-center bg-black/40 backdrop-blur-sm">
            <form className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onSubmit={submit}>
                <input name="id" type="hidden" defaultValue={product?.id} />
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Xóa sản phẩm?</h3>
                    <p className="text-sm text-black">"{product?.name}"</p>
                    <p className="text-xs text-gray-400">Hành động này không thể hoàn tác.</p>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={onClose}
                        className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50">
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm">
                        Xóa
                    </button>
                </div>
            </form>
        </div >
    )
}