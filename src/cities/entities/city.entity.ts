import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('cityVk')
export class CityEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    idVkCity: string
    @Column()
    title: string
}
