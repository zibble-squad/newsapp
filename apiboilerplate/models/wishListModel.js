var mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
    },
    addedAt: {
        type: Date,
    },
});
module.exports = mongoose.model("WishList", wishListSchema); 