const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1, max: 99 }
      }
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Placed', 'Preparing', 'Ready'],
      default: 'Placed'
    },
    estimatedTime: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
