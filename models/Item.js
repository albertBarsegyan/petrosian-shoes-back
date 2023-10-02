const { Schema, model } = require('mongoose');

const schema = new Schema({
    type: { type: String, required: true },
    name: { type: String },
    prices: [{ type: Number, required: true }],
    detailList: [{ type: String }],
    description: { type: String },
    shortId: { type: String, required: true, unique: true },
    avatarImg: { type: String, required: true },
    hoverImg: { type: String, required: true },
    collectionImg: [{ type: String }],
    collectionType: [{ type: String, required: true }],
    date: { type: Date, default: Date.now() },
    clicks: { type: Number, default: 0 },
    sale: { type: Boolean, default: false },
    newPrices: [{ type: Number }],
    sizes: [{ type: String, required: true }],
    existingSizes: [{ type: String }],
    carousel: { type: Boolean, default: false },
    carouselImg: { type: String, default: 'thumb.avatar.jpg' }
});

module.exports = model('Item', schema);