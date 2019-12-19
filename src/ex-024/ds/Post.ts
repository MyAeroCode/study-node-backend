import { User } from "./User";
import { Like } from "./Like";
import { IsString } from "class-validator";
import { TypeGuard, TypeGuardArray } from "../../common/TypeGuard";

export class Post {
    @IsString()
    title!: string;

    @TypeGuard(User)
    author!: User;

    @TypeGuardArray(Like)
    liked!: Like[];
}
