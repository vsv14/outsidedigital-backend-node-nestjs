import { DeleteResult } from 'typeorm';
import { TagService } from './tag.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import CreateTagDto from './dto/create.tag.dto';
import { Tag } from './entities/tag.entity';
import TagFieldsDto from './dto/tag.fields.dto';
import TagsDataDto from './dto/tags.data.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import QueryOptionsDto from './dto/query.options.dto';



@Controller('tag')
@UseGuards(AuthGuard)
@ApiTags('Tag')
@ApiBearerAuth('defaultBearerAuth')
export class TagController {
    constructor(
        private tagService: TagService
    ){}

    @Post()
    async createTag(@Body('uid') uid:string, @Body() dto: CreateTagDto): Promise<Tag>{
        const tagOptions: CreateTagDto = {...dto, creator: { uid }};
        const tag = await this.tagService.createTag(tagOptions)
        .catch(e=>{
            if(e.status) throw new HttpException(e.pesponse, e.status);

            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });

        delete tag?.creator;
        return tag;
    }

    @Get(':id')
    getTag(@Param('id') id: number): Promise<Tag>{
        return this.tagService.findTag(id)
        .catch(e=>{
            if(e.status) throw new HttpException(e.response, e.status);
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }

    @Get()
    getTags(@Query() query: QueryOptionsDto): Promise<TagsDataDto>{
        return this.tagService.findTags(query)
        .catch(e=>{
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }

    @Put(':id')
    @HttpCode(200)
    updateTag(@Param('id') id: number, @Body('uid') uid: string, @Body() dto: TagFieldsDto):Promise<Tag>{
        const tagFields = {...dto, uid: undefined};
        delete tagFields.uid;
        return this.tagService.updateTag(uid, id, tagFields)
        .catch(e=>{
            if(e.status) throw new HttpException(e.response, e.status);
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }

    @Delete(':id')
    @HttpCode(200)
    removeTag(@Param('id') id:number, @Body('uid') uid: string){
        return this.tagService.removeTag(uid, id).then(
            (result: DeleteResult)=>{
                if(result.affected) throw new HttpException('DELETED', HttpStatus.OK);
                else throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
            }
        ).catch(e=>{
            if(e.status) throw new HttpException(e.response, e.status);
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
            
    }
}
