export type ValidationFailsObject = {
    success: boolean,
    message: string
    fails?: UserCreationValidationFails | UsersReadingValidationFails
}
export type UserCreationValidationFails = {
    name?: string[]
    email?: string[]
    phone?: string[]
    position_id?: string[]
    photo?: string[]
}
export type UsersReadingValidationFails = {
    count?: string[]
    page?: string[]
}
export type PaginationLinks = {
    next_url: string,
    prev_url: string | null
}