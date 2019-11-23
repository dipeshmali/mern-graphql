const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); // middleware
const path = require('path');
const cors = require('cors');
const db = require('./Database/db');
const isAuth = require('./middleware/auth');

const graphQlSchema = require('./MyGraphql/schema');
const graphResolvers = require('./MyGraphql/resolvers');

const app = express();
app.use(bodyParser.json());

/** [ type Event ]  */
/**
*  @description : define what data will retun by event when its created
*/
/** [ input EventInput ]  */
/**
*  @description : what data should be inserted (key : type)
*/

app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type Authorization');
//     if (res.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     return next();
// })

// app.use('/public', path.join('./react-frontend/build'));
app.use(isAuth);
app.use('/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphResolvers,
        graphiql: true
    })
);
app.use('/', express.static(path.join(__dirname, 'react-frontend/build')))

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log('error', err.message);
    next();
    // res.render('error');
});


app.listen(8080, () => {
    console.log('server is running on port 8080');
});


