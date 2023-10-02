const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: Number, required: true },
    address: { type: String, required: true },
    location: { type: String },
    date: { type: String, default: Date.now() },
    region: { type: String },
});

module.exports = model('Client', schema);