import { User } from "./User";
import { Like } from "./Like";
import { IsString, ValidateNested } from "class-validator";

export class Post {
    @IsString()
    title!: string;

    @ValidateNested()
    author!: User;

    @ValidateNested()
    liked!: Like[];
}
