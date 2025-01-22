var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    game_name: {
        type: String,
        required: true
    },
    users: {
        type: Number,
        required: true
    },
    short_description:{
        type:String,
        required:true
    },
    category_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    banner_image:{
        type:String,
        required:true
    }
},
{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);
