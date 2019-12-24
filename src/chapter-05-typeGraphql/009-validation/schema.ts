/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Field, ObjectType, InputType, Arg } from "type-graphql";
import { MaxLength, validateSync } from "class-validator";

@ObjectType()
class Message {
    @Field()
    @MaxLength(5)
    contents!: string;
}

@InputType()
class CreateMessageInput {
    @Field()
    @MaxLength(5)
    contents!: string;
}

class RootSchema {
    // CreateMessageInput의 유효성이 false로 평가되면,
    // 아래의 쿼리가 일절 실행되지 않는다.
    @Query((type) => Message)
    echoMessage(@Arg("input", () => CreateMessageInput) input: CreateMessageInput) {
        let newMessage: Message = {
            contents: input.contents
        };
        return newMessage;
    }

    // 아래의 쿼리는 Message의 유효성이 false이지만 정상적으로 값이 반환된다.
    // 유효성을 검사해야된다면 수동으로 직접 검사해야한다.
    @Query((type) => Message)
    testMessage(): Message {
        // 아래의 코드는 에러를 검출할 수 없다.
        // 생성자로 객체를 만들고 값을 할당해야 한다.
        //
        // Wrong :
        // let testMessage: Message = {
        //     contents: "1234567890"
        // };
        //
        let testMessage: Message = Object.assign(new Message(), {
            contents: "1234567890"
        });

        let errors = validateSync(testMessage);
        if (errors.length) {
            // maxLength:"contents must be shorter than or equal to 5 characters"
            //
            console.warn("Some errors were detected.");
        }
        return testMessage;
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
