export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({ message: error.message || "Validation error" });
  }

  res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
}
