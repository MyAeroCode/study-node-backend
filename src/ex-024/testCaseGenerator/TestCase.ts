import LoLChampions from "./championData";
import LoremIpsum from "./LoremIpsumData";
import { User } from "../ds/User";
import { Post } from "../ds/Post";
import { Like } from "../ds/Like";
import { shuffle } from "../schema/commonLibrary";

const userSize: number = 70;
const postSize: number = 100;

class TestCase {
    public userList: User[];
    public postList: Post[];
    constructor(userSize: number, postSize: number) {
        if (userSize < 0 || LoLChampions.length < userSize)
            throw new Error(`userSize is ${0}~${LoLChampions.length}`);
        if (postSize < 0 || LoremIpsum.length < postSize)
            throw new Error(`postSize is ${0}~${LoLChampions.length}`);
        this.userList = [];
        this.postList = [];

        shuffle<string>(LoLChampions)
            .slice(0, userSize)
            .forEach(name => {
                this.userList.push(new User(name));
            });

        shuffle<string>(LoremIpsum)
            .slice(0, postSize)
            .forEach((title, idx) => {
                let author = this.userList[idx % this.userList.length];
                let likeThisPostCnt =
                    Math.floor(Math.random() * 1000) % userSize;
                let likeList = shuffle<User>(this.userList)
                    .slice(0, likeThisPostCnt)
                    .map(user => {
                        return new Like(user);
                    });
                this.postList.push(new Post(title, author, likeList));
            });
    }
}

const testCase = new TestCase(userSize, postSize);
export default testCase;
