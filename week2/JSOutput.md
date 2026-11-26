# JavaScript Output Questions

## 1. Microsoft | The Microtask Priority Riddle

### Question

Predict the exact output. Explain why `asyncFn` behaves differently than a
standard promise chain.

### Code

```javascript
console.log("1 - Sync");

setTimeout(() => {
  console.log("2 - Macrotask");
}, 0);

async function asyncFn() {
  console.log("3 - Inside Async");
  await Promise.resolve();
  console.log("4 - After Await");
}

asyncFn();

Promise.resolve().then(() => {
  console.log("5 - Microtask");
});

console.log("6 - Sync End");
```

### Exact output

```text
1 - Sync
3 - Inside Async
6 - Sync End
4 - After Await
5 - Microtask
2 - Macrotask
```

### Explanation

1. Synchronous code runs first. Calling `asyncFn()` runs it immediately until
   the first `await`, so `3 - Inside Async` is logged synchronously.
2. `await Promise.resolve()` pauses `asyncFn` and queues its continuation as a
   microtask.
3. The following `.then()` queues another microtask, after the continuation
   already queued by `await`.
4. The rest of the synchronous script logs `6 - Sync End`.
5. Microtasks run in queue order: first `4 - After Await`, then
   `5 - Microtask`.
6. The timer callback is a macrotask and runs after the microtask queue is
   empty.

### Interview takeaway

An async function does not execute its entire body asynchronously. It runs
synchronously up to the first `await`. The continuation after `await` runs as
a microtask, like a Promise `.then()` callback. `async`/`await` makes
promise-based code easier to read; it does not create a higher-priority queue.

---

## 2. Meta (Facebook) | Context in Arrow Functions

### Question

What will be the output? Can the context of `greet` be changed using `.call()`?
Why or why not?

### Code

```javascript
const profile = {
  userName: "Vasanth",
  greet: () => {
    console.log(`Hi, I'm ${this.userName}`);
  },
  welcome: function () {
    console.log(`Welcome, ${this.userName}`);
  },
};

const friend = { userName: "Candidate" };

profile.greet.call(friend);
profile.welcome.call(friend);
```

### Output in CommonJS Node.js

```text
Hi, I'm undefined
Welcome, Candidate
```

### Explanation

- `greet` is an arrow function. Arrow functions capture `this` from their
  surrounding lexical scope; they do not get `this` from the object that
  contains them.
- `.call(friend)` cannot change an arrow function's `this`, so `greet` does
  not use `friend.userName`.
- `welcome` is a regular function. `.call(friend)` sets its `this` to
  `friend`, so it logs `Candidate`.

### Environment note

The first line depends on where the code runs:

- **CommonJS Node.js:** top-level `this` is the module exports object, so
  `this.userName` is `undefined`.
- **ES module:** top-level `this` is `undefined`; accessing
  `this.userName` can throw a `TypeError`.
- **Browser classic script:** the arrow captures the global `this`.

The reliable interview point is that `.call()` cannot change an arrow
function's lexical `this`.

---

## 3. Adobe | Shallow Copy and the Spread Operator

### Question

What will be logged? Why did the original object change? How can you fix it
with the spread operator while keeping the code readable?

### Code

```javascript
const state = {
  user: { id: 101, details: { city: "Bangalore" } },
  theme: "dark",
};

const newState = { ...state };
newState.user.details.city = "Chennai";

console.log(state.user.details.city);
```

### Expected output

```text
Chennai
```

### Explanation

1. The spread operator `{ ...state }` creates a **shallow copy**.
2. The top-level `newState` object is new, but nested objects are not copied.
3. `state.user` and `newState.user` point to the same object.
4. Their `details` properties also point to the same nested object.
5. Updating `newState.user.details.city` therefore changes the value visible
   through `state.user.details.city` too.

### Fix: copy each changed level

```javascript
const newState = {
  ...state,
  user: {
    ...state.user,
    details: {
      ...state.user.details,
      city: "Chennai",
    },
  },
};

console.log(state.user.details.city);    // Bangalore
console.log(newState.user.details.city); // Chennai
```

### Interview takeaway

- Spread copies only one level; it does not deep-clone nested objects.
- For immutable updates, copy every object along the path being changed.
- Unchanged fields can be reused safely; do not mutate a shared nested object.
- For deeply nested data, consider simplifying the state shape or using an
  immutable-update helper such as Immer.
