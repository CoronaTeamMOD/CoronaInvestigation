import { NUMERIC_TEXT_REGEX, PALESTINE_ID_REGEX, PASSPORT_REGEX, VISA_REGEX } from 'commons/Regex/Regex';

const moreThanOneSlashIndicator = 3;
export const idLength = 9;
export const passportLength = 10;
export const visaLength = 15;
export const otherIdLength = 12;

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

const isPassportValid = (id: string | null | undefined): boolean => {
    /*
     *  note : this is a funcion and not a constant because the logic
     *        will most likely be changed to something more complicated (like id)
     */
    if(id) {
        if (id.length === passportLength) {
            return PASSPORT_REGEX.test(String(id));
        } else if (id.length === visaLength) {
            if(doesStringHasMoreThanOneSlash(id)) {
                return VISA_REGEX.test(String(id));
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
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
        if (id.length === otherIdLength) {
            return NUMERIC_TEXT_REGEX.test(String(id));
        } else {
            return false;
        }
    }
    return true;
};

const doesStringHasMoreThanOneSlash = (givenStr: string) => {
    return givenStr.split('/').length < moreThanOneSlashIndicator;
};

export { get, isIdValid, isPassportValid, isPalestineIdValid, isOtherIdValid };