const fs = require('fs/promises');
const path = require('path');
const MenuItem = require('../models/MenuItem');

const removeUploadedImage = async (image) => {
  if (!image?.startsWith('/uploads/')) return;
  const relativePath = image.slice(1);
  if (path.dirname(relativePath) !== 'uploads') return;
  const imagePath = path.join(__dirname, '..', 'uploads', path.basename(relativePath));
  await fs.unlink(imagePath).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
};

const getMenu = async (req, res, next) => {
  try {
    const menu = await MenuItem.find().sort({ category: 1, name: 1 });
    return res.json(menu);
  } catch (error) {
    return next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image || ''
    });
    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });

    const previousImage = item.image;
    const fields = ['name', 'price', 'category', 'isAvailable', 'prepTime', 'image'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });
    if (req.file) item.image = `/uploads/${req.file.filename}`;
    await item.save();
    if (req.file && previousImage !== item.image) await removeUploadedImage(previousImage);
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    await item.deleteOne();
    await removeUploadedImage(item.image);
    return res.json({ message: 'Menu item deleted.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMenu, createMenuItem, updateMenuItem, deleteMenuItem };
