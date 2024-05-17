import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { uploadPath } from "src/utils/constants";
import tinify from 'tinify';

@Injectable()
export class TinityService {
    constructor(
        private readonly confing: ConfigService
    ) { }

    async compressAndResizeImage(fileName: string) {
        tinify.key = this.confing.get('TINIFY_API_KEY')

        const filePath = uploadPath + '/' + fileName
        const source = tinify.fromFile(filePath)
        const resized = source.resize({
            method: "fit",
            width: 70,
            height: 70
        })
        try {
            resized.toFile(filePath)
        } catch (error) {
            console.log(error);
        }
    }
}