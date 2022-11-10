const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, required: false, default: "./images/profile.png" },
    admin: { type: Boolean, default: false },
    createdDate: { type: Date, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
