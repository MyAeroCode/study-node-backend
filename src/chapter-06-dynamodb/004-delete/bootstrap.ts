import DynamoDB from "aws-sdk/clients/dynamodb";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import { Cat } from "./cat-type";

export default async function bootstrap() {
    // tableNamePrefix를 선언하여 개발용과 라이브를 구분한다.
    //
    const mapper = new DataMapper({
        client: new DynamoDB({ region: "ap-northeast-2", endpoint: "http://localhost:8000" }),
        tableNamePrefix: "dev_"
    });

    // 아이템을 삭제한다.
    // 삭제된 경우, 그 아이템이 콜백으로 반환된다.
    // 없는 경우, undefined가 반환된다.
    //
    let scanResult: Cat | undefined = await mapper.delete<Cat>(Object.assign(new Cat(), { name: "cat_1577275174455_260" }));
    console.log(scanResult);
}
