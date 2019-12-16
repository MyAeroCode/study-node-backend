import { User } from "./User";
import { Like } from "./Like";

export class Post {
    public title: string;
    public author: User;
    public liked: Like[];
    constructor(title: string, author: User, liked: Like[]) {
        this.title = title;
        this.author = author;
        this.liked = liked;
    }
}
