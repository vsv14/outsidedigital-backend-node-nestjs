import { UserService } from '../user/user.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import AuthUserDto from './dto/auth.user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwToken } from './utils/jwtoken';
import { JwtDto } from './dto/jwt.dto';
import jwt_config from '../../config/jwt.config';



@Injectable()
export class AuthService {
    public constructor(
            @Inject(forwardRef(()=>UserService))
            private userService: UserService
        ){}

    public async signup(dto: AuthUserDto): Promise<JwtDto>{
        const hashPass = await bcrypt.hash(dto.password, 12);
    
        const user = await this.userService.createUser({email: dto.email, password: hashPass, nickname: dto.nickname!});
        const accessToken = JwToken.generateAccess({uid: user.uid, email: user.email});
        
        return {
            token: accessToken,
            expire: jwt_config.types.access.expiresIn
        }
    }

    public async login(dto: AuthUserDto): Promise<JwtDto>{
        const user = await this.userService.findOne({email:dto.email})
        .then(user=>user)
        .catch(e=>{
            return null;
        });
        if(!user) throw new HttpException(`Пользователь не найден`, HttpStatus.NOT_FOUND);

        const passIsMatch = await bcrypt.compare(dto.password, user.password);
        if(!passIsMatch) throw new HttpException(`Bad Request`, HttpStatus.BAD_REQUEST);

        const accessToken = JwToken.generateAccess({uid: user.uid, email: user.email});
        
        return {
            token: accessToken,
            expire: jwt_config.types.access.expiresIn
        }
    }


    public async logout(uid: string): Promise<boolean>{
        return true;
    }

    public async refreshToken(token: string): Promise<JwtDto>{
        const payload = JwToken.verify(token);
        const accessToken = JwToken.generateAccess({uid: payload.uid, email: payload.email});
        
        return {
            token: accessToken,
            expire: jwt_config.types.access.expiresIn
        }
    }
}
