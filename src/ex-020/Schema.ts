import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLEnumType
} from "graphql";

/**
 * 열거형을 사용할 때는,
 * 각 자료형의 타입을 일치시키는 것이 좋다.
 */
let MailType = new GraphQLEnumType({
    name: "MAIL",
    values: {
        NAVER: { value: "@naver.com" },
        GOOGLE: { value: "@gmail.com" },
        DAUM: { value: "@daum.net" }
    }
});

let query = new GraphQLObjectType({
    name: "enumTestQuery",
    fields: {
        test: {
            type: GraphQLString,
            args: {
                mailType: {
                    type: MailType
                }
            },
            resolve: (parent, args) => {
                /**
                 * 열거형도 다른 변수와 똑같다.
                 * args[ARG_NAME]에 순수 값이 들어있다.
                 */
                let mailType: string = args.mailType;
                return mailType;
            }
        }
    }
});

let schema = new GraphQLSchema({
    query: query
});

export default schema;
