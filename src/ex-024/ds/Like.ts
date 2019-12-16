import { User } from "./User";

export class Like {
    public who: User;
    public when: number;
    constructor(who: User) {
        this.who = who;
        let max = 1675090800000; // 2022-12-31
        let min = 1485874800000; // 2017-01-01
        this.when = Math.floor(Math.random() * (max - min + 1) + min);
    }
}
