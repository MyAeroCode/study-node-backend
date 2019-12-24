import { User } from "./user-type";
import Container, { Service, Inject } from "typedi";

// 유저 샘플 데이터를 "USER_SAMPLE_DATA"라는 이름으로 컨테이너에 등록하고,
// UserDataHolder의 데이터 필드에 주입한 뒤,
// UserDataHolder를 다른 파일에도 주입할 수 있도록 Conainter.import로 등록한다.
//
let userSampleData: User[] = [
    {
        name: "Yi",
        age: 23
    },
    {
        name: "Park",
        age: 27
    },
    {
        name: "Han",
        age: 19
    }
];
Container.set("USER_SAMPLE_DATA", userSampleData);

@Service()
export class UserDataHolder {
    @Inject("USER_SAMPLE_DATA")
    data!: User[];
}
Container.import([UserDataHolder]);
