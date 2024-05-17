import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { uploadPath } from './utils/constants';
import { uuid } from './utils';

@Injectable()
export class ImageSeedService {
    constructor(
        private readonly config: ConfigService,
    ) { }

    async fetchRandomImage() {
        const ninjaApiUrl = 'https://api.api-ninjas.com/v1/randomimage?category=nature&width=70&height=70'
        const apiKey = this.config.get('NINJA_API_KEY')
        const avatarSeedName = `seed-avatar${uuid()}`
        const response = await axios.get(ninjaApiUrl, {
            responseType: 'stream',
            headers: {
                'X-Api-Key': apiKey,
                'Accept': 'image/jpg'
            }
        });
        const uploadTarget = `${uploadPath}/${avatarSeedName}.jpeg`
        new Promise((resolve, reject) => {
            response.data.pipe(createWriteStream(uploadTarget))
                .on('error', reject)
                .once('close', () => resolve(uploadTarget));
        });
        return avatarSeedName
    }
}