import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./Schema";
import http from "http";

export default function bootstrap() {
    /**
     * Express에 아폴로 설치하기.
     * 아폴로 서버를 생성한 뒤, 원하는 위치에 미들웨어로 등록한다.
     */
    const app = express();
    const apollo = new ApolloServer({
        schema,
        subscriptions: {
            path: "/"
            // ... hook
        }
    });
    apollo.applyMiddleware({ app, path: "/" });

    /**
     * Express에 SubscriptionServer 설치하기,
     * 익스프레스를 httpServer로 변환한 뒤,
     * 아폴로를 통해 핸들러를 등록한다.
     */
    const httpServer = http.createServer(app);
    apollo.installSubscriptionHandlers(httpServer);

    httpServer.listen(4000, () => {
        console.log(`🚀 Server ready at http://localhost:${4000}${apollo.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${4000}${apollo.subscriptionsPath}`);
    });
}
