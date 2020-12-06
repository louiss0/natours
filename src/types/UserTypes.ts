import { Request } from "express"
namespace UserTypes {

    export interface UserDocument {
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
    }

    export type UserRequest = {
        user: UserDocument
        requestTime: string
    } & Request




}

export default UserTypes