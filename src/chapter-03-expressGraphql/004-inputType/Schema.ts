import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLInputObjectType } from "graphql";

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

let tupleInput = new GraphQLInputObjectType({
    name: "tuple_input",
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
    name: "input_object_query",
    description: "필드에 매개변수를 전달한다.",
    fields: {
        pass: {
            type: tuple,
            args: {
                input: {
                    type: tupleInput
                }
            },
            resolve: (parent, args) => {
                // 매개변수는 args에 전달된다.
                let input = args.input;
                let x = input.x;
                let y = input.y;
                console.log(x, y);

                return input;
            }
        }
    }
});

let schema = new GraphQLSchema({
    query: query
});

export default schema;
