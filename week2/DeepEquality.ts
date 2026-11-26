
function isDeepEqual(obj1: any, obj2: any): boolean {
    // 1. Same value or reference
    if (Object.is(obj1, obj2)) {
        return true;
    }

    // 2. Null or non-object check
    if (
        obj1 === null ||
        obj2 === null ||
        typeof obj1 !== "object" ||
        typeof obj2 !== "object"
    ) {
        return false;
    }

    // 3. Arrays and objects must have the same type
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
        return false;
    }

    // 4. Compare keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    // 5. Recursively compare every property
    for (const key of keys1) {
        if (
            !Object.prototype.hasOwnProperty.call(obj2, key) ||
            !isDeepEqual(obj1[key], obj2[key])
        ) {
            return false;
        }
    }

    return true;
}

// Test cases
const profileA = {
    name: "Vasanth",
    roles: ["admin", "mentor"],
    meta: { id: 1 }
};

const profileB = {
    name: "Vasanth",
    roles: ["admin", "mentor"],
    meta: { id: 1 }
};

const profileC = {
    name: "Vasanth",
    roles: ["admin"],
    meta: { id: 1 }
};

console.log("Test 1:", isDeepEqual(profileA, profileB));
// true

console.log("Test 2:", isDeepEqual(profileA, profileC));
// false

console.log(
    "Test 3:",
    isDeepEqual(profileA, {
        ...profileB,
        meta: { id: 2 }
    })
);
// false

console.log("Test 4:", isDeepEqual(10, 10));
// true
