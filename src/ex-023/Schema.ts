import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull
} from "graphql";

/**
 * 롤 챔피언 데이터와
 * Profile 클래스 정보는 여기에...
 */
import { data, Profile } from "./Data";

/**
 * 롤 챔피언의 번호(이름순)와 이름을 가지고 있는 엔티티 객체 타입.
 */
let profile = new GraphQLObjectType({
    name: "profile",
    fields: {
        id: {
            type: GraphQLInt,
            resolve: (parent: Profile, args) => {
                return parent.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve: (parent: Profile, args) => {
                return parent.name;
            }
        }
    }
});

/**
 * 프로필의 데이터와 커서값을 가지고 있는 엣지 객체 타입.
 */
let profileEdge = new GraphQLObjectType({
    name: "profileEdge",
    fields: {
        node: {
            type: profile,
            resolve: (parent: Profile) => {
                return parent;
            }
        },
        cursor: {
            type: GraphQLString,
            resolve: (parent: Profile) => {
                return parent.base64();
            }
        }
    }
});

/**
 * 다음 페이지의 첫 번째 커서를 가르키는 페이지 객체 타입.
 */
let profilePageInfo = new GraphQLObjectType({
    name: "profilePageInfo",
    fields: {
        nextStart: {
            type: GraphQLString,
            resolve: (parent: Profile[]) => {
                let startEntityOfNext = data[parent[parent.length - 1].id + 1];
                if (startEntityOfNext == undefined) return null;
                else return startEntityOfNext.base64();
            }
        },
        hasNextPage: {
            type: GraphQLBoolean,
            resolve: (parent: Profile[]) => {
                // 사용자가 가져간 데이터 중 마지막 데이터의 커서값.
                let endCursorOfCurrent = parent[parent.length - 1].base64();

                // 전체 데이터의 마지막 커서값.
                let endCursorOfConnection = data[data.length - 1].base64();

                // 둘이 같으면 다음 페이지가 없는 것.
                return endCursorOfCurrent != endCursorOfConnection;
            }
        }
    }
});

/**
 * 커넥션 객체 타입.
 */
let profileConnection = new GraphQLObjectType({
    name: "profileConnection",
    fields: {
        totalCount: {
            type: GraphQLInt,
            resolve: () => {
                return data.length;
            }
        },

        edges: {
            type: new GraphQLList(profileEdge),
            resolve: parent => {
                let start = 0;

                if (parent.after != undefined) {
                    start = -1;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].base64() === parent.after) {
                            start = i;
                            break;
                        }
                    }
                    if (start == -1) {
                        throw Error(`invaild cursor : ${parent.after}`);
                    }
                }

                return data.slice(start, start + parent.first);
            }
        },

        pageInfo: {
            type: profilePageInfo,
            resolve: parent => {
                let start = 0;

                if (parent.after != undefined) {
                    start = -1;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].base64() === parent.after) {
                            start = i;
                            break;
                        }
                    }
                    if (start == -1) {
                        throw Error(`invaild cursor : ${parent.after}`);
                    }
                }

                return data.slice(start, start + parent.first);
            }
        }
    }
});

/**
 * 쿼리 타입.
 */
let query = new GraphQLObjectType({
    name: "paginagionQuery",
    fields: {
        profileConnection: {
            type: profileConnection,
            args: {
                first: { type: new GraphQLNonNull(GraphQLInt) },
                after: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                return args;
            }
        }
    }
});

/**
 * 스키마 생성.
 */
let schema = new GraphQLSchema({
    query: query
});

export default schema;
