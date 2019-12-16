import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList
} from "graphql";
import { adjustNumber, getIdxByCursor, base64 } from "./commonLibrary";
import { Post } from "../ds/Post";
import { User } from "../ds/User";
import { user } from "./TypeUser";
import { PostVectorRange, PostRequestArgs } from "./interface";
import testCase from "../testCaseGenerator/TestCase";

export const post = new GraphQLObjectType<Post>({
    name: "post",
    fields: {
        title: {
            type: GraphQLString,
            resolve: (source: Post): string => source.title
        },
        author: {
            type: user,
            resolve: (source: Post): User => source.author
        }
    }
});

export const postEdge = new GraphQLObjectType<Post>({
    name: "postEdge",
    fields: {
        node: {
            type: post,
            resolve: (source: Post): Post => source
        },
        cursor: {
            type: GraphQLString,
            resolve: (source: Post): string => base64(source.title)
        }
    }
});

export const postPageInfo = new GraphQLObjectType<PostVectorRange>({
    name: "postPageInfo",
    fields: {
        before: {
            type: GraphQLString,
            resolve: (source: PostVectorRange): string | null => {
                let list = testCase.postList;
                if (list.length == 0) return null;

                return base64(
                    source.forward
                        ? list[adjustNumber(0, list.length, source.srt)].title
                        : list[adjustNumber(0, list.length, source.end)].title
                );
            }
        },
        after: {
            type: GraphQLString,
            resolve: (source: PostVectorRange): string | null => {
                let list = testCase.postList;
                if (list.length == 0) return null;

                return base64(
                    source.forward
                        ? list[adjustNumber(0, list.length, source.end)].title
                        : list[adjustNumber(0, list.length, source.srt)].title
                );
            }
        },
        hasNextPage: {
            type: GraphQLBoolean,
            resolve: (source: PostVectorRange): boolean => {
                let list = testCase.postList;

                return source.forward
                    ? source.end != list.length
                    : source.srt != 0;
            }
        }
    }
});

export const postConnection = new GraphQLObjectType<PostRequestArgs>({
    name: "postConnection",
    fields: {
        totalCount: {
            type: GraphQLInt,
            resolve: () => {
                return testCase.userList.length;
            }
        },
        edgs: {
            type: new GraphQLList(postEdge),
            resolve: (source: PostRequestArgs): Post[] => {
                const cursor: string | undefined = source.cursor;
                const get: number = source.get!!;
                if (get == 0) throw new Error("get is must not 0");

                let cursorIdx = 0;
                let list = testCase.postList;

                // 기준점 찾기
                if (cursor)
                    cursorIdx = getIdxByCursor<Post>(list, cursor, v =>
                        base64(v.title)
                    );
                else if (get < 0) cursorIdx = list.length;
                else if (get > 0) cursorIdx = -1;

                // 데이터 반환하기.
                return get > 0
                    ? list.slice(
                          cursorIdx + 1,
                          Math.min(cursorIdx + get + 1, list.length)
                      )
                    : list.slice(Math.max(cursorIdx + get, 0), cursorIdx);
            }
        },
        pageInfo: {
            type: postPageInfo,
            resolve: (source: PostRequestArgs): PostVectorRange => {
                const cursor: string | undefined = source.cursor;
                const get: number = source.get!!;
                if (get == 0) throw new Error("get is must not 0");

                let cursorIdx = 0;
                let list = testCase.postList;

                // 기준점 찾기
                if (cursor)
                    cursorIdx = getIdxByCursor<Post>(list, cursor, v =>
                        base64(v.title)
                    );
                else if (get < 0) cursorIdx = list.length;
                else if (get > 0) cursorIdx = -1;

                // 데이터 반환하기.
                return get > 0
                    ? {
                          srt: cursorIdx + 1,
                          end: Math.min(cursorIdx + get + 1, list.length),
                          forward: true
                      }
                    : {
                          srt: Math.max(cursorIdx + get, 0),
                          end: cursorIdx,
                          forward: false
                      };
            }
        }
    }
});
