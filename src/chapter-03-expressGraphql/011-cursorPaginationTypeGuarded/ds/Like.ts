import { User } from "./User";
import { IsNumber, ValidateNested } from "class-validator";

export class Like {
    @ValidateNested()
    who!: User;

    @IsNumber()
    when!: number;
}
