const { Schema, model } = require('mongoose')

const schema = new Schema({
  OrderID: { type: Number },
  PaymentID: { type: String },
  alerted: { type: Boolean, default: false },
  email: { type: String },
  date: { type: Date, default: Date.now }
})

module.exports = model('NewPayment', schema)
