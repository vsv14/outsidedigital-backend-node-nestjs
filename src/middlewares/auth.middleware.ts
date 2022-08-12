import { FieldValidator } from './../validators/field.validator';
import { HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        const dto = {...req.body};
        let isCorrect = true;
        let msg = '';

        for(let key of Object.keys(dto)){
            
            switch(key){
                case 'email':
                    isCorrect &&= FieldValidator.isEmail(dto[key]);
                    isCorrect &&= FieldValidator.maxLenght(dto[key], 100);
                    if(!isCorrect) msg = 'введите email правильно, , максимальная длина 100 символов';
                    break;
                case 'password':
                    isCorrect &&= FieldValidator.isValidPass(dto[key]);
                    isCorrect &&= FieldValidator.minLenght(dto[key], 8);
                    if(!isCorrect) msg = 'password: должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы. password: минимальная длинна 8 символов';
                    break;
                case 'nickname':
                    isCorrect &&= FieldValidator.isValidText(dto[key]);
                    isCorrect &&= FieldValidator.maxLenght(dto[key], 30);
                    if(!isCorrect) msg = 'недопустимые символы, разрешены [a-z A-Z 0-9 _], максимальная длина 30 символов';
                    break;
            }
            
            if(!isCorrect) throw new HttpException(`Bad Request: ${msg}`, HttpStatus.BAD_REQUEST);
        }

        next();
    }
}