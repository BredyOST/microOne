import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('wordsForTg')
export class WordsSearchTgEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    idCategory:string
    @Column()
    word:string
    @Column({ nullable: true })
    dateLast:Date
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn({ nullable: true })
    updateAt: Date
}
