import { User } from "./User";
import { Like } from "./Like";
import { IsString } from "class-validator";
import { TypeGuard } from "ts-type-guard";

export class Post {
    @IsString()
    title!: string;

    @TypeGuard.GuardObject(User)
    author!: User;

    @TypeGuard.GuardArray(Like)
    liked!: Like[];
}
