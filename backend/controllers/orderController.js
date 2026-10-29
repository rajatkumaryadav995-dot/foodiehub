const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const calcEstimatedTime = require('../utils/calcEstimatedTime');

const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Add at least one item to your order.' });
    }

    const quantities = new Map();
    for (const item of items) {
      const id = item.menuItem || item.menuItemId || item._id;
      const qty = Number(item.qty);
      if (!id || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return res.status(400).json({ message: 'Each order item must have a valid item and quantity.' });
      }
      quantities.set(String(id), (quantities.get(String(id)) || 0) + qty);
      if (quantities.get(String(id)) > 99) {
        return res.status(400).json({ message: 'A maximum of 99 of each menu item can be ordered.' });
      }
    }

    const menuItems = await MenuItem.find({
      _id: { $in: Array.from(quantities.keys()) },
      isAvailable: true
    });
    if (menuItems.length !== quantities.size) {
      return res.status(400).json({ message: 'One or more selected items are unavailable. Refresh the menu and try again.' });
    }

    const orderItems = menuItems.map((menuItem) => ({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      qty: quantities.get(String(menuItem._id))
    }));
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.qty, 0);
    const estimatedTime = calcEstimatedTime(
      menuItems.map((item) => ({ prepTime: item.prepTime, qty: quantities.get(String(item._id)) }))
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      estimatedTime
    });
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const transitions = { Placed: 'Preparing', Preparing: 'Ready' };
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (transitions[order.status] !== req.body.status) {
      return res.status(400).json({ message: 'Orders can only move from Placed to Preparing to Ready.' });
    }
    order.status = req.body.status;
    await order.save();
    await order.populate('user', 'name email');
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
