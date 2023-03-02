var mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category_name: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Category', categorySchema);