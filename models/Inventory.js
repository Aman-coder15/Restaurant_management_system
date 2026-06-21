const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  stockQuantity: { type: Number, required: true },
  unit: { type: String, required: true }, // kg, ltr, pcs
  minStockLevel: { type: Number, required: true } // stock for emergency
});

module.exports = mongoose.model('Inventory', InventorySchema);
