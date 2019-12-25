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

    // 50개씩 스캔한다.
    // lastEvaludatedKey가 undefined인 경우 스캔종료.
    // 다음 스캔의 startKey에 넘겨서 이어서 스캔할 수 있다.
    //
    let scanResult = mapper.scan(Cat, { limit: 50, startKey: undefined });
    for await (let item of scanResult) {
        console.log(item);
    }
    console.log("lastKey:", scanResult.pages().lastEvaluatedKey);
    console.log(scanResult.scannedCount);
}
