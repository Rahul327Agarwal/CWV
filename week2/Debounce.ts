
function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const callNow = immediate && timeout === undefined;

        if (timeout !== undefined) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = undefined;

            if (!immediate) {
                func.apply(this, args);
            }
        }, wait);

        if (callNow) {
            func.apply(this, args);
        }
    };
}

// Usage
const onSearch = debounce(
    (value: string) => console.log("Searching for:", value),
    300
);

onSearch("R");
onSearch("Re");
onSearch("React");

// After 300ms without another call:
// Searching for: React
