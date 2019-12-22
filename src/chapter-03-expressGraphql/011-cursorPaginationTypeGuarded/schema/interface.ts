import { Post } from "../ds/Post";
import { IsNumber, IsOptional, IsString, IsBoolean, ValidateNested } from "class-validator";

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

    @ValidateNested()
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

    @ValidateNested()
    post!: Post;
}
