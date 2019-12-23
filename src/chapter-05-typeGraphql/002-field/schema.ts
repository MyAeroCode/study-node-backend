/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, ObjectType, Field } from "type-graphql";

type Nullable<T> = T | null;

@ObjectType()
class FieldTest {
    @Field()
    // 또는 Field((type)=>Number)
    // 프리미티브 타입은 반환형을 데코레이터에 구체적으로 명시하지 않아도 괜찮다.
    // nullable 옵션을 지정하지 않으면 NonNull으로 설정된다.
    //
    // type : Float!
    field(): number {
        return 1;
    }

    @Field((type) => Number, { nullable: true })
    // 또는 Field({nullable: true})
    // 프리미티브 타입은 반환형을 데코레이터에 구체적으로 명시하지 않아도 괜찮다.
    //
    // type : Float
    nullableField(): Nullable<number> {
        return null;
    }

    @Field((type) => [Number])
    // 리스트를 반환한다면,
    // 반환형을 데코레이터에 구체적으로 명시해야 한다.
    //
    // type : [Float!]!
    list(): number[] {
        return [1, 2, 3];
    }

    @Field((type) => [Number], { nullable: true })
    // 리스트를 반환한다면,
    // 반환형을 데코레이터에 구체적으로 명시해야 한다.
    // 반환형이 nullable로 변경되므로 리스트 자체가 null을 허용한다.
    //
    // type : [Float!]
    nullableList(): Nullable<number[]> {
        return null;
    }

    @Field((type) => [Number], { nullable: "items" })
    // nullable : "items" 이라면,
    // 내부에 담긴 아이템들이 nullable이 된다.
    //
    // type : [Float]!
    nullableItems(): Nullable<number>[] {
        return [1, 2, null, 4, 5];
    }

    @Field((type) => [Number], { nullable: "itemsAndList" })
    // nullable : "itemsAndList" 이라면,
    // 내부에 담긴 아이템들과 리스트까지 nullable이 된다.
    //
    // type : [Float]
    nullableItemsAndList(): Nullable<Nullable<number>[]> {
        return null;
    }

    @Field((type) => [[Number]])
    // 다차원 배열을 선언할 때는 위처럼 한다.
    // 아무런 nullable 옵션을 지정하지 않으면 NonNull이 된다.
    //
    // type : [[Float!]!]!
    depth2(): number[][] {
        return [
            [1, 2, 3],
            [4, 5, 6]
        ];
    }

    @Field((type) => [[Number]], { nullable: "items" })
    // nullable : "items" 이라면,
    // 내부에 담긴 아이템들이 nullable이 된다.
    // 만약 아이템이 재귀적 형태를 가지고 있다면, 전부 nullable이 된다.
    //
    // type : [[Float]]!
    nullableDepth2(): Nullable<Nullable<number>[]>[] {
        return [[1, 2, 3], null, [7, 8, 9]];
    }
}

class TestSchemaResolver {
    @Query((type) => FieldTest)
    test() {
        return FieldTest;
    }
}

export const schema = buildSchemaSync({
    resolvers: [TestSchemaResolver]
});
