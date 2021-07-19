import { PALESTINE_ID_REGEX, PASSPORT_DASH_REGEX } from 'commons/Regex/Regex';

const moreThanOneSlashIndicator = 3;
export const idLength = 9;
export const passportLength = 10;
export const otherIdLength = 15;

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

const isIdValid = (id: string | null | undefined) => {
    let sum = 0;
    if (Boolean(id)) {
        const idNumber = typeof(id) == 'number' ? `${id}` : id;
        if (idNumber?.length === 9) {
            Array.from(idNumber)?.forEach((digit: string, index: number) => {
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

const isPalestineIdValid = (id: string | null | undefined): boolean => {
    if (id) {
        if (id.length === idLength) {
            return PALESTINE_ID_REGEX.test(String(id));
        } else {
            return false;
        }
    }
    return true;
};

const isOtherIdValid = (id: string | null | undefined): boolean => {
    if (id) {
        if (id.length <= otherIdLength) {
            return PASSPORT_DASH_REGEX.test(String(id));
        } else {
            return false;
        }
    }
    return true;
};

export { get, isIdValid, isPalestineIdValid, isOtherIdValid };