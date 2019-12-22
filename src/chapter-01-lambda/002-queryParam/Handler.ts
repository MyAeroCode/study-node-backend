import { APIGatewayEvent } from "aws-lambda";

/**
 * 맨 처음 Hello, World!를 출력하고.
 * 그 다음 줄에는 HTTP Method(GET | POST)를 출력한다.
 *
 * 그 다음 줄 부터는 데이터의 이름과 값을 한 줄씩 출력하고,
 * 데이터가 없다면 "함께 보내진 데이터가 없습니다."를 출력한다.
 */
export const echo = async (event: APIGatewayEvent) => {
    let paramMap = event.queryStringParameters;
    let messages = [];
    messages.push("Hello, World!");
    messages.push(event.httpMethod);

    if (paramMap != null) {
        Object.keys(paramMap)
            .map(key => `${key} : ${paramMap!![key]}`)
            .forEach(str => {
                messages.push(str);
            });
    } else {
        messages.push("함께 보내진 데이터가 없습니다.");
    }

    return {
        statusCode: 200,
        body: messages.join("\n")
    };
};
