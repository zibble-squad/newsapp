const asyncHandler = require("express-async-handler");
const WishList = require("../models/wishListModel");

// @desc    Add Wish List
// @route   POST /api/wishList/add-wishList
// @access  Public
const addWishList = asyncHandler(async (req, res) => {
    try {
        //  Getting News Id from params
        const wishListItem = req.query.newsId;
        const userId = req.query.userId;

        if (wishListItem && userId) {
            const wishList = await WishList.create({
                user: userId,
                news: wishListItem,
                addedAt: Date.now(),
            });
            res.status(201).json({
                success: true,
                msg: "Successfully Added News Into WishList",
                data: wishList,
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "Inavalid Data. Something Went Wrong Please Try Again Later !",
                error: "Record Not Added..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    All Wish List  
// @route   Get  /api/wishList/get-wishList
// @access  Public
const getAllWishList = asyncHandler(async (req, res) => {
    try {
        const wishListItem = await WishList.find({ user: req.query.userId }).populate({ path: "news" })
        if (wishListItem) {
            res.status(201).json({
                success: true,
                msg: "WishList Found Successfully",
                data: wishListItem,
                error: "No Error",
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "No News Found...",
                error: "Record Not Found..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    Wish List By Id
// @route   Get  /api/wishList/get-wishList
// @access  Public
const getWishListById = asyncHandler(async (req, res) => {
    try {
        const wishListItem = await WishList.findOne({ _id: req.query.wishListId }).populate({ path: "news" })
        if (wishListItem) {
            res.status(201).json({
                success: true,
                msg: "WishList Found Successfully",
                data: wishListItem,
                error: "No Error",
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "No News Found...",
                error: "Record Not Found..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

module.exports = {
    addWishList,
    getWishListById,
    getAllWishList
};
