import { PubSub } from "apollo-server-express";
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLSchema } from "graphql";

const pubsub = new PubSub();

const evta = "eventA";
const evtb = "eventB";

/**
 * 구독에서 반환할 데이터 형식.
 * QL Object로 정의되어야 한다.
 */
const data = new GraphQLObjectType({
    name: "data",
    fields: {
        data: { type: GraphQLString }
    }
});

const subscription = new GraphQLObjectType({
    name: "subscription",
    fields: {
        [evta]: {
            /**
             * 구독의 반환형식을 지정해야하고,
             * subscribe 메서드는 asyncIterator를 반환해야 한다.
             *
             * publish된 값에서 이곳의 필드이름과 일치하는 속성의 데이터를 반환한다.
             * 즉, publish된 값 중 "eventA" | "eventB" | "all" 속성의 데이터를 반환한다.
             */
            type: data,
            subscribe: () => {
                return pubsub.asyncIterator([evta]);
            }
        },
        [evtb]: {
            type: data,
            subscribe: () => {
                return pubsub.asyncIterator([evtb]);
            }
        },
        all: {
            type: data,
            subscribe: () => {
                return pubsub.asyncIterator([evta, evtb]);
            }
        }
    }
});
const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        [evta]: {
            type: GraphQLBoolean,
            args: {
                msg: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (source, args) => {
                /**
                 * all 구독자는 "from a"가 담긴 데이터를,
                 * evta 구독자는 유저가 보낸 데이터를 받는다.
                 */
                pubsub.publish(evta, {
                    [evta]: { data: args.msg },
                    all: { data: "from a" }
                });
            }
        },
        [evtb]: {
            type: GraphQLBoolean,
            args: {
                msg: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (source, args) => {
                /**
                 * all 구독자는 "from b"가 담긴 데이터를,
                 * evtb 구독자는 유저가 보낸 데이터를 받는다.
                 */
                pubsub.publish(evtb, {
                    [evtb]: { data: args.msg },
                    all: { data: "from b" }
                });
            }
        }
    }
});
const query = new GraphQLObjectType({
    name: "helloApollo",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "hello!"
        }
    }
});
export const schema = new GraphQLSchema({
    query: query,
    mutation: mutation,
    subscription: subscription
});
