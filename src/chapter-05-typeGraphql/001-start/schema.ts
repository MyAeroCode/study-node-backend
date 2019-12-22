/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";

import { buildSchemaSync } from "type-graphql";
import { UserMutation, UserQuery } from "./user-schema";

export const schema = buildSchemaSync({
    resolvers: [UserQuery, UserMutation]
});
