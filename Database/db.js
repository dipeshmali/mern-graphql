//Import the mongoose module
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Set up default mongoose connection

mongoose.connect('mongodb://127.0.0.1:27017/graphql', { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {
    console.log('Database Connected');
});

// If the connection throws an error
db.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    db.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
