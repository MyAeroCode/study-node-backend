/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Field, ObjectType, Arg, ArgsType, Resolver, Int, InputType, FieldResolver } from "type-graphql";

// extends를 사용하여 일반적인 상속과 동일하게 코딩한다.
// isAbstract는 해당 오브젝트가 스키마에 등록하지 않도록 만든다.
//
@InputType({ isAbstract: true })
class BaseInput {
    @Field(() => Int)
    baseInputField!: number;
}
@InputType()
class SuperInput extends BaseInput {
    @Field(() => Int)
    superInputField!: number;
}
@ObjectType({ isAbstract: true })
class BaseObject {
    @Field(() => Int)
    baseObjectField!: number;
}
@ObjectType()
class SuperObject extends BaseObject {
    @Field(() => Int)
    superObjectField!: number;
}
@Resolver((of) => BaseObject, { isAbstract: true })
abstract class BaseResolver {
    @FieldResolver(() => Int)
    baseObjectField() {
        return 1;
    }
}
@Resolver((of) => SuperObject)
class SuperResolver extends BaseResolver {
    @FieldResolver(() => Int)
    superObjectField() {
        return 100;
    }
}

class RootSchema {
    @Query(() => SuperObject)
    test(@Arg("input", () => SuperInput) input: SuperInput): SuperObject {
        console.log(` baseInputField : ${input.baseInputField}`);
        console.log(`superInputField : ${input.superInputField}`);

        // 입력으로 받은 인자를 그대로 반환(echo)하도록 했지만,
        // 필드 리졸버에 의해 항상 {1, 100}이 반환된다.
        //
        return {
            baseObjectField: input.baseInputField,
            superObjectField: input.superInputField
        };
    }
}
export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
