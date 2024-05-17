import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { uploadPath } from "src/utils/constants";
import tinify from 'tinify';

@Injectable()
export class CompressService {
    constructor(
        private readonly confing: ConfigService
    ) { }

    async compressImage(fileName: string) {
        tinify.key = this.confing.get('TINIFY_API_KEY')

        const filePath = uploadPath + '/' + fileName
        const source = tinify.fromFile(filePath)
        try {
            source.toFile(filePath)
        } catch (error) {
            console.log(error);
        }
    }
}