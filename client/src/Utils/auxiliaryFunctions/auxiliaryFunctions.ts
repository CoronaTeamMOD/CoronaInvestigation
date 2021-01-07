
export const phoneNumberRegex = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/;
export const notRequiredPhoneNumberRegex = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$|^$/;
export const mailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const get = (obj: any, path: string, defaultValue = undefined) => {
    const travel = (regexp: RegExp) =>
        path
            .split(regexp)
            .filter(Boolean)
            .reduce(
                (res, key) =>
                    res !== null && res !== undefined ? res[key] : res,
                obj
            );
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
};

export const idBasicValidation = /^\d+|^$/;
export const idLength = 9;
const isIdValid = (id: string | null | undefined) => {
    let sum = 0;
    if (Boolean(id)) {
        if (id?.length === 9) {
            Array.from(id)?.forEach((digit: string, index: number) => {
                let digitMul = parseInt(digit) * ((index % 2) + 1);
                if (digitMul > 9) {
                    digitMul -= 9;
                }
                sum += digitMul;
            });
        }
        return sum % 10 === 0 && sum > 0;
    } else {
        return true;
    }
};

export const passportValidation = /^[a-zA-Z0-9\u0590-\u05fe\/\s():&\-\\]*$/;
export const passportMaxIdentificationLength = 15;
const isPassportValid = (id: string | null | undefined): boolean => {
    /*
     *  note : this is a funcion and not a constant because the logic
     *        will most likely be changed to something more complicated (like id)
     */
    if (Boolean(id)) {
        return passportValidation.test(String(id));
    }
    return true;
};

export { get, isIdValid, isPassportValid };
