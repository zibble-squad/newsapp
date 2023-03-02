const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

// @desc    Add Catgory
// @route   POST /api/users/create-category
// @access  Public 
const addCategory = asyncHandler(async (req, res) => {
    try {
        const { category_name } = req.body
        const category = await Category.findOne({ category_name: category_name })
        if (category) {
            return res.status(401).json({
                success: false,
                msg: 'Category already exists',
                error: "no error"
            });
        }
        if (category_name === "" || category_name === undefined || category_name === null) {
            return res.status(401).json({
                success: false,
                msg: `Category Name Must be Required ! ${category_name}`,
                error: "Category Name Must be Required "
            });
        } else {
            const new_category = await Category.create({ category_name })
            return res.status(201).json({
                success: true,
                msg: 'Category Created',
                data: new_category
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal error occured.',
            error: err
        });
    }
})
// @desc    Get All Catgory
// @route   POST /api/users/get-all-category
// @access  Public 
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        if (categories.length === 0) {
            res.status(200).json({
                success: false,
                msg: 'Categories Not Found, Please Create A Category First',
                data: [],
                error: "categories Not Found"
            });
        } else {
            res.status(200).json({
                success: true,
                msg: 'Categories Found Successfully...',
                data: categories,
                error: "no error"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal error occured.',
            error: err
        });
    }
})
// @desc    Update Catgory
// @route   POST /api/users/create-category
// @access  Public 
const editCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.query.id, req.body, {
            new: true,
            runValidators: true
        })
        if (category) {
            res.status(201).json({
                success: true,
                msg: 'Successfully Updated',
                data: category,
                error: "no error"
            });
        } else {
            res.status(401).json({
                success: false,
                msg: 'Category not found',
                error: "Category not found"
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error',
            error: err
        });
    }
})
// @desc    Delete Catgory
// @route   POST /api/users/create-category
// @access  Public 
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.query.id)
        if (category) {
            res.status(201).json({
                success: true,
                msg: 'Successfully Deleted',
                data: category,
                error: "no error"
            });
        } else {
            res.status(401).json({
                success: false,
                msg: 'Category not found',
                error: "Category not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error',
            error: err
        });
    }
})

module.exports = {
    addCategory,
    getAllCategory,
    editCategory,
    deleteCategory
} 