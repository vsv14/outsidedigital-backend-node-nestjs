import { AddTagsDto } from './dto/add.tags.dto';
import { DeleteResult } from 'typeorm';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Post, Put, UseGuards, HttpException, HttpStatus, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from './entities/user.entity';
import UserFieldsDto from './dto/user.fields.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';




@Controller('user')
@UseGuards(AuthGuard)
@ApiTags('User')
@ApiBearerAuth('defaultBearerAuth')
export class UserController {
    public constructor(private userService: UserService){}

    @Get()
    getUser(@Body('uid') uid: string):Promise<User>{
        return this.userService.findUser({uid});
    }

    @Put()
    @HttpCode(200)
    updateUser(@Body() dto: UserFieldsDto):Promise<User|null>{
        const uid: string = dto.uid;
        const userFields = {...dto};
        delete userFields.uid;
        
        return this.userService.updateUser(uid, userFields)
        .then(user=>{
            delete user?.uid;
            return user;
        });

    }

    @Delete()
    @HttpCode(200)
    removeUser(@Body('uid') uid:string): Promise<DeleteResult>{
        return this.userService.removeUser({uid});
    }

    @Post('tag')
    @HttpCode(200)
    addTags(@Body() dto: AddTagsDto): Promise<User>{
        const userTags = dto.tags.map(id=>({id}));
        
        return this.userService.addTags(dto.uid, userTags).catch(e=>{
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });
    }

    @Delete('tag/:id')
    @HttpCode(200)
    removeTag(@Param('id') id: number, @Body() dto: {uid:string}): Promise<User>{
        return this.userService.removeTag(dto.uid, {id}).catch(e=>{
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });       
    }

    @Get('tag/my')
    getOwnTags( @Body() dto: {uid:string}): Promise<User>{
        return this.userService.ownTags(dto.uid)
    }
}
