import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLUnionType
} from "graphql";

const TruthyNumberType = new GraphQLObjectType({
    name: "TruthyNumberType",
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

const BinaryNumberUnion = new GraphQLUnionType({
    name: "BinaryNumberUnion",
    types: [TruthyNumberType, FalsyNumberType],
    resolveType: BinaryNumberTypeResolver
});

function BinaryNumberTypeResolver(data: any): GraphQLObjectType {
    return data.number ? TruthyNumberType : FalsyNumberType;
}

let query = new GraphQLObjectType({
    name: "test",
    fields: {
        test: {
            type: BinaryNumberUnion,
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

let schema = new GraphQLSchema({
    query: query
});

export default schema;
