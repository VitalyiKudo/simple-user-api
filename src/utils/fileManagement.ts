import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { uploadPath } from "./constants";
import { HttpException } from "@nestjs/common";
import sizeOf from 'image-size';
const fs = require('fs');

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
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: async (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg)$/)) {
                cb(null, true);
            } else {
                cb(new HttpException('Only JPG and JPEG files are allowed', 400));
            }
        },
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