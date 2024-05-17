import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtManager {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async createAuthToken() {
        const authToken = await this.jwtService.signAsync(
            {
                sub: uuidv4(),
            },
            {
                secret: this.configService.get('AUTH_SECRET'),
                expiresIn: this.configService.get('AUTH_SECRET_EXPIRATION_TIME'),
            },
        )

        return {
            success: true,
            token: authToken,
        }
    }
}
