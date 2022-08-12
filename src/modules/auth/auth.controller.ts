import { JwtDto } from './dto/jwt.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Get, HttpCode, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import AuthUserDto from './dto/auth.user.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';



@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authService: AuthService){}


    @Post('signup')
    signup(@Body() dto: AuthUserDto):Promise<JwtDto>{        
        return this.authService.signup(dto)
        .catch((err)=>{
            if(err.status) throw new HttpException(err.response, err.status);

            if(err.detail) throw new HttpException(err.detail, HttpStatus.BAD_REQUEST);

            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() dto: AuthUserDto):Promise<JwtDto>{
        return this.authService.login(dto)
        .catch((err)=>{
            console.log(err);
            if(err.status) throw new HttpException(err.response, err.status);

            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }


    @UseGuards(AuthGuard)
    @Get('logout')
    @ApiBearerAuth('defaultBearerAuth')
    async logout(@Body('uid') uid: string):Promise<any>{
        const  isLogout = this.authService.logout(uid);
        if(isLogout) throw new HttpException(`LogOut User uuid: ${uid}`, HttpStatus.OK);
    }

    @Get('token/refresh')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('defaultBearerAuth')
    refreshToken(@Req() req: Request): Promise<JwtDto>{
        let token:string|undefined = req.headers.authorization?.split(' ')[1];
        if(!token) throw new HttpException('ACCESS FORBIDDEN', HttpStatus.FORBIDDEN)
        
        return this.authService.refreshToken(token)
        .catch(e=>{
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }
}