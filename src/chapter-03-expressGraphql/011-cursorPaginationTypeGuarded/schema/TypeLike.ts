import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } from "graphql";
import { user } from "./TypeUser";
import { Like } from "../ds/Like";
import { Post } from "../ds/Post";
import { User } from "../ds/User";
import { LikeRequestArgs, LikeVectorRange } from "./interface";
import { base64encode, adjustNumber, getIdxByCursor } from "../Library";

export const like = new GraphQLObjectType<Like>({
    name: "like",
    fields: {
        who: {
            type: user,
            resolve: (source: Like): User => source.who
        }
    }
});

export const likeEdge = new GraphQLObjectType<Like>({
    name: "likeEdge",
    fields: {
        node: {
            type: like,
            resolve: (source: Like): Like => source
        },
        cursor: {
            type: GraphQLString,
            resolve: (source: Like): string => base64encode(source.when.toString())
        }
    }
});

export const likePageInfo = new GraphQLObjectType<LikeVectorRange>({
    name: "likePageInfo",
    fields: {
        before: {
            type: GraphQLString,
            resolve: (source: LikeVectorRange): string | null => {
                const post: Post = source.post;
                let list = post.liked;
                if (list.length == 0) return null;

                return base64encode(list[source.forward ? adjustNumber(0, list.length, source.srt) : adjustNumber(0, list.length, source.end)].when.toString());
            }
        },
        after: {
            type: GraphQLString,
            resolve: (source: LikeVectorRange): string | null => {
                const post: Post = source.post;
                let list = post.liked;
                if (list.length == 0) return null;

                return base64encode(list[source.forward ? adjustNumber(0, list.length, source.end) : adjustNumber(0, list.length, source.srt)].when.toString());
            }
        },
        hasNextPage: {
            type: GraphQLBoolean,
            resolve: (source: LikeVectorRange): boolean => {
                return source.forward ? source.end != source.post.liked.length : source.srt != 0;
            }
        }
    }
});

export const likeConnection = new GraphQLObjectType<LikeRequestArgs>({
    name: "likeConnection",
    fields: {
        totalCount: {
            type: GraphQLInt,
            resolve: (source: LikeRequestArgs): number => source.post.liked.length
        },
        edgs: {
            type: new GraphQLList(likeEdge),
            resolve: (source: LikeRequestArgs): Like[] => {
                const cursor: string | undefined = source.cursor;
                const get: number = source.get!!;
                const post: Post = source.post;
                if (get == 0) throw new Error("get is must not 0");

                let cursorIdx = 0;
                let list = post.liked;

                // 기준점 찾기
                if (cursor) cursorIdx = getIdxByCursor<Like>(list, cursor, (v) => base64encode(v.when.toString()));
                else if (get < 0) cursorIdx = list.length;
                else if (get > 0) cursorIdx = -1;

                // 데이터 반환하기.
                return get > 0 ? list.slice(cursorIdx + 1, Math.min(cursorIdx + get + 1, list.length)) : list.slice(Math.max(cursorIdx + get, 0), cursorIdx);
            }
        },
        pageInfo: {
            type: likePageInfo,
            resolve: (source: LikeRequestArgs): LikeVectorRange => {
                const cursor: string | undefined = source.cursor;
                const get: number = source.get!!;
                const post: Post = source.post;
                if (get == 0) throw new Error("get is must not 0");

                let cursorIdx = 0;
                let list = post.liked;

                // 기준점 찾기
                if (cursor) cursorIdx = getIdxByCursor<Like>(list, cursor, (v) => base64encode(v.when.toString()));
                else if (get < 0) cursorIdx = list.length;
                else if (get > 0) cursorIdx = -1;

                // 데이터 반환하기.
                return get > 0
                    ? {
                          srt: cursorIdx + 1,
                          end: Math.min(cursorIdx + get + 1, list.length),
                          forward: true,
                          post: post
                      }
                    : {
                          srt: Math.max(cursorIdx + get, 0),
                          end: cursorIdx,
                          forward: false,
                          post: post
                      };
            }
        }
    }
});
