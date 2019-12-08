import { APIGatewayEvent } from "aws-lambda";

// Hello, World!를 출력한다.
// GET 형식의 쿼리 문자열이 있다면,
// 쿼리 문자열의 이름과 값을 한 줄씩 차례대로 적는다.
// 쿼리 문자열이 없다면 안내 메시지를 함께 출력한다.
export const echo = async (event: APIGatewayEvent) => {
    let paramMap = event.queryStringParameters;
    let message = ["Hello, World!"];

    if (paramMap != null) {
        Object.keys(paramMap)
            .map(key => `${key} : ${paramMap!![key]}`)
            .forEach(str => {
                message.push(str);
            });
    } else {
        message.push("입력된 쿼리 문자열이 없습니다.");
    }

    return {
        statusCode: 200,
        body: message.join("\n")
    };
};
