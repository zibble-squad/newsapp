const express = require('express');
const router = express.Router();
const { addCategory, getAllCategory, editCategory, deleteCategory } = require('../controllers/categoryController');
const protect = require('../middlewares/authMiddleware')
router.route('/add-category').post(addCategory);
router.route('/get-all-category').get(getAllCategory);
router.route('/edit-category').put(editCategory);
router.route('/delete-category').delete(deleteCategory);
module.exports = router