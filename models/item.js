let mongoose = require('mongoose');

let itemSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    quantity:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    }
});

let Item = module.exports = mongoose.model('Item', itemSchema, "item");