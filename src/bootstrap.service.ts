import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Position, User } from "./entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { getRandomElement, uunumber } from "./utils/seeds";
import { userNames } from "./utils/constants";
import { ConfigService } from "@nestjs/config";
import { ImageSeedService } from "./image-seed.service";
import { uuid } from "./utils";

@Injectable()
export class BootsTrapService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Position)
        private readonly positionRepository: Repository<Position>,
        private readonly config: ConfigService,
        private readonly imageSeed: ImageSeedService,
    ) { }

    async onApplicationBootstrap(): Promise<any> {
        const seedExist = (await this.userRepository.find()).length
        if (seedExist >= 45) return null

        const serverUrl = this.config.get('SERVER_URL')

        // Position seed
        const posotion1 = await this.positionRepository.create({
            name: 'Manager'
        })
        const posotion2 = await this.positionRepository.create({
            name: 'HR'
        })
        const posotion3 = await this.positionRepository.create({
            name: 'Developer'
        })
        const positions = await this.savePositions([posotion1, posotion2, posotion3])
        // User seed
        for (let index = 0; index < 45; index++) {
            const photoSeed = await this.imageSeed.fetchRandomImage()
            const readPhotoLink = `${serverUrl}/avatars/${photoSeed}.jpeg`
            const randomName: string = getRandomElement(userNames)
            const randomPosition: Position = getRandomElement(positions)
            const uniquePhone = await this.createUniquePhone()
            const uniqueEmail = await this.createUniqueEmail(randomName)
            console.log({ Seeds_created: index });

            const newUser = await this.userRepository.create({
                name: randomName,
                email: uniqueEmail,
                phone: uniquePhone,
                position: randomPosition,
                positionName: randomPosition.name,
                photo: readPhotoLink,
                positionId: randomPosition.id
            })

            await this.userRepository.save(newUser)
        }
        console.log('Seeds created successfully');

    }

    private async savePositions(positions: Position[]) {
        for (const position of positions) {
            await this.positionRepository.save(position)
        }
        return await this.positionRepository.find()
    }

    private async createUniqueEmail(username: string) {
        let uuemail = ''
        let isUnique = false

        while (!isUnique) {
            uuemail = `${username}${uuid().slice(15)}gmail.com`
            const emailExist = await this.userRepository.findOne({
                where: { email: uuemail }
            })
            if (!emailExist)
                isUnique = true
        }

        return uuemail
    }
    private async createUniquePhone() {
        let uuphone = ''
        let isUnique = false

        while (!isUnique) {
            uuphone = `${uunumber(9)}`
            const emailExist = await this.userRepository.findOne({
                where: { phone: uuphone }
            })
            if (!emailExist)
                isUnique = true
        }

        return `+380${uuphone}`
    }
}