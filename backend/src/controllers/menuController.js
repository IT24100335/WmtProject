import path from "path";
import { MenuItem } from "../models/MenuItem.js";
import {
  createMenuItem,
  getAllMenuItems as getAllMenuItemsFromService,
  getRecommendedMenuItems as getRecommendedMenuItemsFromService,
  updateMenuItem
} from "../services/menuService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertInt, assertNumber, assertOptionalString, assertString } from "../utils/validators.js";

export const getAllMenuItems = asyncHandler(async (_req, res) => {
  const items = await getAllMenuItemsFromService();
  res.json(items);
});

export const getRecommendedMenuItems = asyncHandler(async (_req, res) => {
  const items = await getRecommendedMenuItemsFromService();
  res.json(items);
});

export const saveMenuItem = asyncHandler(async (req, res) => {
  const { id, name, price, category, description, stock, available, imageUrl } = req.body;

  const payload = {
    name: assertString(name, "name", { min: 2, max: 120 }),
    price: assertNumber(price, "price", { min: 0 }),
    category: assertString(category, "category", { min: 2, max: 40 }),
    description: assertOptionalString(description, "description", { max: 500 }),
    stock: assertInt(stock ?? 0, "stock", { min: 0 }),
    available: available === "false" ? false : Boolean(available),
    imageUrl: imageUrl ? String(imageUrl) : ""
  };

  if (req.file) {
    payload.imageUrl = `/uploads/menu/${path.basename(req.file.path)}`;
  }

  const item = id ? await updateMenuItem(id, payload) : await createMenuItem(payload);

  res.status(id ? 200 : 201).json(item);
});

export const toggleAvailability = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  item.available = !item.available;
  await item.save();
  res.json(item);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
