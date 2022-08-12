import { ApiProperty } from "@nestjs/swagger";

export default class QueryOptionsDto {
    @ApiProperty({required: false})
    sortByOrder:undefined;
    
    @ApiProperty({required: false})
    sortByName:undefined;

    @ApiProperty({required: false})
    offset:number;

    @ApiProperty({required: false})
    length:number;
 }