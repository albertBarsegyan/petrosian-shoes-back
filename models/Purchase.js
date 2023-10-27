const { Schema, model } = require('mongoose')

const schema = new Schema({
  shortId: { type: String, required: true },
  email: { type: String, required: true },
  items: [{ type: String, required: true }],
  prices: [{ type: Number, required: true }],
  productNames: [{ type: String, required: true }],
  currency: { type: String, required: true },
  quantities: [{ type: Number }],
  shippingKey: { type: String },
  isPayed: { type: Boolean },
  sizes: [{ type: String }],
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String },
  date: { type: String, default: Date.now },
  region: { type: String },
  finished: { type: Boolean, default: false },
  OrderID: { type: Number },
  PaymentID: { type: String },
})

module.exports = model('Purchase', schema)
