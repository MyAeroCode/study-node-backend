import { User } from "./User";
import { IsNumber } from "class-validator";
import { TypeGuard } from "ts-type-guard";

export class Like {
    @TypeGuard.GuardObject(User)
    who!: User;

    @IsNumber()
    when!: number;
}
