import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from './position.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({
        nullable: false,
    })
    email: string;

    @Column({
        nullable: false,
    })
    phone: string;

    @Column({
        nullable: true, // temporary
    })
    photo: string;

    @Column({
        nullable: true,
        name: 'position_name'
    })
    positionName: string

    @Column({
        nullable: false,
        name: 'position_id'
    })
    positionId: number

    @ManyToOne(() => Position, position => position.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'positionId' })
    position: Position
}
