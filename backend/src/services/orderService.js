import { MenuItem } from "../models/MenuItem.js";
import { Order } from "../models/Order.js";
import { Promotion } from "../models/Promotion.js";
import { toCurrencyNumber } from "../utils/helpers.js";

const generateOrderNumber = () => `ORD-${Date.now().toString().slice(-6)}`;

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}

export async function buildOrder(payload) {
  const menuItems = await MenuItem.find({
    _id: { $in: payload.items.map((item) => item.menuItemId) }
  });

  const menuMap = new Map(menuItems.map((item) => [String(item._id), item]));
  const normalizedItems = payload.items.map((item) => {
    const menuItem = menuMap.get(String(item.menuItemId));

    if (!menuItem) {
      badRequest(`Menu item ${item.menuItemId} not found`);
    }

    if (!menuItem.available) {
      badRequest(`${menuItem.name} is currently unavailable`);
    }

    if (menuItem.stock < Number(item.quantity)) {
      badRequest(`Only ${menuItem.stock} portions left for ${menuItem.name}`);
    }

    return {
      menuItemId: menuItem._id,
      menuItemName: menuItem.name,
      quantity: Number(item.quantity),
      priceAtOrderTime: menuItem.price
    };
  });

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtOrderTime,
    0
  );

  let discountAmount = 0;

  if (payload.promoCode) {
    const promotion = await Promotion.findOne({
      promoCode: payload.promoCode.toUpperCase(),
      active: true
    });

    if (promotion && new Date(promotion.expiryDate) >= new Date()) {
      discountAmount = subtotal * (promotion.discountPercentage / 100);
    }
  }

  return {
    orderNumber: generateOrderNumber(),
    userId: payload.userId,
    deliveryAddress: payload.deliveryAddress || "",
    items: normalizedItems,
    subtotal: toCurrencyNumber(subtotal),
    discountAmount: toCurrencyNumber(discountAmount),
    totalAmount: toCurrencyNumber(subtotal - discountAmount),
    status: "Pending"
  };
}

export async function createOrder(payload) {
  const orderData = await buildOrder(payload);
  const order = await Order.create(orderData);

  await Promise.all(
    orderData.items.map((item) =>
      MenuItem.findByIdAndUpdate(item.menuItemId, {
        $inc: { stock: -item.quantity }
      })
    )
  );

  return order;
}
