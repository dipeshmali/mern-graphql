const { buildSchema } = require('graphql');
module.exports = buildSchema(`

        type Booking {
            _id : ID!
            user : User!
            event : Event!
            createdAt : String!
            updatedAt : String!
        }

        type Event {
            _id : ID!
            name : String!
            description : String!
            price : Float!
            date : String!
            creator : User!
        } 

        type User {
            _id : ID!
            email : String!
            password : String
            createdEvent : [Event!]
        }

        type AuthData {
            userId : ID!
            token : String!
            tokenExpiration: Int!
        }

        input EventInput {
            name : String!
            description : String!
            price : Float!
            date : String!
        }

        input UserInput {
            email : String!
            password : String!
        }

        type RootQuery {
            events : [Event!]!
            bookings : [Booking!]!
            login(email:String!, password:String!): AuthData!
        }

        type RootMutation {
            createEvent(eventInput: EventInput) : Event
            createUser(userInput : UserInput) : User
            bookEvent(eventId : ID!) : Booking!
            cancelBooking(bookingId : ID!) : Event! 
        }

        schema {
            query :RootQuery
            mutation :RootMutation
        }
`)
