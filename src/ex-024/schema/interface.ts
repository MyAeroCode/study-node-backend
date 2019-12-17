import { Post } from "../ds/Post";
import { IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";
import { TypeGuard } from "../../common/typeGuard";

export class PostRequestArgs {
    @IsNumber()
    get!: number;

    @IsOptional()
    @IsString()
    cursor?: string;
}

export class UserRequestArgs {
    @IsNumber()
    get!: number;

    @IsOptional()
    @IsString()
    cursor?: string;
}

export class LikeRequestArgs {
    @IsNumber()
    get!: number;

    @IsOptional()
    @IsString()
    cursor?: string;

    @IsString()
    postCursor!: string;

    @TypeGuard(new Post())
    post!: Post;
}

export class PostVectorRange {
    @IsNumber()
    srt!: number;

    @IsNumber()
    end!: number;

    @IsBoolean()
    forward!: boolean;
}

export class UserVectorRange {
    @IsNumber()
    srt!: number;

    @IsNumber()
    end!: number;

    @IsBoolean()
    forward!: boolean;
}

export class LikeVectorRange {
    @IsNumber()
    srt!: number;

    @IsNumber()
    end!: number;

    @IsBoolean()
    forward!: boolean;

    @TypeGuard(new Post())
    post!: Post;
}
