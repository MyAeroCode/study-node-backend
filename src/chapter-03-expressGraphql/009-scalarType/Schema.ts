import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLScalarType,
    GraphQLInt,
    GraphQLList
} from "graphql";

/**
 * RGB의 채널값 3개가 담긴 배열을 전달받아,
 * HEX 문자열로 반환한다.
 */
function arr2str(arr: number[]): string {
    if (arr.length != 3) {
        throw Error(`arr length is must 3, but got ${arr.length}`);
    }
    let hex: string = "#";
    for (let i = 0; i < 3; i++) {
        let channel = arr[i].toString(16);
        if (channel.length == 1) hex += "0" + channel;
        else if (channel.length == 2) hex += channel;
        else throw Error(`${arr[i]} is not 0~255`);
    }
    return hex;
}

/**
 * RGB HEX 문자열을 전달받아,
 * 채널값 3개가 담긴 배열로 반환한다.
 */
function str2arr(str: string): number[] {
    if (!/^#[0-9a-f]{6}$/.test(str)) {
        throw Error(`${str} is not hex RGB`);
    }
    let arr: number[] = [];
    arr.push(parseInt(str.substring(1, 3), 16));
    arr.push(parseInt(str.substring(3, 5), 16));
    arr.push(parseInt(str.substring(5, 7), 16));
    return arr;
}

/**
 * RGB 값을 대표하는 스칼라 타입.
 *
 * 내부적 표현 : number[3]
 * 외부적 표현 : hex string
 */
let RGB = new GraphQLScalarType({
    name: "RGB",
    /**
     * 내부적인 데이터(number[3])을 이용하여,
     * 사용자에게 외부적인 데이터(string)로 전송한다.
     *
     * 굳이 문자열이 아니더라도 상관없다.
     * e.g) 바이너리, 숫자, 불리언
     */
    serialize: (value: any) => {
        console.log("serialize");
        return arr2str(value);
    },

    /**
     * 외부적인 데이터를 내부적인 데이터로 반환해야 한다.
     * parseLiteral과 같은 값을 반환해야 한다.
     *
     * 사용자가 queryVariables를 통해 변수를 선언했을 때 호출된다.
     */
    parseValue: (value: any) => {
        console.log("parseValue");
        return str2arr(value);
    },

    /**
     * 외부적인 데이터를 내부적인 데이터로 반환해야 한다.
     * parseValue와 같은 값을 반환해야 한다.
     *
     * 사용자가 query를 통해 변수를 선언했을 때 호출된다.
     */
    parseLiteral: (valueAST: any) => {
        console.log("parseLiteral");
        return str2arr(valueAST.value);
    }
});

let query = new GraphQLObjectType({
    name: "scalarTestQuery",
    fields: {
        arr2rgb: {
            type: RGB,
            args: {
                arr: {
                    type: new GraphQLList(GraphQLInt)
                }
            },
            resolve: (parent, args) => {
                return args.arr;
            }
        },

        /**
         * RGB 객체는 내부적으로 number[3]이므로,
         * [int]로 반환할 수 있다.
         */
        rgb2arr: {
            type: new GraphQLList(GraphQLInt),
            args: {
                rgb: {
                    type: RGB
                }
            },
            resolve: (parent, args) => {
                return args.rgb;
            }
        }
    }
});

let schema = new GraphQLSchema({
    query: query
});

export default schema;
