import { IsString, IsBoolean, IsNumber, IsOptional } from "class-validator";
import { base64encode } from "./Library";
import { TypeGuard } from "ts-type-guard";

export class User {
    @IsString()
    name!: string;
}

export class UserEdge {
    @TypeGuard.GuardObject(User)
    node!: User;

    getCursor(): string {
        return base64encode(
            JSON.stringify({
                name: {
                    S: this.node.name
                }
            })
        );
    }
}

export class UserPageInfo {
    @IsOptional()
    @IsString()
    after?: string;

    @IsBoolean()
    hasNextPage!: boolean;
}

export class UserConnection {
    @IsNumber()
    totalCount!: number;

    @IsNumber()
    scannedCount!: number;

    @TypeGuard.GuardArray(UserEdge)
    edges!: UserEdge[];

    @TypeGuard.GuardObject(UserPageInfo)
    pageInfo!: UserPageInfo;
}

export class ConnectionArgs {
    @IsNumber()
    get!: number;

    @IsOptional()
    @IsString()
    after?: string;
}
