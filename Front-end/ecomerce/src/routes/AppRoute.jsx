import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { HomePage } from '../pages/HomePage.jsx';
import { AdminPage } from '../pages/AdminPage.jsx';
import { ProductPage } from '../components/admin/ProductPage/ProductPage.jsx'
import { OrderPage } from '../components/admin/OrderPage.jsx'
import { RequireRole } from '../components/admin/RequireRole.jsx';
import { DetailOrder } from '../components/admin/DetailOrder.jsx'
export function AppRoutes({ searchQuery }) {
    return (
        <Routes>
            <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />


            {/* <Route path="/admin" element={<RequireRole><AdminPage /></RequireRole>} /> */}
            <Route path="/admin" element={<RequireRole><AdminPage /></RequireRole>}>
                <Route path="product" element={<ProductPage />} />
                <Route path="order" element={<OrderPage />} />
                <Route path="order/:id" element={<DetailOrder />} />
                <Route patth="client" />
            </Route>
        </Routes>


    );
}