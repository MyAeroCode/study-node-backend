import { ObjectType, Field, ArgsType, Maybe } from "type-graphql";

/**
 * ObjectType 데코레이터는 GraphQL ObjectType으로 선언한 것과 같다.
 *
 * 1. Field에서 프리미티브 타입은 명시적으로 타입을 적지 않아도 된다.
 *    반환형이 리스트인 경우에는 []으로 감싼다.
 *
 * 2. 옵션을 지정할 수 있다.
 *    nullable, defaultValue
 */
// 유저 객체.
@ObjectType()
export class User {
    @Field()
    name!: string;

    @Field()
    age!: number;

    @Field(() => User, { nullable: true })
    bestFriend?: User;

    @Field(() => [User], { defaultValue: [] })
    friends!: User[];
}

/**
 * ArgsType 데코레이터는 GraphQL InputType으로 선언한 것과 같다.
 *
 */
// 하나의 유저를 식별가능한 파라미터 조합.
@ArgsType()
export class UserIdentifierArgs {
    @Field()
    name!: string;
}
// 하나의 유저를 만들 수 있는 파라미터 조합.
@ArgsType()
export class UserInformationArgs {
    @Field()
    name!: string;

    @Field()
    age!: number;
}
