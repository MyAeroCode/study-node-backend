import { IsString, IsBoolean, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { base64encode } from "./Library";

export class User {
    @IsString()
    name!: string;
}

export class UserEdge {
    @ValidateNested()
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

    @ValidateNested()
    edges!: UserEdge[];

    @ValidateNested()
    pageInfo!: UserPageInfo;
}

export class ConnectionArgs {
    @IsNumber()
    get!: number;

    @IsOptional()
    @IsString()
    after?: string;
}
