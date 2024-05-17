import { Position, User } from "src/entities";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserCreationValidationFails, UserReadAllValidationFails, ValidationFailsObject } from "src/types";
import { FindOneOptions } from "typeorm";
import { deleteFile, isValidEmail, isValidPhone, validateImageDimensions } from "src/utils";
import { HttpException } from "@nestjs/common";

export async function validateCreationErrors(
    dto: CreateUserDto,
    position: Position,
    photo: string,
    existingUser: User
) {
    let code = 201
    let message = ''
    let fails: UserCreationValidationFails = {}
    const isValidDimensions = await validateImageDimensions(photo)

    if (!position) {
        code = 404
        message = "Position not found"
    }
    if (existingUser) {
        code = 403
        message = "User with this phone or email already exist"
    }
    if (dto.name.length < 2 || dto.name.length > 60) {
        code = 403
        fails.name = ['Username should contain 2-60 characters']
    }
    if (!isValidEmail(dto.email)) {
        code = 403
        fails.email = ['The email must be a valid email address']
    }
    if (!isValidPhone(dto.phone)) {
        code = 403
        fails.phone = ['The phone must be a valid phone number and starts with +380']
    }
    if (!dto.phone) {
        code = 403
        fails.phone = ['The phone field is required']
    }
    if (!photo) {
        code = 403
        fails.photo = ['The photo field is required']
    }
    if (!isValidDimensions) {
        code = 400
        fails.photo = ['The image resolution must be at least 70x70 pixels']
    }

    const errorObj: ValidationFailsObject = {
        success: false,
        message,
    }
    if (Object.keys(fails).length) {
        errorObj.message = 'Validation failed'
        errorObj.fails = fails
    }

    if (code !== 201) {
        deleteFile(photo) // Delete a file with a user avatar
        throw new HttpException(errorObj, code)
    }
}

export async function validateFindAllErrors(page: number, count: number, totalPages: number) {
    let code = 200
    let message = "Validation failed"
    let fails: UserReadAllValidationFails = {}

    if (page < 1) {
        code = 422
        fails.page = ['The page must be at least 1']
    }
    if (isNaN(Number(count))) {
        code = 422
        fails.count = ['The count must be an integer']
    }
    if (page > totalPages) {
        code = 404
        message = 'Page not found'
    }

    const errorObj: ValidationFailsObject = {
        success: false,
        message,
    }
    if (Object.keys(fails).length) {
        errorObj.message = 'Validation failed'
        errorObj.fails = fails
    }

    if (code !== 200)
        throw new HttpException(errorObj, code)
}

export async function validateFindOneErrors(id: number, user: User) {
    let code = 200
    let message = "User not found"

    if (!user)
        code = 404
    if (isNaN(Number(id))) {
        code = 400
        message = 'The user with the requestedid does not exist'
    }

    const errorObj: ValidationFailsObject = {
        success: false,
        message,
    }
    if (code === 400)
        errorObj.fails = { userId: ['The user must be an integer'] }

    if (code !== 200)
        throw new HttpException(errorObj, code)
}