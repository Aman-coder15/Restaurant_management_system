const express = require('express');
const router = express.Router();
const rmsController = require('../controllers/rmsController');
const authMiddleware = require('../middleware/auth'); 

// public routes 
router.post('/admin/login', rmsController.adminLogin);
router.get('/menu', rmsController.getMenu);
router.post('/reserve', rmsController.reserveTable);
router.post('/order', rmsController.placeOrder);
router.get('/admin/reports', rmsController.getReports); // protected route 

module.exports = router;
