import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./Schema";
import {
    fieldConfigEstimator,
    getComplexity,
    simpleEstimator
} from "graphql-query-complexity";
import { separateOperations } from "graphql";

// TypeGraphQL에서 복잡도 기능을 사용하려면 fieldConfigEstimator를 사용해야 한다.
// 하지만 deprecated 되었으므로, 엄청난 경고창이 발생한다...
//
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
        },
        // Create a plugin that will allow for query complexity calculation for every request
        plugins: [
            {
                requestDidStart: () => ({
                    didResolveOperation({ request, document }) {
                        const complexity = getComplexity({
                            // Our built schema
                            schema,
                            // To calculate query complexity properly,
                            // we have to check if the document contains multiple operations
                            // and eventually extract it operation from the whole query document.
                            query: request.operationName
                                ? separateOperations(document)[request.operationName]
                                : document,
                            // The variables for our GraphQL query
                            variables: request.variables,
                            // Add any number of estimators. The estimators are invoked in order, the first
                            // numeric value that is being returned by an estimator is used as the field complexity.
                            // If no estimator returns a value, an exception is raised.
                            estimators: [
                                fieldConfigEstimator(),
                                simpleEstimator({ defaultComplexity: 1 })
                            ]
                        });
                        // Here we can react to the calculated complexity,
                        // like compare it with max and throw error when the threshold is reached.
                        let maxComplexity = 5;
                        if (complexity >= maxComplexity) {
                            throw new Error(
                                `Sorry, too complicated query! ${complexity} is over ${maxComplexity} that is the max allowed complexity.`
                            );
                        }
                        // And here we can e.g. subtract the complexity point from hourly API calls limit.
                        console.log(complexity);
                    }
                })
            }
        ]
    });
    apollo.applyMiddleware({ app, path: "/" });

    app.listen(4000, () => {
        console.log(`🚀 Server ready at http://localhost:${4000}${apollo.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${4000}${apollo.subscriptionsPath}`);
    });
}
