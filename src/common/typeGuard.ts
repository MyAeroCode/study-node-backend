import {
    validateSync,
    registerDecorator,
    ValidationArguments
} from "class-validator";

/**
 * 해당 타입이 맞는지 검사하는 데코레이터.
 * 인자로 타입의 이름이나 생성자를 넘겨주어야 한다.
 *
 * class Data {
 *     ...
 * }
 * class Wrap {
 *     @TypeGuard(Data)
 *     data! :Data;
 * }
 *
 * @param type 예상되는 타입
 */
export function TypeGuard(type: any) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: "typeGuard",
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value == undefined || value == null) return false;
                    let obj = Object.assign(new type(), value);
                    let errorList = validateSync(obj);
                    for (let error of errorList) {
                        console.error(
                            `#typeGuard : ${error.property} is not ${type.name}`
                        );
                    }
                    return errorList.length == 0;
                }
            }
        });
    };
}

/**
 * 해당 타입의 배열이 맞는지 검사하는 데코레이터.
 * 인자로 타입의 이름이나 생성자를 넘겨주어야 한다.
 *
 * class Data {
 *     ...
 * }
 * class Wrap {
 *     @TypeGuardArray(Data)
 *     data! :Data[];
 * }
 *
 * @param type 예상되는 타입
 */
export function TypeGuardArray(type: any) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: "typeGuardArray",
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(arr: any[], args: ValidationArguments) {
                    if (arr == undefined || arr == null) return false;
                    if (arr.constructor != Array) return false;

                    let vaild = true;
                    for (let item of arr) {
                        let target = Object.create(new type());
                        Object.assign(target, item);
                        for (let error of validateSync(target)) {
                            console.error(
                                `#typeGuard : ${error.property} is not ${type.name}`
                            );
                            vaild = false;
                        }
                    }
                    return vaild;
                }
            }
        });
    };
}

/**
 * 오브젝트의 유효성을 검사하고, 올바르다면 true를 반환한다.
 * class-validator 데코레이터로 정의된 필드만 검사하는것에 주의한다.
 *
 * class Data {
 *     ...
 * }
 * let something;
 * let vaild: boolean = guardianSync(something, Data);
 *
 * @param target 유효성을 검사하고자 하는 객체
 * @param expectedType 예상되는 타입
 */
export function guardianSync(target: any, expectedType: any): boolean {
    return validateSync(Object.assign(new expectedType(), target)).length == 0;
}
