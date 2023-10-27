const { Schema, model } = require('mongoose')

const schema = new Schema({
  isActive: { type: Boolean },
  shortId: { type: String, required: true },
  newPrices: [{ type: Number, required: true }],
  date: { type: Date, default: Date.now }
})

module.exports = model('Sale', schema)


