import { Feedback } from "../models/Feedback.js";
import { MenuItem } from "../models/MenuItem.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertNumber, assertOptionalString, assertString } from "../utils/validators.js";

async function refreshMenuItemRating(menuItemId) {
  const feedbacks = await Feedback.find({ menuItemId });
  const average =
    feedbacks.length === 0
      ? 0
      : feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length;

  await MenuItem.findByIdAndUpdate(menuItemId, { rating: Number(average.toFixed(1)) });
}

export const submitFeedback = asyncHandler(async (req, res) => {
  const menuItemId = assertString(req.body.menuItemId, "menuItemId", { min: 10, max: 60 });
  const rating = assertNumber(req.body.rating, "rating", { min: 1, max: 5 });
  const comment = assertOptionalString(req.body.comment, "comment", { max: 300 });

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  const feedback = await Feedback.create({
    menuItemId,
    userId: req.user?._id || null,
    rating,
    comment
  });

  await refreshMenuItemRating(menuItemId);
  res.status(201).json(feedback);
});

export const getAllFeedback = asyncHandler(async (_req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

export const getMenuFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ menuItemId: req.params.menuItemId }).sort({ createdAt: -1 });
  res.json(feedbacks);
});

export const getMyFeedback = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const feedbacks = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate("menuItemId", "name");
  res.json(feedbacks);
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);

  if (feedback) {
    await refreshMenuItemRating(feedback.menuItemId);
  }

  res.status(204).send();
});
