const { Schema, model } = require('mongoose')

const schema = new Schema({
  email: { type: String, required: true },
  location: { type: String },
  date: { type: String, default: Date.now },
  counter: { type: Number, default: 0 }
})

module.exports = model('Email', schema)
