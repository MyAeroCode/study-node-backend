import DynamoDB from "aws-sdk/clients/dynamodb";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import { samples } from "./cat-samples";
import { Cat } from "./cat-type";

export default async function bootstrap() {
    // tableNamePrefix를 선언하여 개발용과 라이브를 구분한다.
    //
    const mapper = new DataMapper({
        client: new DynamoDB({ region: "ap-northeast-2", endpoint: "http://localhost:8000" }),
        tableNamePrefix: "dev_"
    });


    // Batch Put
    //
    let remainSamples = new Map<string, Cat>([...samples.entries()]);
    for await (let persisted of mapper.batchPut([...samples.values()])) {
        // 삽입에 성공한 아이템.
        //
        remainSamples.delete(persisted.name);
    }
    if (remainSamples.size != 0) {
        console.error("Failed to put... :", remainSamples.size);
        for (let fail of samples) {
            // 아직도 남아있다면 실패한 것이다.
            //
            console.error(fail);
        }
    }

    // Batch Get
    for await(let item of mapper.batchGet([...samples.values()])) {
        // 조회에 성공한 아이템.
        //
        console.log("read", item);
    }
}
