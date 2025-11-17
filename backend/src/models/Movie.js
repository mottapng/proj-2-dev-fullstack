const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    director: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

movieSchema.index({
  title: "text",
  director: "text",
  genre: "text",
  description: "text",
});

module.exports = mongoose.model("Movie", movieSchema);
