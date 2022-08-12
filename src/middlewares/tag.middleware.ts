import { FieldValidator } from './../validators/field.validator';
import { HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


export class TagMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        const dto = {...req.body};
        let isCorrect = true;
        let msg = '';

        for(let key of Object.keys(dto)){
            
            switch(key){
                case 'name':
                    isCorrect &&= FieldValidator.isValidText(dto[key]);
                    isCorrect &&= FieldValidator.maxLenght(dto[key], 40);
                    isCorrect &&= FieldValidator.minLenght(dto[key], 5);
                    if(!isCorrect) msg = 'недопустимые символы, разрешены [a-z A-Z 0-9 _] или длина минимальная: 5, максимальная: 40 символов';
                    break;
                case 'sortOrder':
                    isCorrect &&= FieldValidator.isNumber(dto[key]);
                    if(!isCorrect) msg = 'sortOrder: число';
                    break;
            }
            
            if(!isCorrect) throw new HttpException(`Bad Request: ${msg}`, HttpStatus.BAD_REQUEST);
        }

        next();
    }
}