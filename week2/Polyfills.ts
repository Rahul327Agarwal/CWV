
const nestedData: unknown[] = [2, [7, 8]];

function customFlat(arr: unknown[], depth: number = 1): unknown[] {
    const result: unknown[] = [];

    for (const item of arr) {
        if (Array.isArray(item) && depth > 0) {
            result.push(
                ...customFlat(
                    item,
                    depth === Infinity ? Infinity : depth - 1
                )
            );
        } else {
            result.push(item);
        }
    }

    return result;
}

console.log(customFlat(nestedData, 1));
// [2, 7, 8]

console.log(customFlat(nestedData, 2));
// [2, 7, 8]

console.log(customFlat(nestedData, Infinity));
// [2, 7, 8]
