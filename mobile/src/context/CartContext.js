import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState(null);
  const [address, setAddress] = useState("");

  const addItem = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === menuItem._id);
      if (!existing) return [...prev, { ...menuItem, quantity: 1 }];
      return prev.map((item) =>
        item._id === menuItem._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const updateQuantity = (menuItemId, delta) => {
    setItems((prev) =>
      prev
        .map((item) => (item._id === menuItemId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const discount = promo ? (subtotal * Number(promo.discountPercentage || 0)) / 100 : 0;
  const total = subtotal - discount;

  const value = useMemo(
    () => ({
      items,
      promoCode,
      setPromoCode,
      promo,
      setPromo,
      address,
      setAddress,
      subtotal,
      discount,
      total,
      addItem,
      updateQuantity,
      clearCart
    }),
    [address, discount, items, promo, promoCode, subtotal, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
