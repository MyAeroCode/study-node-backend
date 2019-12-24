/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Arg } from "type-graphql";
import { Container, Service, Inject } from "typedi";
import { User } from "./user-type";
import { UserService } from "./user-service";

// 다른 파일에서 선언된 UserService 객체를 주입한다.
// 이것으로 의존성의 역전이 발생하여, 비즈니스 로직과 모델을 분리시킬 수 있다.
//
// 먼저 주입가능한 클래스는 Service 데코레이터를 붙여서 선언하고,
// 다른 파일에서도 이용할 수 있게 하려면 Container.import([CLASS_NAME, ...])에 전달해야 한다.
//
// 클래스가 아닌 다른 객체를 주입하고 싶다면,
// Container.set(strkey, object), Container.get(strkey)을 사용한다.
//
// 마지막으로 스키마에 컨테이너를 전달해주어야만 사용할 수 있다.
//
@Service()
class RootSchema {
    @Inject()
    userService!: UserService;

    @Query(() => User, { nullable: true })
    getOne(@Arg("username", () => String) username: string) {
        let user = this.userService.getOne(username);
        return user;
    }

    @Query(() => [User])
    getAll() {
        let users: User[] = this.userService.getAll();
        return users;
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema],
    container: Container
});
