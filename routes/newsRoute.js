const express = require("express");
const router = express.Router();
const {
    addNews,
    getAllNews,
    getNewsById,
    getSliderNews,
    getNewsByCategory,
    updateNews,
    deleteNews,
    displayNewsImage
} = require("../controllers/newsController");
const protect = require("../middlewares/authMiddleware");
router.route("/add-news").post(addNews);
router.route("/displayNewsImage").get(displayNewsImage);
router.route("/get-all-news").get(getAllNews);
router.route("/get-news-byId").get(getNewsById);
router.route("/get-slider-news").get(getSliderNews);
router.route("/get-news-category").get(getNewsByCategory);
router.route("/update-news").put(updateNews);
router.route("/delete-news").delete(deleteNews);
module.exports = router; 