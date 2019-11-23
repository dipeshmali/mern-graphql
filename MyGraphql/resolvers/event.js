const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
    // return Event.find().populate('creator')
    events: () => {
        return Event.find().populate([{
            path: 'creator',
            populate: 'createdEvent',
        }]).then(events => {
            console.log("Events =>", events)
            return events;
        }).catch(err => {
            console.log('Error while fetcgh event', err);
        })
    },

    createEvent: (args, req) => {

        if (!req.isAuth) {
            throw new Error('Un-authentication')
        }

        var newEvent;
        const myEvent = {
            name: args.eventInput.name,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        }
        const event = new Event(myEvent)
        return event.save().then(res => {
            newEvent = res;
            console.log('Result=>', res);
            // add this event into user table as well
            User.findById(req.userId).then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                user.createdEvent.push(newEvent);
                user.save();
            }).catch(err => {
                console.log('Error => Finding user', err);
                throw err;
            })
            return newEvent;
        }).catch(err => {
            console.log('Error =>', err);
        })
    },
}