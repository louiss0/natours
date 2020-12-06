import { Request } from "express"
import { Document, Model } from "mongoose"
namespace UserTypes {

    export interface UserDocument extends Document {
        id: string
        name: string
        email: string
        password: string | null
        photo?: string
        passwordConfirm?: string | null
        passwordResetToken?: string | null
        passwordChangedAt?: Date
        passwordResetExpires?: number | null
        active?: boolean
        role?: UserRoles
        correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>
        changedPasswordAfter(JWTTimestamp: number): boolean
        createPasswordResetToken(): string
    }

    export type UserRequest = {
        user: UserDocument
        requestTime: string
        role: UserRoles
    } & Request

    export enum UserRoles {
        User = "user",
        Guide = "guide",
        LeadGuide = "lead-guide",
        Admin = "admin",
    }

    export type UserModel = Model<UserDocument>

    export type UserProfileInfo = Pick<UserTypes.UserDocument,
        "id" | "email" | "name" | "password" | "passwordConfirm" | "photo">
}

export default UserTypes