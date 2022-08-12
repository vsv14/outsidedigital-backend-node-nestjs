import { ApiHideProperty } from "@nestjs/swagger";

export default class UserFieldsDto {
    @ApiHideProperty()
    uid?: string;
    email?: string;
    password?: string = undefined;
    nickname?: string;
}