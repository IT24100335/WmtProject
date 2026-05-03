import { InventoryItem } from "../models/InventoryItem.js";
import { MenuItem } from "../models/MenuItem.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertInt, assertNumber, assertOptionalString, assertString } from "../utils/validators.js";

export const getPantryItems = asyncHandler(async (_req, res) => {
  const items = await InventoryItem.find().sort({ createdAt: -1 });
  res.json(items);
});

export const createPantryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.create({
    name: assertString(req.body.name, "name", { min: 2, max: 80 }),
    quantity: assertNumber(req.body.quantity, "quantity", { min: 0 }),
    unit: assertString(req.body.unit, "unit", { min: 1, max: 20 }),
    threshold: assertNumber(req.body.threshold, "threshold", { min: 0 })
  });
  res.status(201).json(item);
});

export const updatePantryItem = asyncHandler(async (req, res) => {
  const patch = {};
  if (req.body.name !== undefined) patch.name = assertString(req.body.name, "name", { min: 2, max: 80 });
  if (req.body.quantity !== undefined) patch.quantity = assertNumber(req.body.quantity, "quantity", { min: 0 });
  if (req.body.unit !== undefined) patch.unit = assertString(req.body.unit, "unit", { min: 1, max: 20 });
  if (req.body.threshold !== undefined) patch.threshold = assertNumber(req.body.threshold, "threshold", { min: 0 });

  const item = await InventoryItem.findByIdAndUpdate(req.params.id, patch, { new: true });

  if (!item) {
    return res.status(404).json({ message: "Pantry item not found" });
  }

  res.json(item);
});

export const deletePantryItem = asyncHandler(async (req, res) => {
  await InventoryItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const updateMenuStock = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  item.stock = assertInt(req.query.newStock, "newStock", { min: 0 });
  await item.save();
  res.json(item);
});
