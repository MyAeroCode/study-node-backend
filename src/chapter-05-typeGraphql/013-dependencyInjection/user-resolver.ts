import { Query, Field, InputType, Args } from "type-graphql";
import { User } from "./user-type";
import Container, { Inject, Service } from "typedi";
import { UserService } from "./user-service";

@InputType()
class UserNameInput {
    @Field()
    username!: string;
}

// 다른 파일에서 선언된 UserService 객체를 주입하고,
// 다른 파일에서 UserResolver를 주입할 수 있도록 Conainter.import로 전달한다.
//
@Service()
export class UserResolver {
    @Inject()
    private service!: UserService;

    @Query(() => User, { nullable: true })
    getOne(@Args(() => UserNameInput) args: UserNameInput) {
        return this.service.getOne(args.username);
    }

    @Query(() => [User])
    getAll() {
        return this.service.getAll();
    }
}
Container.import([UserResolver]);
