import { User } from "./User";
import { TypeGuard } from "../../common/typeGuard";
import { IsNumber } from "class-validator";

export class Like {
    @TypeGuard(new User())
    who!: User;

    @IsNumber()
    when!: number;
}
