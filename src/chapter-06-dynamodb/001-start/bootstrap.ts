import DynamoDB from "aws-sdk/clients/dynamodb";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import { Cat } from "./ds";

export default async function bootstrap() {
    const mapper = new DataMapper({
        client: new DynamoDB({ region: "ap-northeast-2", endpoint: "http://localhost:8000" }),
        tableNamePrefix: "dev_"
    });

    const garfield: Cat = Object.assign(new Cat(), { name: "garfield" });
    let putResult = await mapper.put<Cat>(garfield);
    let getResult = await mapper.get<Cat>(garfield);
    console.log("put:", putResult);
    console.log("get:", getResult);
}
