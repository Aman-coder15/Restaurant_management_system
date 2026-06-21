const Menu = require('../models/Menu');
const Table = require('../models/Table');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Inventory = require('../models/Inventory');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// dummy user database (production me iske liye alag user model banega)
const ADMIN_USER = {
  username: "admin",
  // Password: 'password123' (hashed)
  passwordHash: "$2a$10$7R8uW3Zgq5Y9v2BvJmK2e.3l8w2U1V6kO8X9M1N5Q4P3O2N1M0K0."};

// (Admin Login to get JWT Token)
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === "admin" && password === "password123") {

      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
      return res.status(200).json({ message: "Login successfully ", token });
      
    } else {
      return res.status(401).json({ message: "Incorrect Password/Username)" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 1. (View Menu)
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ isAvailable: true });
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. (Reserve Table & Availability Check)
exports.reserveTable = async (req, res) => {
  const { customerName, tableId, reservationTime, guestsCount } = req.body;
  try {
    // basic input validation
    if (!customerName || !tableId || !reservationTime || !guestsCount) {
      return res.status(400).json({ message: "Please fill the details" });
    }
    const table = await Table.findById(tableId);
    if (!table || table.status !== 'Available') {
      return res.status(400).json({ message: "Table is not available" });
    }

    // create reservation
    const newReservation = new Reservation({ customerName, tableId, reservationTime, guestsCount });
    await newReservation.save();

    // update table status to Reserved
    table.status = 'Reserved';
    await table.save();

    res.status(201).json({ message: "Table successfully booked", newReservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. (Place Order & Auto-Update Inventory)
exports.placeOrder = async (req, res) => {
  const { tableId, items } = req.body; // items: [{ menuItemId, quantity }]
  try {
    if (!tableId || !items || items.length === 0) {
      return res.status(400).json({ message: "Order is incomplete, Table id or items is missing" });
    }

    let totalAmount = 0;

    // indentify stock for every item and deduction
    for (const orderItem of items) {
      if (orderItem.quantity <= 0) {
        return res.status(400).json({ message: "Items (Quantity) must be 1 or more than that" });
      }

      const menuItem = await Menu.findById(orderItem.menuItemId);
      if (!menuItem) return res.status(404).json({ message: "Menu item is not found" });

      totalAmount += menuItem.price * orderItem.quantity;

      // auto entry deduction logic
      for (const ingredient of menuItem.ingredients) {
        const stockItem = await Inventory.findOne({ itemName: ingredient.item });
        const totalNeeded = ingredient.quantityNeeded * orderItem.quantity;

        if (!stockItem || stockItem.stockQuantity < totalNeeded) {
          return res.status(400).json({ message: `Stock not sufficient: ${ingredient.item} is not available` });
        }

        // Only reduce the stock if the validation passes. (Atomic Execution Logic)
        for (const orderItem of items) {
          const menuItem = await Menu.findById(orderItem.menuItemId);
          for (const ingredient of menuItem.ingredients) {
            await Inventory.findOneAndUpdate(
              { itemName: ingredient.item },
              { $inc: { stockQuantity: -(ingredient.quantityNeeded * orderItem.quantity) } }
            );
          }
        }


        // stock deductions
        stockItem.stockQuantity -= totalNeeded;
        await stockItem.save();
      }
    }

    // save orders
    const newOrder = new Order({ tableId, items, totalAmount });
    await newOrder.save();

    // order successfully placed
    await Table.findByIdAndUpdate(tableId, { status: 'Occupied' });

    res.status(201).json({ message: "The order has been successfully placed.", newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. (Reports & Stock Alerts)
exports.getReports = async (req, res) => {
  try {
    //  today's starting and ending time
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // 1. daily sales calculation
    const dailyOrders = await Order.find({ createdAt: { $gte: startOfDay }, status: 'Paid' });
    const totalSales = dailyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 2. low atock alerts
    const lowStockAlerts = await Inventory.find({
      $expr: { $lte: ["$stockQuantity", "$minStockLevel"] }
    });

    res.status(200).json({
      date: startOfDay.toDateString(),
      dailySales: totalSales,
      totalOrdersToday: dailyOrders.length,
      lowStockAlerts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
