export function emptyUserForm() {
  return { _id: "", username: "", email: "", password: "", role: "CUSTOMER" };
}

export function emptyMenuForm() {
  return {
    id: "",
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    available: true
  };
}

export function emptyPromoForm() {
  return {
    _id: "",
    name: "",
    promoCode: "",
    discountPercentage: "10",
    expiryDate: "",
    active: true
  };
}

export function emptyPantryForm() {
  return { _id: "", name: "", quantity: "", unit: "", threshold: "" };
}
