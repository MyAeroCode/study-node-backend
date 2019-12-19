import { User } from "./User";
import { IsNumber } from "class-validator";
import { TypeGuard } from "../../common/TypeGuard";

export class Like {
    @TypeGuard(User)
    who!: User;

    @IsNumber()
    when!: number;
}
