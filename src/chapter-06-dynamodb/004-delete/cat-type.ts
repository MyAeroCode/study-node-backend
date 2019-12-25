import { hashKey, table } from "@aws/dynamodb-data-mapper-annotations";

// table 데코레이터에 테이블명을 적고,
// 해시키와 범위키에 각각 hasKey, rangeKey 데코레이터를 붙인다.
//
@table("cat")
export class Cat {
    @hashKey()
    name!: string;
}
