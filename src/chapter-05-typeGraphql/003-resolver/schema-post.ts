/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { ObjectType, Field, Resolver, FieldResolver, Root } from "type-graphql";

@ObjectType()
class Post {
    @Field()
    title!: string;

    @Field()
    author!: string;

    @Field(() => Post, { nullable: true })
    prevPost?: Post;
}

// Resolver 데코레이션을 사용하면,
// 주어진 ObjectType의 필드를 리졸브할 수 있다.
// 여기서는 PostResolver에 선언된 각각의 필드 리졸버가 Post의 필드를 리졸브한다.
@Resolver((of) => Post)
class PostResolver {
    @FieldResolver(() => String)
    title(): string {
        return "Hello, World!";
    }

    @FieldResolver(() => String)
    author(): string {
        return "AeroCode";
    }

    @FieldResolver(() => Post, { nullable: true })
    prevPost(): Post | null {
        return null;
    }
}

@ObjectType()
export class PostQuery {
    @Field((type) => Post)
    testPost(): typeof Post {
        return Post;
    }
}
