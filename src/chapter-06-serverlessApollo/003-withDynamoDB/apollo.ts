// TypeGraphQL 데코레이터를 만나기 이전에,
// 반드시 "reflect-metadata"를 import해야 한다.
//
import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { Arg, buildSchemaSync, Field, MiddlewareFn, Query, UseMiddleware, ObjectType, Int } from "type-graphql";
import AWS from "aws-sdk";
import { BatchWriteItemInput } from "aws-sdk/clients/dynamodb";

// isAbstract 옵션은
// 같은 이름으로 여러번 등록되는 것을 막아준다.
//
@ObjectType({ isAbstract: true })
export class Post {
    @Field(() => String)
    id!: string;

    @Field(() => String)
    contents!: string;
}

//소요된 시간을 출력하는 TypeGraphQL Middleware.
// @see chapter-05/014
//
const ElapsedTimeFn: MiddlewareFn<any> = async ({ info }, next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    const elapsed = end - start;
    console.log(`${info.parentType.name}.${info.fieldName} [${elapsed} ms]`);
};

const conn = new AWS.DynamoDB();

class RootResolver {
    @Query(() => Post, { nullable: true })
    @UseMiddleware(ElapsedTimeFn)
    async getPost(@Arg("id", () => String) id: string) {
        let getItemResult = await conn
            .getItem({
                TableName: "Post",
                Key: {
                    id: {
                        S: id
                    }
                }
            })
            .promise();

        let item = getItemResult.Item;
        if (item) {
            return Object.assign(new Post(), {
                id: id,
                contents: item.contents.S
            });
        } else return null;
    }

    @Query(() => [Post])
    @UseMiddleware(ElapsedTimeFn)
    async allPost() {
        let scanResult = await conn
            .scan({
                TableName: "Post"
            })
            .promise();

        let items = scanResult.Items;
        console.log("read length: ", items?.length);
        return items?.map((v) => {
            return Object.assign(new Post(), {
                id: v.id.S,
                contents: v.contents.S
            });
        });
    }

    @Query(() => Boolean)
    @UseMiddleware(ElapsedTimeFn)
    async putSamplePost(
        @Arg("srt", () => Int) srt: number,
        @Arg("end", () => Int) end: number
    ) {
        // 샘플 데이터 생성
        //
        let samples: Post[] = [];
        for (let i = srt; i < end; i++) {
            samples.push({
                id: i.toString(),
                contents: i.toString()
            });
        }

        // 25건씩 나누어 PutRequest 객체로 매핑
        //
        let batchWriteInputs = new Array<BatchWriteItemInput>();
        for (let srt = 0; true; srt += 25) {
            let smallSample = samples.slice(srt, srt + 25);
            if (smallSample.length == 0) break;

            let batchWriteInput: AWS.DynamoDB.Types.BatchWriteItemInput = {
                RequestItems: {
                    Post: []
                }
            };
            smallSample.forEach(sample => {
                batchWriteInput.RequestItems.Post.push({
                    PutRequest: {
                        Item: {
                            id: { S: sample.id },
                            contents: { S: sample.contents }
                        }
                    }
                });
            });
            batchWriteInputs.push(batchWriteInput);
        }

        // 병렬로 데이터 삽입
        //
        for (let i = 0; i < batchWriteInputs.length; i++) {
            conn.batchWriteItem(batchWriteInputs[i]).promise();
        }
        // Promise.all(batchWriteInputs.map((chunk) => conn.batchWriteItem(chunk).promise())).catch(console.error);
        return true;
    }
}

const schema = buildSchemaSync({
    resolvers: [RootResolver]
});

const apolloServer = new ApolloServer({ schema, playground: true, introspection: true });
export const handler = apolloServer.createHandler();
