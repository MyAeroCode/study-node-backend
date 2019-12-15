import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList
} from "graphql";

let adder: GraphQLObjectType = new GraphQLObjectType({
    name: "adder",
    /**
     * add 필드의 반환타입이 adder이며, 재귀적인 표현이다.
     * 이를 프로그래밍적으로 구현하려면 fields를 화살표 함수로 감쌀 것.
     *
     * 화살표 함수로 감싸지 않으면 아래 에러가 발생한다.
     * Block-scoped variable 'adder' used before its declaration.ts(2448)
     * Variable 'adder' is used before being assigned.ts(2454)
     */
    fields: () => ({
        total: {
            type: GraphQLInt,
            resolve: (parent: any, args: any) => {
                if (parent == undefined) return 0;

                let total = 0;
                for (let i = 0; true; i++) {
                    if (parent[i] == undefined) break;
                    total += parent[i];
                }
                return total;
            }
        },
        add: {
            type: adder,
            args: {
                number: { type: GraphQLInt }
            },
            resolve: (parent: any, args: any) => {
                if (parent == undefined) {
                    return {
                        0: args.number
                    };
                }
                for (let i = 0; true; i++) {
                    if (parent[i] != undefined) continue;
                    parent[i] = args.number;
                    break;
                }
                return parent;
            }
        },
        history: {
            type: new GraphQLList(GraphQLInt),
            resolve: (parent: any, args: any) => {
                if (parent == undefined) return [];

                let history = new Array<number>();
                for (let i = 0; true; i++) {
                    if (parent[i] == undefined) break;
                    history.push(parent[i]);
                }
                return history;
            }
        }
    })
});

let schema = new GraphQLSchema({
    query: adder
});

export default schema;
