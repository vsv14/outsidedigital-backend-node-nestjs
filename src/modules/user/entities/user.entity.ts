import { Tag } from '../../tag/entities/tag.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiHideProperty } from '@nestjs/swagger';



@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public uid: string;
  
    @Column("varchar", { length: 100, unique: true})
    public email: string;

    @Column("varchar", {select: false, length: 100})
    @ApiHideProperty()
    public password: string;
  
    @Column("varchar", { length: 30, unique: true})
    public nickname: string;

    @ManyToMany(()=>Tag, { cascade: true, onDelete: "CASCADE" })
    @JoinTable({name:"usertag"})
    public tags: Tag[];

    @OneToMany(()=>Tag, tag=>tag.creator, { cascade: true})
    @ApiHideProperty()
    public ownTags: Tag[];
}