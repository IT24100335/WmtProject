import { MenuItem } from "../models/MenuItem.js";

export function getAllMenuItems() {
  return MenuItem.find().sort({ createdAt: -1 });
}

export function getRecommendedMenuItems() {
  return MenuItem.find({ available: true }).sort({ rating: -1, createdAt: -1 }).limit(6);
}

export function createMenuItem(payload) {
  return MenuItem.create(payload);
}

export function updateMenuItem(id, payload) {
  return MenuItem.findByIdAndUpdate(id, payload, { new: true });
}

