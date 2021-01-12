const  mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    library_item_id : {
        type : String,
        required: true
    },
    customer_id : {
        type : String,
        required: true
    },
    library_item_name : {
        type : String,
        required: true
    },
    library_item_type : {
        type : String,
        required: true
    },
    library_item_size : {
        type : Number,
        required: true
    },
    library_item_location : {
        type : String
    },
    library_item_uploaded_on : {
        type : Date,
        default : Date.now()
    }
})


module.exports = mongoose.model('Library', librarySchema);