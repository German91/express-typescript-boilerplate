import { NextFunction } from 'express';
import { Schema, model } from 'mongoose';
import * as validator from 'validator';
import * as timestamps from 'mongoose-timestamps';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import IUser from './../interfaces/IUser';

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: 'Email is required',
        trim: true,
        minlength: 1,
        unique: true,
        validate: [{
            isAsync: false,
            validator: validator.isEmail,
            msg: 'Invalid email'
        }]
    },
    
    username: {
        type: String,
        required: 'Username is required',
        trim: true,
        minlength: 1,
        maxlength: 100,
        unique: true
    },

    password: {
        type: String,
        minlength: 6,
        required: 'Password is required'
    },

    roles: {
        type: [String],
        default: ['user']
    }
});

UserSchema.plugin(timestamps);

UserSchema.methods.toJSON = function () {
    const user = _.pick(this, ['_id' ,'email', 'username', 'roles', 'created_at', 'updated_at']);

    return user;
}

UserSchema.statics.findByCredentials = function (email: string, password: string) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user)
        return Promise.reject('User not found');

    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res)
          resolve(user);
        else
          reject(err);
      });
    });
  });
};

UserSchema.pre('save', function (next: NextFunction) {
    const user: IUser = this;

    if (!user.isModified('password')) next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

export default model('User', UserSchema);
