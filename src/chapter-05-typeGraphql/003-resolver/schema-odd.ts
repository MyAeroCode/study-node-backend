/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { ObjectType, Field, Resolver, FieldResolver, Root, ArgsType, Args, Ctx } from "type-graphql";

@ArgsType()
class ClearArgs {
    @Field()
    clear!: boolean;
}

@ObjectType()
class OddNumber {
    @Field()
    value!: number;

    // Root 데코레이터로 선언된 변수는 source 임을 나타낸다.
    // Args 데코레이터로 선언된 변수는 args중 일부임을 나타낸다.
    // Ctx 데코레이터로 선언된 변수는 context 임을 나타낸다.
    // ResolverFunc(source, args, context, resoverInfo)의 그것이다.
    //
    // Root, Args, Ctx 데코레이터는 여러개가 쓰일 수 있으며,
    // Root로 쓰인 각각의 매개변수는 독립된 객체로 작동하고, (Ctx도 마찬가지)
    // Args로 쓰인 각각의 매개변수는 독립되어있지만, 클라이언트 입장에서는 하나의 input으로 작동한다.
    @Field(() => OddNumber, { nullable: true })
    nextNumber?(@Root() source: OddNumber, @Root() sourceClone: OddNumber, @Args() clear: ClearArgs, @Ctx() context: any) {
        sourceClone.value += 3;
        // always false.
        if (sourceClone.value != source.value) {
            console.log("not eqauls");
        }

        let nextValue = clear.clear ? 1 : source.value + 2;
        return {
            value: nextValue
        };
    }
}

@ObjectType()
export class OddNumberQuery {
    @Field((type) => OddNumber)
    getFirst(): OddNumber {
        return {
            value: 1
        };
    }
}
