import { JwToken } from './../modules/auth/utils/jwtoken';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const body = {...context.switchToHttp().getRequest().body};
            let token:string|undefined = context.switchToHttp().getRequest().headers.authorization?.split(' ')[1];
            
            if(!token) return false;

            const payload = JwToken.verify(token);
            if(!payload) return false;

            context.switchToHttp().getRequest().body = {
                uid: payload.uid,
                ...body
            };

            return true;
            
        }catch(e){
            return false;
        }
    }
}