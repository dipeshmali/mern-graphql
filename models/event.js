const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'users' }
}, { versionKey: false });

const event = mongoose.model('events', eventSchema);
module.exports = event;


