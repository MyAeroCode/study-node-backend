import { Post } from "../ds/Post";

export interface PostRequestArgs {
    get: number;
    cursor: string | undefined;
}

export interface UserRequestArgs {
    get: number;
    cursor: string | undefined;
}

export interface LikeRequestArgs {
    get: number;
    cursor: string | undefined;
    postCursor: string;
    post: Post;
}

export interface PostVectorRange {
    srt: number;
    end: number;
    forward: boolean;
}

export interface UserVectorRange {
    srt: number;
    end: number;
    forward: boolean;
}

export interface LikeVectorRange {
    srt: number;
    end: number;
    forward: boolean;
    post: Post;
}
