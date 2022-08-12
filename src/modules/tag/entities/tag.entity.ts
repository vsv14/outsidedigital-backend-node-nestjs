import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @ManyToOne(()=> User, user => user.uid, { nullable:true, onDelete: "SET NULL"})
    @JoinColumn({name: 'creator'})
    @ApiProperty({ type: () => User })
    public creator: User;

    @Column("varchar", {unique: true, length: 40})
    public name: string;
  
    
    @Column("int", { default:0 })
    public sortOrder: number;
}