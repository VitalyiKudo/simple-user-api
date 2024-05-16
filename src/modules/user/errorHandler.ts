import { Position, User } from "src/entities";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserCreationValidationFails, ValidationFailsObject } from "src/types";
import { FindOneOptions } from "typeorm";
import { isValidEmail, isValidPhone } from "src/utils";
import { HttpException } from "@nestjs/common";

export async function validate(dto: CreateUserDto, position: Position) {
    let code = 201
    let message = ''
    let fails: UserCreationValidationFails = {}

    const options: FindOneOptions<User> = {
        where: [{ email: dto.email }, { phone: dto.phone }],
    };
    const existingUser = await this.userRepository.findOne(options)

    if (!position) {
        message = "Position not found"
        code = 404
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
    if (typeof dto.positionId !== 'number') {
        code = 403
        fails.position_id = ['The position id must be an integer']
    }
    if (!dto.phone) {
        code = 403
        fails.phone = ['The phone field is required']
    }

    const errorObj: ValidationFailsObject = {
        success: false,
        message,
    }
    if (Object.keys(fails).length) {
        errorObj.message = 'Validation failed'
        errorObj.fails = fails
    }
    if (code !== 201)
        throw new HttpException(errorObj, code)
}