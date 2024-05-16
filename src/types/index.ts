export type ValidationFailsObject = {
    success: boolean,
    message: string
    fails?: UserCreationValidationFails
}
export type UserCreationValidationFails = {
    name?: string[]
    email?: string[]
    phone?: string[]
    position_id?: string[]
    photo?: string[]
}