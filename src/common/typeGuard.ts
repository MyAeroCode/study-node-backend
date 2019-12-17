import {
    validateSync,
    ValidationOptions,
    registerDecorator,
    ValidationArguments
} from "class-validator";

export function TypeGuard<T extends Object>(holder: T) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: "typeGuard",
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value == undefined || value == null) return false;
                    let obj = Object.assign(holder, value);
                    let errorList = validateSync(obj);
                    for (let error of errorList) {
                        console.error(
                            `#typeGuard : ${error.property} is not ${holder.constructor.name}`
                        );
                    }
                    return errorList.length == 0;
                }
            }
        });
    };
}

export function TypeGuardArray<T extends Object>(holder: T) {
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
                        let target = Object.create(holder);
                        Object.assign(target, item);
                        for (let error of validateSync(target)) {
                            console.error(
                                `#typeGuard : ${error.property} is not ${holder.constructor.name}`
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

export function guardianSync<T extends Object>(
    target: any,
    expectedTypeHolder: T
): boolean {
    return validateSync(Object.assign(expectedTypeHolder, target)).length == 0;
}
