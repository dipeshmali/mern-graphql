const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users" },
    event: { type: Schema.Types.ObjectId, ref: "events" },
},
    {
        timestamps: true,
        versionKey: false
    }
);

const booking = mongoose.model('booking', bookingSchema);
module.exports = booking;