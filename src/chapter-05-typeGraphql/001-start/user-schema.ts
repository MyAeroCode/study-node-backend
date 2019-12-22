import { UserManager } from "./user-manager";
import { User, UserIdentifierArgs, UserInformationArgs } from "./user";
import { Query, Args, Mutation, Field, ObjectType, ClassType } from "type-graphql";

const manager = new UserManager();

/**
 * Query 또는 Mutation으로 선언된 필드는 모두 최상위에 등록되므로,
 * 각각의 명령어들을 하나의 ObjectType으로 묶어서 하나씩만 최상위에 등록되도록 한다.
 */
// 최상위에 등록될 쿼리.
export class UserQuery {
    @Query(() => UserQuery_)
    user() {
        return UserQuery_;
    }
}
// 최상위에 등록될 뮤테이션.
export class UserMutation {
    @Mutation(() => UserMutation_)
    user() {
        return UserMutation_;
    }
}

// 유저 쿼리에 등록될 명령어의 집합.
@ObjectType()
class UserQuery_ {
    @Field(() => User, { nullable: true })
    getUser(@Args() args: UserIdentifierArgs): User {
        return manager.getUser(args)!!;
    }
}
// 유저 뮤테이션에 등록될 명령어의 집합.
@ObjectType()
class UserMutation_ {
    @Field()
    putUser(@Args() args: UserInformationArgs): boolean {
        return manager.putUser(args);
    }

    @Field()
    delUser(@Args() args: UserIdentifierArgs): boolean {
        return manager.delUser(args);
    }
}
