import { IsString, IsBoolean, IsNumber, IsOptional } from "class-validator";
import { TypeGuard, TypeGuardArray } from "../common/TypeGuard";
import { base64encode } from "../common/Library";

export class User {
    @IsString()
    name!: string;
}

export class UserEdge {
    @TypeGuard(User)
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

    @TypeGuardArray(UserEdge)
    edges!: UserEdge[];

    @TypeGuard(UserPageInfo)
    pageInfo!: UserPageInfo;
}

export class ConnectionArgs {
    @IsNumber()
    get!: number;

    @IsOptional()
    @IsString()
    after?: string;
}
