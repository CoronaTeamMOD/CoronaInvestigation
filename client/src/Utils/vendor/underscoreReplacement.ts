interface ThrottleSettings {
    leading?: boolean;
    trailing?: boolean;
}

interface Cancelable {
    cancel(): void;
}

type Timeout = ReturnType<typeof setTimeout>;

type Function = (...args: any[]) => any;

const now = () => new Date().getTime();

export function  throttle<T extends Function>(func: T, wait: number, options?:ThrottleSettings): T&Cancelable {
    var timeout: null | Timeout, context:any, args:any, result: any;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options?.leading === false ? 0 : now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    // @ts-ignore
    var throttled: T & Cancelable = function() {
        var _now = now();
        if (!previous && options?.leading === false) previous = _now;
        var remaining = wait - (_now - previous);
        // @ts-ignore
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = _now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options?.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function() {
        timeout && clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}

export const isObjectEmpty = (element: any): boolean => {
    return Object.keys(element).length === 0 && element.constructor === Object
};
