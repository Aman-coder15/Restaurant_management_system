const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const Table = require('./models/Table');
const Inventory = require('./models/Inventory');

// डेटाबेस कनेक्शन
mongoose.connect('mongodb://localhost:27017/restaurant_db')
  .then(() => console.log('MongoDB Connected for Rich Seeding...'))
  .catch(err => console.log(err));

const seedData = async () => {
  try {
    // 1. पुराना डेटा साफ़ करें
    await Menu.deleteMany();
    await Table.deleteMany();
    await Inventory.deleteMany();
    console.log('🧹 Old data cleared.');

    // 2. बेहतरीन इन्वेंट्री (Raw Materials) स्टॉक जोड़ें
    const inventoryItems = await Inventory.insertMany([
      { itemName: 'Cheese', stockQuantity: 25, unit: 'kg', minStockLevel: 5 },
      { itemName: 'Flour', stockQuantity: 60, unit: 'kg', minStockLevel: 10 },
      { itemName: 'Tomato Sauce', stockQuantity: 20, unit: 'ltr', minStockLevel: 4 },
      { itemName: 'Chicken Patty', stockQuantity: 40, unit: 'pcs', minStockLevel: 8 },
      { itemName: 'Burger Buns', stockQuantity: 50, unit: 'pcs', minStockLevel: 10 },
      { itemName: 'Paneer', stockQuantity: 15, unit: 'kg', minStockLevel: 3 },
      { itemName: 'Vegetables', stockQuantity: 30, unit: 'kg', minStockLevel: 5 }
    ]);
    console.log('📦 Rich Inventory Stock Added.');

    // 3. वैरायटी के साथ शानदार मेन्यू आइटम्स जोड़ें
    await Menu.insertMany([
      {
        name: 'Margherita Pizza',
        price: 249,
        category: 'Main Course',
        isAvailable: true,
        ingredients: [
          { item: 'Flour', quantityNeeded: 0.2 },
          { item: 'Cheese', quantityNeeded: 0.15 },
          { item: 'Tomato Sauce', quantityNeeded: 0.1 }
        ]
      },
      {
        name: 'Crispy Chicken Burger',
        price: 179,
        category: 'Main Course',
        isAvailable: true,
        ingredients: [
          { item: 'Burger Buns', quantityNeeded: 1 },
          { item: 'Chicken Patty', quantityNeeded: 1 },
          { item: 'Vegetables', quantityNeeded: 0.05 },
          { item: 'Cheese', quantityNeeded: 0.02 }
        ]
      },
      {
        name: 'Paneer Tikka Starter',
        price: 199,
        category: 'Starter',
        isAvailable: true,
        ingredients: [
          { item: 'Paneer', quantityNeeded: 0.25 },
          { item: 'Vegetables', quantityNeeded: 0.1 }
        ]
      },
      {
        name: 'Cheese Garlic Bread',
        price: 129,
        category: 'Starter',
        isAvailable: true,
        ingredients: [
          { item: 'Flour', quantityNeeded: 0.1 },
          { item: 'Cheese', quantityNeeded: 0.08 }
        ]
      }
    ]);
    console.log('🍕 Expanded Menu Items Added.');

    // 4. अलग-अलग कैपेसिटी की टेबल्स जोड़ें
    await Table.insertMany([
      { tableNumber: 1, capacity: 2, status: 'Available' },
      { tableNumber: 2, capacity: 2, status: 'Available' },
      { tableNumber: 3, capacity: 4, status: 'Available' },
      { tableNumber: 4, capacity: 4, status: 'Available' },
      { tableNumber: 5, capacity: 6, status: 'Available' },
      { tableNumber: 6, capacity: 8, status: 'Available' }
    ]);
    console.log('🪑 Multi-capacity Tables Added.');

    console.log('🎉 Data Seeding Successfully Completed with Rich Dataset!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
