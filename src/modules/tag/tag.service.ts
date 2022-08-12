import { DeleteResult, UpdateResult } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import CreateTagDto from './dto/create.tag.dto';
import QueryOptionsDto from './dto/query.options.dto';
import TagFieldsDto from './dto/tag.fields.dto';
import TagsDataDto from './dto/tags.data.dto';

@Injectable()
export class TagService {
    public constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ){}

    public createTag(creteTagDto: CreateTagDto): Promise<Tag>{
        const newTag = this.tagRepository.create(creteTagDto);

        return this.tagRepository.save(newTag)
        .catch((err:Error)=>{
            if(err.message.startsWith('повторяющееся')){
                throw new HttpException(`Bad Request: [Tag name] уже существует`, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }

    public async findOne(id:number):Promise<Tag>{
        return this.tagRepository
        .findOne({
            select:{
                id:true,
                name:true,
                sortOrder:true,
                creator:{
                    uid:true,
                    nickname:true
                }
            },
            where:{
                id
            },
            relations:{
                creator:true
            }
        });
    }

    public async findTag(id:number):Promise<Tag>{
        return this.tagRepository
        .findOne({
            select:{
                id:true,
                name:true,
                sortOrder:true,
                creator:{
                    uid:true,
                    nickname:true
                }
            },
            where:{
                id
            },
            relations:{
                creator:true
            },
            
        }).then(tag=>{
            if(!tag) throw new HttpException('Tag не найден', HttpStatus.NOT_FOUND);
            delete tag?.id;
            return tag;
        });
    }

    public findTags(queryOptions:QueryOptionsDto):Promise<TagsDataDto>{

        const options = {offset: 0, length: 10, ...queryOptions};

        return this.tagRepository
        .findAndCount({
            select:{
                id:true,
                name:true,
                sortOrder:true,
                creator:{
                    uid:true,
                    nickname:true
                }
            },
            relations:{
                creator:true
            },
            skip: options.offset,
            take: options.length,
            order: {
                sortOrder: Object.keys(options).includes('sortByOrder')? 'ASC': undefined,
                name: Object.keys(options).includes('sortByName')? 'ASC': undefined
            }
        }).then(tags=>{
            return {
                data: tags[0],
                meta: {
                    offset: options.offset,
                    length: options.length,
                    quantity: tags[1]
                }
            };
        });
    }

    public async updateTag(uid: string, id:number, tagFields: TagFieldsDto):Promise<Tag>{
        return this.tagRepository.update({
            id,
            creator: {
                uid
            }
        },
        {
            ...tagFields
        })
        .then((result:UpdateResult)=>{
            return this.findOne(id).then(tag=>{
                if(!tag) throw new HttpException(`Bad Request: не обновленно, возможно [Tag.id] не существует`, HttpStatus.BAD_REQUEST); 
                if(tag.creator.uid !== uid) throw new HttpException(`Bad Request: не обновленно, Вы не [Tag.creator]`, HttpStatus.BAD_REQUEST); 
                delete tag.id;
                return tag;
            })
        });
    }

    public removeTag(uid:string, id: number):Promise<DeleteResult>{
        return this.tagRepository.delete({id, creator:{uid}})
    }
}
