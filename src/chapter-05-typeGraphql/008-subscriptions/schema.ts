/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Field, ObjectType, InputType, Arg, Subscription, Root, Mutation, PubSub, PubSubEngine } from "type-graphql";

@ObjectType()
class Message {
    @Field()
    contents!: string;

    @Field()
    whenSended!: number;
}

@InputType()
class CreateMessageInput {
    @Field()
    contents!: string;
}

class RootSchema {
    @Subscription({
        topics: "message" // single topic
        // topics: ["message", "err"],
        // topics: ({args, payload, context})=>args.topic
        // filter: ({ payload, args }) => true
    })
    listenMessage(@Root() message: Message): Message {
        return message;
    }

    @Mutation((type) => Message)
    async createMessage(@Arg("input", () => CreateMessageInput) input: CreateMessageInput, @PubSub() pubsub: PubSubEngine) {
        let newMessage: Message = {
            contents: input.contents,
            whenSended: Date.now()
        };
        await pubsub.publish("message", newMessage);
        return newMessage;
    }

    @Query()
    hello(): string {
        return "Hello, World!";
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
