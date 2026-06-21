const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Starter, Main Course, Dessert
  isAvailable: { type: Boolean, default: true },
  ingredients: [{ item: String, quantityNeeded: Number }]//  auto entry
});

module.exports = mongoose.model('Menu', MenuSchema);
