const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdEvent: [
        {
            type: Schema.Types.ObjectId,
            ref: 'events'
        }
    ]
}, { versionKey: false });

const user = mongoose.model('users', UserSchema);
module.exports = user;