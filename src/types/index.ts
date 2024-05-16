export type ValidationFailsObject = {
    success: boolean,
    message: string
    fails?: UserCreationValidationFails | UserReadAllValidationFails | UserReadOneValidationFails
}
export type UserCreationValidationFails = {
    name?: string[]
    email?: string[]
    phone?: string[]
    position_id?: string[]
    photo?: string[]
}
export type UserReadAllValidationFails = {
    count?: string[]
    page?: string[]
}
export type UserReadOneValidationFails = {
    userId: string[]
}
export type PaginationLinks = {
    next_url: string,
    prev_url: string | null
}