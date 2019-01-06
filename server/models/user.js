const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role.'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true,
    },
    password : {
        type: String,
        required: [true, 'The password is required']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles,
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

userSchema.methods.toJSON = function() {
    let tempUser = this;
    let userObject = tempUser.toObject();
    delete userObject.password;

    return userObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique'})

module.exports = mongoose.model('User', userSchema);