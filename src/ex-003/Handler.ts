import { APIGatewayEvent, Context } from "aws-lambda";

/**
 * Lambda Context의 정보를 반환한다.
 * 오프라인에서 Context는 빈 객체임에 유의.
 */
export const returnContext = async (
    event: APIGatewayEvent,
    context: Context
) => {
    return JSON.stringify(context, null, 4);
};
