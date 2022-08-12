import * as jwt from 'jsonwebtoken';
import jwt_config from '../../../config/jwt.config';


interface IJwtPayload {
    jwt_type: string,
    uid: string,
    email: string
}

export class JwToken {

    public static generateAccess(payload:{uid:string, email:string}):string{
        const jwtPayload: IJwtPayload = {
            jwt_type: jwt_config.types.access.name,
            ...payload
        }

        return jwt.sign(
            jwtPayload,
            jwt_config.secret,
            {
                expiresIn: jwt_config.types.access.expiresIn
            }
        )
    }

    public static verify (token: string):IJwtPayload|undefined{
        try{
            const payload:IJwtPayload = jwt.verify(token, jwt_config.secret) as IJwtPayload;
            return payload;

        }catch(err){
            return undefined
        }
    }
}

