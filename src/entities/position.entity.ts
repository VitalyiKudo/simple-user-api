import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Position {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @OneToMany(() => User, user => user.position)
    users: User[];
}