import { Promotion } from "../models/Promotion.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assertEnum,
  assertNumber,
  assertOptionalString,
  assertString,
  assertValidDateString
} from "../utils/validators.js";

export const getAllPromotions = asyncHandler(async (_req, res) => {
  const promotions = await Promotion.find().sort({ createdAt: -1 });
  res.json(promotions);
});

export const createPromotion = asyncHandler(async (req, res) => {
  const name = assertString(req.body.name, "name", { min: 2, max: 80 });
  const promoCode = assertString(req.body.promoCode, "promoCode", { min: 2, max: 20 }).toUpperCase();
  const discountPercentage = assertNumber(req.body.discountPercentage, "discountPercentage", {
    min: 0,
    max: 100
  });
  const expiryDate = assertValidDateString(req.body.expiryDate, "expiryDate");
  const active = req.body.active === undefined ? true : Boolean(req.body.active);

  const promotion = await Promotion.create({
    name,
    promoCode,
    discountPercentage,
    expiryDate,
    active
  });

  res.status(201).json(promotion);
});

export const updatePromotion = asyncHandler(async (req, res) => {
  const patch = {};
  if (req.body.name !== undefined) patch.name = assertString(req.body.name, "name", { min: 2, max: 80 });
  if (req.body.promoCode !== undefined)
    patch.promoCode = assertString(req.body.promoCode, "promoCode", { min: 2, max: 20 }).toUpperCase();
  if (req.body.discountPercentage !== undefined)
    patch.discountPercentage = assertNumber(req.body.discountPercentage, "discountPercentage", {
      min: 0,
      max: 100
    });
  if (req.body.expiryDate !== undefined) patch.expiryDate = assertValidDateString(req.body.expiryDate, "expiryDate");
  if (req.body.active !== undefined) patch.active = Boolean(req.body.active);

  const promotion = await Promotion.findByIdAndUpdate(
    req.params.id,
    patch,
    { new: true }
  );

  if (!promotion) {
    return res.status(404).json({ message: "Promotion not found" });
  }

  res.json(promotion);
});

export const validatePromotion = asyncHandler(async (req, res) => {
  const promoCode = assertString(req.params.code, "promoCode", { min: 2, max: 20 }).toUpperCase();
  const promotion = await Promotion.findOne({ promoCode, active: true });

  if (!promotion) {
    return res.status(400).json({ message: "Invalid promo code" });
  }

  if (new Date(promotion.expiryDate) < new Date()) {
    return res.status(400).json({ message: "Promo code expired" });
  }

  res.json(promotion);
});

export const deletePromotion = asyncHandler(async (req, res) => {
  await Promotion.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
