import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { uploadPath } from "./constants";
const fs = require('fs');

export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function isValidPhone(phone: string) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
}

export function paginate(array: Array<any>, count: number, page: number) {
    const pageLocal = Number(page) === 0 ? 1 : page;

    return array.slice((pageLocal - 1) * count, pageLocal * count);
}

export function createDiskStorage(destination: string) {
    return {
        storage: diskStorage({
            destination,
            filename: (req, file, cb) => {
                const filename: string =
                    path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`);
            },
        }),
    }
}
export function deleteFile(fileName: string) {
    return fs.unlink(uploadPath + '/' + fileName, (err) => {
        if (err) {
            console.log({
                error: 'File deletion error',
                message: err
            });
        }
    });
}