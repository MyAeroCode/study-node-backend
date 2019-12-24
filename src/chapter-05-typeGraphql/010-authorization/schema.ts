/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Field, ObjectType, InputType, Arg, Authorized, AuthChecker } from "type-graphql";

@ObjectType()
class Data {
    @Field()
    publicField!: string;

    @Authorized()
    @Field()
    authorizedField!: string;

    @Authorized("ADMIN")
    @Field()
    adminField!: string;

    @Authorized(["ADMIN", "MODERATOR"])
    @Field({ nullable: true })
    hiddenField?: string;
}

class RootSchema {
    @Query()
    publicQuery(): Data {
        return {
            publicField: "public data",
            authorizedField: "user only",
            adminField: "admin only"
        };
    }

    @Authorized()
    @Query()
    authedQuery(): string {
        return "Authorized users only!";
    }

    @Authorized("ADMIN", "MODERATOR")
    @Query()
    adminQyert(): string {
        return "You are an admin/moderator, you can safely drop the database ;)";
    }
}

// 권한기능을 사용하려면 권한체커를 정의해야 한다.
// 그 뒤에 완성된 권한체커를 스키마로 전달한다.
const myAuthChecker: AuthChecker<any> = ({ root, args, context, info }, roles: string[]) => {
    // 데코레이터로 지정한 권한정보가 roles로 전달된다.
    // context에서 유저정보를 읽고 roles와 비교하여 boolean을 반환해야 한다.
    return false;
};
export const schema = buildSchemaSync({
    resolvers: [RootSchema],
    authChecker: myAuthChecker
});
