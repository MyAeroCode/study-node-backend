/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import {
    buildSchemaSync,
    Query,
    Field,
    Arg,
    Int,
    InputType,
    createMethodDecorator,
    ObjectType,
    createParamDecorator
} from "type-graphql";

@InputType()
class UserInput {
    @Field()
    name!: string;

    @Field(() => Int)
    age!: number;
}

@ObjectType()
class User {
    @Field()
    name!: string;

    @Field(() => Int)
    age!: number;
}

// 필드 데코레이터.
// createMethodDecorator의 결과물을 반환하는 청크함수이다.
//
function ErrorCheck() {
    return createMethodDecorator(async (_, next) => {
        try {
            return await next();
        } catch (e) {
            console.error(e);
            // it must be return null.
        }
    });
}

function UsernameChecker(regex: RegExp) {
    return createMethodDecorator(async ({ args }, next) => {
        let user: UserInput = args.user;
        if (!regex.test(user.name)) {
            throw new Error("Invaild username.");
        }
        return next();
    });
}

// 파라미터 데코레이터.
// 필드에 주입할 데이터를 결정한다.
//
function Age() {
    return createParamDecorator((data) => {
        let user: UserInput = data.args.user;
        return user.age;
    });
}

class RootSchema {
    // 데코레이터에도 순서가 있으니 주의한다.
    //
    @Query(() => User, { nullable: true })
    @ErrorCheck()
    @UsernameChecker(/^[a-zA-Z]+$/)
    echoUser(@Arg("user", () => UserInput) user: UserInput, @Age() age: number) {
        console.log(`age of user is ${age}`);
        return user;
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
