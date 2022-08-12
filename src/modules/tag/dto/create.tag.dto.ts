import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

export default class CreateTagDto {
   name: string;
   sortOrder: number;

   @ApiHideProperty()
   creator:{uid:string}|null|undefined;
}