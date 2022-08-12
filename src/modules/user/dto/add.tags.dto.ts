import { ApiHideProperty } from "@nestjs/swagger";

export class AddTagsDto {
    @ApiHideProperty()
    uid:string;
    tags: number[];
}