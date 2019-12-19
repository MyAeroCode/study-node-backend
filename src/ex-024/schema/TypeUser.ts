import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList
} from "graphql";
import { User } from "../ds/User";
import { UserRequestArgs, UserVectorRange } from "./interface";
import testCase from "../testCaseGenerator/TestCase";
import {
    base64encode,
    adjustNumber,
    getIdxByCursor
} from "../../common/Library";

export const user = new GraphQLObjectType<User>({
    name: "user",
    fields: {
        name: {
            type: GraphQLString,
            resolve: (source: User): string => {
                return source.name;
            }
        }
    }
});

export const userEdge = new GraphQLObjectType<User>({
    name: "userEdge",
    fields: {
        node: {
            type: user,
            resolve: (source: User): User => source
        },
        cursor: {
            type: GraphQLString,
            resolve: (source: User): string => base64encode(source.name)
        }
    }
});

export const userPageInfo = new GraphQLObjectType<UserVectorRange>({
    name: "userPageInfo",
    fields: {
        before: {
            type: GraphQLString,
            resolve: (source: UserVectorRange): string | null => {
                let list = testCase.userList;
                if (list.length == 0) return null;

                return source.forward
                    ? base64encode(
                          list[adjustNumber(0, list.length, source.srt)].name
                      )
                    : base64encode(
                          list[adjustNumber(0, list.length, source.end)].name
                      );
            }
        },
        after: {
            type: GraphQLString,
            resolve: (source: UserVectorRange): string | null => {
                let list = testCase.userList;
                if (list.length == 0) return null;

                return source.forward
                    ? base64encode(
                          list[adjustNumber(0, list.length, source.end)].name
                      )
                    : base64encode(
                          list[adjustNumber(0, list.length, source.srt)].name
                      );
            }
        },
        hasNextPage: {
            type: GraphQLBoolean,
            resolve: (source: UserVectorRange): boolean => {
                let list = testCase.userList;
                return source.forward
                    ? source.end != list.length
                    : source.srt != 0;
            }
        }
    }
});

export const userConnection = new GraphQLObjectType<UserRequestArgs>({
    name: "userConnection",
    fields: {
        totalCount: {
            type: GraphQLInt,
            resolve: () => testCase.userList.length
        },
        edgs: {
            type: new GraphQLList(userEdge),
            resolve: (source: UserRequestArgs): User[] => {
                const cursor: string | undefined = source.cursor;
                const get: number = source.get!!;
                if (get == 0) throw new Error("get is must not 0");

                let cursorIdx = 0;
                let list = testCase.userList;

                // 기준점 찾기
                if (cursor)
                    cursorIdx = getIdxByCursor<User>(list, cursor, v =>
                        base64encode(v.name)
                    );
                else if (get < 0) cursorIdx = list.length;
                else if (get > 0) cursorIdx = -1;

                // 데이터 반환하기.
                return get < 0
                    ? list.slice(Math.max(cursorIdx + get, 0), cursorIdx)
                    : list.slice(
                          cursorIdx + 1,
                          Math.min(cursorIdx + get + 1, list.length)
                      );
            }
        },
        pageInfo: {
            type: userPageInfo,
            resolve: (source: UserRequestArgs): UserVectorRange => {
                const cursor: string | undefined = source.cursor;
                const get: number = source.get!!;
                if (get == 0) throw new Error("get is must not 0");

                let cursorIdx = 0;
                let list = testCase.userList;

                // 기준점 찾기
                if (cursor)
                    cursorIdx = getIdxByCursor<User>(list, cursor, v =>
                        base64encode(v.name)
                    );
                else if (get < 0) cursorIdx = list.length;
                else if (get > 0) cursorIdx = -1;

                // 데이터 반환하기.
                return get < 0
                    ? {
                          srt: Math.max(cursorIdx + get, 0),
                          end: cursorIdx,
                          forward: false
                      }
                    : {
                          srt: cursorIdx + 1,
                          end: Math.min(cursorIdx + get + 1, list.length),
                          forward: true
                      };
            }
        }
    }
});
