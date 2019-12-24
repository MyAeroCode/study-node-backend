import { User } from "./user-type";
import { Container, Service, Inject } from "typedi";
import { UserDataHolder } from "./user-samples";

@Service()
export class UserService {
    // 샘플 데이터를 Conainter를 통해 주입시킨다.
    //
    @Inject()
    private dataHolder!: UserDataHolder;

    getOne(username: string): User | undefined {
        for (let user of this.dataHolder.data) {
            if (user.name == username) return user;
        }
        return undefined;
    }

    getAll(): User[] {
        return this.dataHolder.data;
    }
}
Container.import([UserService]);
