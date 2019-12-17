import { User } from "./User";
import { Like } from "./Like";
import { IsString } from "class-validator";
import { TypeGuard, TypeGuardArray } from "../../common/typeGuard";

export class Post {
    @IsString()
    title!: string;

    @TypeGuard(new User())
    author!: User;

    @TypeGuardArray(new Like())
    liked!: Like[];
}
