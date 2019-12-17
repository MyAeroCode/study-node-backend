import {
    validateSync,
    ValidationOptions,
    registerDecorator,
    ValidationArguments
} from "class-validator";

export default function TypeGuard<T extends Object>(
    holder: T,
    validationOptions?: ValidationOptions
) {
    if (!validationOptions) validationOptions = {};
    validationOptions.message = `mistmatch : ${holder.constructor.name}`;
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: "typeGuard",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    let obj = Object.assign(holder, value);
                    let errorList = validateSync(obj);
                    for (let error of errorList) {
                        console.error(
                            `# typeguard : error at [${error.property}]`
                        );
                    }
                    return errorList.length == 0;
                }
            }
        });
    };
}
