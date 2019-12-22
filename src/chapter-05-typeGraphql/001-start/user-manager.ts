import { User, UserIdentifierArgs, UserInformationArgs } from "./user";
import Maybe from "graphql/tsutils/Maybe";

export class UserManager {
    private users = new Map<string, User>();

    getUser(args: UserIdentifierArgs): Maybe<User> {
        return this.users.get(args.name);
    }

    delUser(args: UserIdentifierArgs): boolean {
        return this.users.delete(args.name);
    }

    putUser(args: UserInformationArgs): boolean {
        if (!this.users.has(args.name)) {
            this.users.set(args.name, {
                name: args.name,
                age: args.age,
                friends: []
            });
            return true;
        }
        return false;
    }
}
