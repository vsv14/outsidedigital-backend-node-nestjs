import { Tag } from "../entities/tag.entity"

export default class TagsDataDto {
    data: Tag[];
    meta: {     
        offset: number;
        length: number;
        quantity?: number;
    }
}