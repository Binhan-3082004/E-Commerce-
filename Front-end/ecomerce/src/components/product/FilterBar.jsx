
export function FilterBar({ categories, category, sort, onCategory, onSort }) {
    return (
        <div className='flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white p-4 rounded shadow'>
            <label htmlFor="category-select" className="font-bold">Danh mục:</label>
            <select
                id="category-select"
                className="border px-2 py-1 rounded ml-2"
                value={category}
                onChange={(e) => onCategory(e.target.value)}
            >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <label htmlFor="arrange-select" className="font-bold">Sắp xếp:</label>
            <select
                id="arrange-select"
                className="border px-2 py-1 rounded ml-2"
                value={sort} 
                onChange={(e) => onSort(e.target.value)}
            >
                <option value="">Mặc định</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
            </select>
        </div>
    );
}
