const mongoose = require('mongoose');
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Un-authentication')
        }
        try {
            // const bookings = await Booking.find().populate('user').populate('event');
            const bookings = await Booking.find({ user: ObjectId(req.userId) }).populate([{
                path: 'user',
                populate: 'createdEvent'
            }]).populate([{
                path: 'event',
                populate: 'creator'
            }]);
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            });
        } catch (err) {
            // throw new Error('Fetch error while get bookings', err)
            throw err;
        }
    },

    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Un-authentication')
        }
        const fetchEvent = await Event.findOne({ _id: args.eventId });
        const bookEvent = new Booking({
            user: req.userId,
            event: fetchEvent
        })
        const result = await bookEvent.save();
        // return result;
        return {
            ...result._doc,
            _id: result.id,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        }
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Un-authentication')
        }
        const booking = await Booking.findById({ _id: args.bookingId }).populate('event');
        try {
            await Booking.deleteOne({ _id: args.bookingId });
            return booking.event;
        }
        catch (err) {
            throw err;
        }
    }
}