import { APIGatewayEvent } from "aws-lambda";

export const hello = async (event: APIGatewayEvent) => {
    return {
        statusCode: 200,
        body: `
            Hello, World!
            With Serverless Framework!
        `
    };
};
