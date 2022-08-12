import { AuthService } from './../auth/auth.service';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import CreateUserDto from './dto/create.user.dto';
import UserFieldsDto from './dto/user.fields.dto';
import { User } from './entities/user.entity';
import IUserSevice from './interfaces/IUserService';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService implements IUserSevice {
    public constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ){}

    public createUser(creteUserDto:CreateUserDto): Promise<User>{
        const newUser = this.userRepository.create(creteUserDto);
        return this.userRepository.save(newUser);
    }

    public findOne(userFields: UserFieldsDto):Promise<User>{
        return this.userRepository.findOne({
            select:{
                uid:true,
                email: true,
                nickname: true,
                password:true
            },
            where: {
                ...userFields
            }
        });
    }

    public findUser(userFields: UserFieldsDto):Promise<User>{
        return this.userRepository.findOne({
            select:{
                uid: true,
                password: false,
                email: true,
                nickname: true,
                tags:{
                    id:true,
                    name:true,
                    sortOrder: true,
                    creator:{
                        uid: true,
                        nickname:true
                    }
                },
            },
            where: {
                ...userFields
            },
            relations: {
                tags:{
                    creator:true
                },
            }
        }).then(user => {
            delete user.uid;
            return user;
        });
    }

    public async updateUser(uid: string, dto: UserFieldsDto): Promise<User>{
        const userFields = {...dto};
        delete userFields.uid;
        if(userFields.email) await this.findOne(
            {    
                email:userFields.email
            }
        ).then(user=> {
            if(user && uid !== user.uid) throw new HttpException(`Bad Request: пользователь с таким [email] уже существует`, HttpStatus.BAD_REQUEST);
        });

        if(userFields.nickname) await this.findOne(
            {    
                nickname: userFields.email
            }
        ).then(user=> {
            if(user && uid !== user.uid) throw new HttpException(`Bad Request: пользователь с таким [nickname] уже существует`, HttpStatus.BAD_REQUEST);
        });

        if(userFields.password) userFields.password = await bcrypt.hash(userFields.password, 12);


        await this.userRepository.update(uid, userFields)
        .then(result=>result)
        .catch(e=>{
            throw new HttpException(`INTERNAL_SERVER_ERROR`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return this.userRepository.findOne({
            select:{
                email: true,
                nickname: true
            },
            where:{
                uid
            }
        });
    }

    public async removeUser(userFields: UserFieldsDto):Promise<DeleteResult>{
        await this.authService.logout(userFields.uid);
        return this.userRepository.delete(userFields.uid);
    }

    public addTags(uid:string, tags: {id:number}[]):Promise<User>{
        return this.userRepository
        .createQueryBuilder()
        .relation(User, 'tags')
        .of({uid})
        .add(tags)
        .then(result=>{
            return this.userRepository.findOne({
                select:{
                    uid: true,
                    password: false,
                    email: false,
                    nickname: false,
                    tags:true,
                },
                where: {
                    uid
                },
                relations: {
                    tags: true,
                }
            }).then(user => {delete user.uid; return user});
        })
    }

    public removeTag(uid:string, tag:{id:number}):Promise<User>{
        return this.userRepository
        .createQueryBuilder()
        .relation('tags')
        .of({uid})
        .remove(tag)
        .then(result=>{
            return this.userRepository.findOne({
                select:{
                    uid: true,
                    password: false,
                    email: false,
                    nickname: false,
                    tags:true,
                },
                where: {
                    uid
                },
                relations: {
                    tags: true,
                }
            }).then(user => {delete user.uid; return user});
        })
    }

    public ownTags(uid:string): Promise<User>{
        return this.userRepository
        .findOne({
            select:{
                uid: true,
                email: false,
                nickname: false
            },
            where: {
                uid
            },
            relations: {
                ownTags: true
            }
        }).then(result=> {
            const tags = [...result?.ownTags];
            result.tags??= tags;
            delete result?.ownTags;
            delete result?.uid;
            return result
        });
    }
}
