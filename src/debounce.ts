type AnyFunction = (...args: any[]) => any;

const debounce = <T extends AnyFunction>(fn: T, delay: number): T => {
    let timer: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: Parameters<T>): void {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    } as T;
}

export default debounce;
