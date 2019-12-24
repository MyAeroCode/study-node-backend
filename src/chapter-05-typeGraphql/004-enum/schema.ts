/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, registerEnumType, Field, ObjectType, Args, InputType, Arg } from "type-graphql";

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}
registerEnumType(Direction, {
    name: "Direction", // mandatory
    description: "The basic directions" // optioanl
});

@InputType()
class DirectionInput {
    @Field((type) => Direction)
    direction!: Direction;
}

@InputType()
class MapInput {
    @Field()
    x!: number;

    @Field()
    y!: number;
}

class RootSchema {
    @Query(() => String)
    printDirection(@Arg("dir", () => Direction) dir: Direction, @Arg("map", () => MapInput) map: MapInput) {
        switch (dir) {
            case Direction.UP: {
                map.y++;
                break;
            }
            case Direction.DOWN: {
                map.y--;
                break;
            }
            case Direction.LEFT: {
                map.x--;
                break;
            }
            case Direction.RIGHT: {
                map.y++;
                break;
            }
        }
        return `x: ${map.x}, y: ${map.y}`;
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
