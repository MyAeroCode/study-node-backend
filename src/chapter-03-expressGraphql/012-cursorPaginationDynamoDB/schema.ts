import { GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from "graphql";
import { ConnectionArgs, User, UserConnection, UserEdge, UserPageInfo } from "./ds";
import { base64decode, base64encode, adjustNumber } from "./Library";
import { conn } from "./conn";
import { TypeCheck } from "ts-type-guard";
var attr = require("dynamodb-data-types").AttributeValue;

const user = new GraphQLObjectType<User, any, any>({
    name: "User",
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (user): string => user.name
        }
    }
});

const userEdge = new GraphQLObjectType<UserEdge, any, any>({
    name: "UserEdge",
    fields: {
        node: {
            type: new GraphQLNonNull(user),
            resolve: (source): User => source.node
        },
        cursor: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (source): string => source.getCursor()
        }
    }
});

const userPageInfo = new GraphQLObjectType<UserPageInfo, any, any>({
    name: "UserPageInfo",
    fields: {
        after: {
            type: GraphQLString,
            resolve: (source): string | undefined => source.after
        },
        hasNextPage: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (source): boolean => source.hasNextPage
        }
    }
});

const userConnection = new GraphQLObjectType<UserConnection, any, any>({
    name: "UserConnection",
    fields: {
        totalCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: (source): number => source.totalCount
        },
        scannedCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: (source): number => source.scannedCount
        },
        edges: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userEdge))),
            resolve: (source): UserEdge[] => source.edges
        },
        pageInfo: {
            type: new GraphQLNonNull(userPageInfo),
            resolve: (source): UserPageInfo => source.pageInfo
        }
    }
});

const query = new GraphQLObjectType<null, any, any>({
    name: "DynamoDBPaginationQuery",
    fields: {
        userConnection: {
            type: new GraphQLNonNull(userConnection),
            args: {
                get: { type: new GraphQLNonNull(GraphQLInt) },
                after: { type: GraphQLString }
            },
            resolve: async (_, args: ConnectionArgs): Promise<UserConnection> => {
                if (TypeCheck.hasError(args, ConnectionArgs)) {
                    throw new Error("타입가드 에러");
                }

                let tableInfo = await conn
                    .describeTable({
                        TableName: "UserSample"
                    })
                    .promise();

                let result = await conn
                    .scan({
                        TableName: "UserSample",
                        Limit: adjustNumber(1, 26, args.get),
                        ExclusiveStartKey: args.after ? JSON.parse(base64decode(args.after)) : undefined
                    })
                    .promise();

                let after: string | undefined = result.LastEvaluatedKey ? base64encode(JSON.stringify(result.LastEvaluatedKey)) : undefined;

                let edges: UserEdge[] = [];
                result.Items?.forEach((item) => {
                    let v = attr.unwrap(item);
                    let edge: UserEdge = Object.assign(new UserEdge(), {
                        node: v
                    });
                    if (TypeCheck.hasError(edge, UserEdge)) throw new Error("typeguard");
                    else edges.push(edge);
                });

                return {
                    totalCount: tableInfo.Table!!.ItemCount!!,
                    scannedCount: result.ScannedCount ? result.ScannedCount : 0,
                    edges: edges,
                    pageInfo: {
                        after: after,
                        hasNextPage: after != undefined
                    }
                };
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: query
});
