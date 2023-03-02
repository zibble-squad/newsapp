const express = require("express");
const router = express.Router();
const {
    addWishList,
    getWishListById,
    getAllWishList
} = require("../controllers/wishListController");
const protect = require("../middlewares/authMiddleware");
router.route("/add-wishList").post(addWishList);
router.route("/get-wishList-byId").get(getWishListById);
router.route("/get-All-wishList").get(getAllWishList);
module.exports = router; 