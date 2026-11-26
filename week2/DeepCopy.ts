
function deepClone<T>(
    value: T,
    map: WeakMap<object, any> = new WeakMap()
): T {
    // 1. Base case: primitives and null
    if (value === null || typeof value !== "object") {
        return value;
    }

    // 2. Circular reference check
    if (map.has(value as object)) {
        return map.get(value as object);
    }

    // 3. Create array or object
    const copy: any = Array.isArray(value) ? [] : {};

    // 4. Store before recursion to handle circular references
    map.set(value as object, copy);

    // 5. Recursively clone properties
    for (const key of Object.keys(value as object)) {
        copy[key] = deepClone(
            (value as any)[key],
            map
        );
    }

    return copy;
}

// Test
const original: any = {
    a: 1,
    b: { c: 2 },
    d: [11, 7],
};

original.self = original;

const copy = deepClone(original);

console.log(copy !== original);       // true
console.log(copy.b !== original.b);   // true
console.log(copy.self === copy);      // true
console.log(copy.d !== original.d);   // true
console.log(copy.d);                  // [11, 7]
