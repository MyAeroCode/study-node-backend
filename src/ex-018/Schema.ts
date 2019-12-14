import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLString
} from "graphql";

/**
 * 인터페이스 정의부.
 * resolveType으로 구체적인 타입을 가르키도록 해야한다.
 */
const BinaryNumberInterface = new GraphQLInterfaceType({
    name: "BinaryNumberInterface",
    fields: {
        number: { type: GraphQLInt },
        result: { type: GraphQLString }
    },
    resolveType: BinaryNumberTypeResolver
});

/**
 * 인터페이스를 구현한 오브젝트 타입.
 * interfaces 속성에 구현할 인터페이스 타입을 넣고,
 * isTypeOf로 해당 오브젝트 타입의 유효성을 검증해야 한다.
 */
const TruthyNumberType = new GraphQLObjectType({
    name: "TruthyNumberType",
    interfaces: [BinaryNumberInterface],
    fields: {
        number: { type: GraphQLInt },
        result: {
            type: GraphQLString,
            resolve() {
                return "true";
            }
        },
        x: {
            type: GraphQLString,
            resolve() {
                return "truthy object field";
            }
        }
    },
    isTypeOf: data => data.number
});

const FalsyNumberType = new GraphQLObjectType({
    name: "FalsyNumberType",
    interfaces: [BinaryNumberInterface],
    fields: {
        number: { type: GraphQLInt },
        result: {
            type: GraphQLString,
            resolve() {
                return "false";
            }
        },
        y: {
            type: GraphQLString,
            resolve() {
                return "falsy object field";
            }
        }
    },
    isTypeOf: data => !data.number
});

function BinaryNumberTypeResolver(data: any): GraphQLObjectType {
    return data.number ? TruthyNumberType : FalsyNumberType;
}

let query = new GraphQLObjectType({
    name: "test",
    fields: {
        test: {
            type: BinaryNumberInterface,
            args: {
                number: {
                    type: GraphQLInt
                }
            },
            resolve: (source, args) => {
                return args;
            }
        }
    }
});

/**
 * types에 구체적인 타입의 이름을 적지 않는다면 오류 발생.
 */
let schema = new GraphQLSchema({
    types: [TruthyNumberType, FalsyNumberType],
    query: query
});

export default schema;
