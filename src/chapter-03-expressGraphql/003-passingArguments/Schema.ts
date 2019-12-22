import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt } from "graphql";

let tuple = new GraphQLObjectType({
    name: "tuple",
    fields: {
        x: {
            type: GraphQLString
        },
        y: {
            type: GraphQLInt
        }
    }
});

let query = new GraphQLObjectType({
    // name pattern
    // ^[_a-zA-Z][_a-zA-Z0-9]*$
    name: "pass_argument_query",
    description: "필드에 매개변수를 전달한다.",
    fields: {
        pass: {
            type: tuple,
            args: {
                x: {
                    type: GraphQLString
                },
                y: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                // 매개변수는 args에 전달된다.
                let x = args.x;
                let y = args.y;
                console.log(x, y);

                return args;
            }
        }
    }
});

let schema = new GraphQLSchema({
    query: query
});

export default schema;
