const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error('User exist already');
            }
            else {
                const user = new User({
                    email: args.userInput.email,
                    password: args.userInput.password
                })
                return user.save().then(res => {
                    console.log('Result=>', res);
                    return res;
                }).catch(err => {
                    console.log('Error =>', err);
                    throw err;
                })
            }
        })
    },

    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (user === null) {
            throw new Error('User not exist with this email');
        }
        const isEqual = await User.findOne({ password: password });
        if (!isEqual) {
            throw new Error('User not exist with this email');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'mysecretkey', { expiresIn: '1h' });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}