import { useState, useEffect, createContext } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, SetCart] = useState(() => {
    const save = localStorage.getItem('cart');
    return save ? JSON.parse(save) : [];
  });
  const [closeCart, openCart] = useState(false);
  // Cập nhật trạng thái mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart]);
  // Thêm sản phẩm vào giỏ
  const AddToCard = (product) => {
    SetCart(prevCart => {
      // Tìm sản phẩm trong giỏ hàng 
      const findProduct = prevCart.find(item => item.id === product.id)
      if (findProduct) {
        // increase, but not exceed<vượt quá> the stock
        if (findProduct.quantity >= product.stock) {

          return prevCart;
        }
        return prevCart.map(item => item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    })
  }
  // remove product in cart
  const removeProduct = (productId) => {
    SetCart(prevCart => prevCart.filter(item => item.id !== productId))
  };
  // update quanty
  const updateQuanty = (productId, newQuanty, stock) => {
    if (newQuanty < 1) {
      removeProduct(productId);
      return;
    }
    if (newQuanty > stock) {
      return;
    }
    SetCart(prevCart => prevCart.map(item => item.id === productId
      ? { ...item, quantity: newQuanty }
      : item
    ))
  }
  // Delete All cart
  const clearCart = () => SetCart([])
  // Total amount
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <CartContext.Provider value={{
      cart,
      closeCart, openCart,
      AddToCard,
      removeProduct,
      updateQuanty,
      clearCart,
      totalPrice

    }}>
      {children}
    </CartContext.Provider>
  );
}

