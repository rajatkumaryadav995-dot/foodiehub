const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly, studentOnly } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', protect, studentOnly, createOrder);
router.get('/my', protect, studentOnly, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
