const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customer_id: {
        type: String,
        required: true
      }
    });
module.exports = mongoose.model('Customer', customerSchema);
