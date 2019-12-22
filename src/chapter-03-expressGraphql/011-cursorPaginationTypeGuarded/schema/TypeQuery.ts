import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from "graphql";
import { userConnection, userEdge } from "./TypeUser";
import { postEdge, postConnection } from "./TypePost";
import { likeConnection } from "./TypeLike";
import { UserRequestArgs, PostRequestArgs, LikeRequestArgs } from "./interface";
import { User } from "../ds/User";
import { Post } from "../ds/Post";
import testCase from "../testCaseGenerator/TestCase";
import { getIdxByCursor, base64encode } from "../Library";
import { validateSync } from "class-validator";

export const query = new GraphQLObjectType<any, any, any>({
    name: "connectionTestQuery",
    fields: {
        // 커서 기반 페이지네이션으로 데이터를 가져온다.
        requestUser: {
            type: userConnection,
            args: {
                get: { type: GraphQLInt },
                cursor: { type: GraphQLString }
            },
            resolve: (_, args: UserRequestArgs): UserRequestArgs => {
                if (validateSync(args).length != 0) {
                    throw new Error("타입가드 에러");
                }
                return args;
            }
        },
        requestPost: {
            type: postConnection,
            args: {
                get: { type: new GraphQLNonNull(GraphQLInt) },
                cursor: { type: GraphQLString }
            },
            resolve: (_, args: PostRequestArgs): PostRequestArgs => {
                if (validateSync(args).length != 0) {
                    throw new Error("타입가드 에러");
                }
                return args;
            }
        },
        requestLike: {
            type: likeConnection,
            args: {
                get: { type: new GraphQLNonNull(GraphQLInt) },
                cursor: { type: GraphQLString },
                postCursor: { type: GraphQLString }
            },
            resolve: (_, args: LikeRequestArgs): LikeRequestArgs => {
                if (validateSync(args).length != 0) {
                    throw new Error("타입가드 에러");
                }

                let postIndex: number = getIdxByCursor(testCase.postList, args.postCursor, (post) => base64encode(post.title));
                args.post = testCase.postList[postIndex];
                return args;
            }
        },

        // 현재 테스트케이스의 데이터를 가져온다.
        userData: {
            type: new GraphQLList(userEdge),
            resolve: (): User[] => testCase.userList
        },
        postData: {
            type: new GraphQLList(postEdge),
            resolve: (): Post[] => testCase.postList
        }
    }
});
