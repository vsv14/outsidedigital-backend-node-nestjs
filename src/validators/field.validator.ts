export class FieldValidator{

    public static isEmail(email:string):boolean{
        const regexp = new RegExp('\^((\\w+)+(@)([a-zA-Z]+).(com|ru))\$');
        return regexp.test(email);
    }

    public static isValidPass(pass:string):boolean{
        const regexp = new RegExp('\^(?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z].*)\\w*\$');
        return regexp.test(pass);
    }

    public static isValidText(str:string):boolean{
        const regexp = new RegExp('\^\\w*\$');
        return regexp.test(str);
    }

    public static minLenght(field:string, minLength: number):boolean{
        return field.length >= minLength;
    }

    public static maxLenght(field:string, maxLength: number):boolean{
        return field.length <= maxLength;
    }

    public static isNumber(field:string):boolean{
        const num = parseInt(field, 10);
        return !isNaN(num);
    }
}