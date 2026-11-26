import { adminCreateProduct } from "../../../services/apiAdmin"
import { showAlert } from "../../ui/Alert";
export function AddProduct({ onClose }) {
    async function submit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('nameProduct');
        const price = formData.get('price');
        const stock = formData.get('stock');
        const category = formData.get('category');
        const image = formData.get('linkURL');
        const description = formData.get('describe')
        if (name, price, stock, category, description === "") {
            showAlert("Vui lòng nhập đầy đủ thông tin", "error")
            return;
        }
        const orderData = {
            name: name,
            price: price,
            stock: stock,
            category: category,
            image: image,
            description: description
        }
        try {
            const result = await adminCreateProduct(orderData)
            if (result) {
                showAlert(`Thêm sản phẩm thành công`, "success");
            }

        }
        catch (error) {
            showAlert(error.message, "error")
        }
    }
    return (
        <div className="fixed flex inset-0 z-600 items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Thêm sản phẩm</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form className="px-6 py-5 flex flex-col gap-4" onSubmit={submit}>
                    <div class="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Tên sản phẩm <span className="text-red-500">*</span></label>
                        <input type="text" name="nameProduct" placeholder="Ví dụ: Macbook Pro"
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Giá bán (đ) <span className="text-red-500">*</span></label>
                            <input type="number" name="price" placeholder="Ví dụ: 28990000" min="0"
                                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex flex-col gap-1.5 ">
                            <label className="text-sm font-medium text-gray-700">Tồn kho <span className="text-red-500">*</span></label>
                            <input type="number" name="stock" placeholder="Ví dụ: 20" min="0"
                                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Danh mục <span className="text-red-500">*</span></label>
                        <input type="text" name="category" placeholder="Ví dụ: Laptop, Âm thanh..."
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">URL ảnh sản phẩm</label>
                        <input type="url" name="linkURL" placeholder="https://..."
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Mô tả sản phẩm</label>
                        <textarea rows="3" name="describe" placeholder="Mô tả chi tiết sản phẩm..."
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                    </div>
                    <div className="hidden text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2"></div>
                    <div className="flex gap-3 pt-1">
                        <button type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">
                            Hủy
                        </button>
                        <button type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
                            Lưu sản phẩm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}