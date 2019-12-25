/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import {
    buildSchemaSync,
    Query,
    Field,
    Arg,
    Int,
    InputType,
    MiddlewareFn,
    UseMiddleware,
    MiddlewareInterface, ResolverData, NextFn
} from "type-graphql";

// 미들웨어 함수의 기본형태는 async (resolverInfo<TContext>, next) => any.
// next를 호출하면 다음 미들웨어나 리졸버의 결과값을 가져올 수 있다.
// 반대로 next를 호출하지 않으면, 다음 미들웨어나 리졸버로 이행되지 않으며 이것을 guard라고 부른다.
// resolverInfo.args를 수정하면 다음 미들웨어나 리졸버에 영향을 끼친다.
//

// 시간측정 미들웨어.
//
const ElapsedTimeFn: MiddlewareFn<any> = async ({ info }, next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    const elapsed = end - start;
    console.log(`${info.parentType.name}.${info.fieldName} [${elapsed} ms]`);

    // 리턴문이 존재하지 않는경우,
    // 처음으로 리턴을 수행한 미들웨어나 리졸버의 값이 클라이언트에게 전달된다.
    //
    // 단, 리졸버의 반환형과 같아야 하며.
    // 어느 미들웨어나 리졸버도 값을 반환하지 않았다면 클라이언트에게 null이 반환된다.
    //
};

@InputType()
class ThresholdInput {
    @Field(() => Int)
    num!: number;

    @Field(() => Int)
    thrshold!: number;
}

// 경계값 미들웨어.
// 경계값과 숫자를 비교하여 숫자가 경계값보다 작다면 0 크거나 같다면 1을 반환한다.
//
const ThresholdFn: MiddlewareFn<any> = async ({ args }, next) => {
    let input: ThresholdInput = args.input;
    if (input.num < input.thrshold) input.num = 0;
    else input.num = 1;

    // 아래의 2개 리턴문중 어느것을 사용해도 결과는 같지만,
    // next를 사용하지 않으면 리졸버가 실행되지는 않는다.
    //
    // return input.num;
    // return next();
    //
    return next();
};

class ErrorInterceptor implements MiddlewareInterface<any> {
    async use(data: ResolverData<any>, next: NextFn) {
        try {
            // 반드시 await를 붙일 것.
            // 붙이지 않으면 프로마이즈로 평가된다.
            //
            return await next();
        } catch (e) {
            console.error("Error Detected.");
            return false;
        }
    }
}

class RootSchema {
    // 리졸버에 UserMiddleware 데코레이터를 붙여서
    // 미들웨어를 부착한다.
    //
    @Query(() => Int)
    @UseMiddleware(ErrorInterceptor, ThresholdFn)
    threshold(@Arg("input", () => ThresholdInput) input: ThresholdInput) {
        return input.num;
    }

    @Query(() => Boolean)
    @UseMiddleware([ErrorInterceptor])
    errorTest() {
        throw new Error("Custom ERROR");
    }
}

// 스키마에 미들웨어를 넣으면
// 해당 미들웨어는 전역으로 사용된다.
//
export const schema = buildSchemaSync({
    resolvers: [RootSchema],
    globalMiddlewares: [ElapsedTimeFn]
});
