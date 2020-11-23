const get = (obj: any, path: string, defaultValue = undefined) => {
    const travel = (regexp: RegExp) =>
        path.split(regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
};

const isIdValid = (id: string | null | undefined) => {
    let sum = 0;
    if (Boolean(id)) {
        if (id.length === 9) {
            Array.from(id).forEach((digit: string, index: number) => {
                let digitMul = parseInt(digit) * ((index % 2) + 1);
                if (digitMul > 9) {
                    digitMul -= 9;
                }
                sum += digitMul;
            })
        }
        return sum % 10 === 0 && sum > 0;
    } else {
        return true;
    }
}

export {
    get,
    isIdValid
} 