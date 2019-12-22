import AWS from "aws-sdk";

export let conn = new AWS.DynamoDB({
    region: "ap-northeast-2",
    endpoint: "http://localhost:8000"
});
