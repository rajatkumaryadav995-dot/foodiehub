const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    isAvailable: { type: Boolean, default: true },
    prepTime: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
