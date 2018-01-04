import { NextFunction } from 'express';
import { Schema, model } from 'mongoose';
import * as validator from 'validator';
import * as timestamps from 'mongoose-timestamps';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { IUser, IUserModel } from '../interfaces/IUser';

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

UserSchema.statics.findByCredentials = async function (password: string, email?: string, username?: string) {
  const User = this;

  try {
    const user: IUser = await User.findOne({ $or: [{ email, username }] });
    
    if (!user)
        return Promise.reject('User not found');

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return Promise.reject('Email/Username or password is incorrect');
    
    return user;
  } catch (err) {
    return err;
  }
};

UserSchema.pre('save', function (next: NextFunction) {
    const user = this;

    if (!user.isModified('password')) next();

    bcrypt.genSalt(10)
        .then((salt) => {
            return bcrypt.hash(user.password, salt).then((hash) => {
                user.password = hash;

                next();
            });
        })
        .catch((err) => {
            return next(err);
        });
});

export default model<IUser, IUserModel>('User', UserSchema);
