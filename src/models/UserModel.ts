import crypto from 'crypto';
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UserTypes from '../types/UserTypes';
import returnToObjectAndToJsonOptions from '../utils/returnToObjectAndToJsonOptions';

const userSchemaOptions = returnToObjectAndToJsonOptions()

const userSchema = new Schema<UserTypes.UserDocument>({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: [
            UserTypes.UserRoles.Admin,
            UserTypes.UserRoles.Guide,
            UserTypes.UserRoles.LeadGuide,
            UserTypes.UserRoles.User,
        ],
        default: UserTypes.UserRoles.User
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (this: UserTypes.UserDocument, el: string): boolean {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, userSchemaOptions);



userSchema.pre<UserTypes.UserDocument>('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password as string, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = null;
    next();
});

userSchema.pre<UserTypes.UserDocument>('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.pre<UserTypes.UserModel>(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            `${this.passwordChangedAt.getTime() / 1000}`,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');


    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model<UserTypes.UserDocument, UserTypes.UserModel>('User', userSchema);

export default User;