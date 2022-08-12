import { DeleteResult } from "typeorm";
import ICreateUserDto from "../dto/create.user.dto";
import IUserFieldsDto from "../dto/user.fields.dto";
import { User } from "../entities/user.entity";

export default interface IUserSevice {
    createUser(creteUserDto:ICreateUserDto): Promise<User>

    findOne(userFields: IUserFieldsDto):Promise<User>

    findUser(userFields: IUserFieldsDto):Promise<User>;

    updateUser(uid: string, dto: IUserFieldsDto): Promise<User>;

    removeUser(userFields: IUserFieldsDto):Promise<DeleteResult>;

    addTags(uid:string, tags: {id:number}[]):Promise<User>;

    removeTag(uid:string, tag:{id:number}):Promise<User>;

    ownTags(uid:string): Promise<User>;
}