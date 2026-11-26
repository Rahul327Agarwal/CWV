
type DriverTask = () => Promise<string>;

async function promiseAllWithConcurrencyLimit(
    tasks: DriverTask[],
    limit: number
): Promise<PromiseSettledResult<string>[]> {

    // 1. Validation:
    // Limit positive integer hona chahiye.
    // Jaise limit = 2 valid hai, limit = 0 ya -1 invalid hai.
    if (!Number.isInteger(limit) || limit <= 0) {
        throw new Error("Limit must be a positive integer");
    }

    // 2. Results array:
    // Har task ka result uske original index par store hoga.
    // Isse tasks kisi bhi order mein complete hon,
    // final results ka order input jaisa hi rahega.
    const results: PromiseSettledResult<string>[] =
        new Array(tasks.length);

    // 3. Shared index:
    // Ye batata hai ki agla kaunsa task assign karna hai.
    // Saare workers isi index ko share karenge.
    let nextIndex = 0;

    // 4. Worker function:
    // Har worker queue se tasks uthata rahega,
    // jab tak saare tasks assign nahi ho jaate.
    async function worker(): Promise<void> {

        // 5. Loop:
        // Ek task complete hone ke baad worker
        // automatically agla task uthane ke liye wapas aayega.
        while (true) {

            // 6. Agla task assign karo aur index increment karo.
            // Example: pehla worker index 0 lega,
            // doosra worker index 1 lega, phir next available index 2 hoga.
            const index = nextIndex++;

            // 7. Agar index tasks ki length tak pahunch gaya,
            // toh koi task assign karne ke liye baaki nahi hai.
            // Is worker ko stop kar do.
            if (index >= tasks.length) {
                return;
            }

            // 8. Task execute karo.
            // tasks[index] ek function hai; () lagane se execute hoga.
            // await us task ke settle hone ka wait karega.
            try {
                const value = await tasks[index]();

                // 9. Task successful hua toh fulfilled result store karo.
                // Result ko uske original index par store kar rahe hain.
                results[index] = {
                    status: "fulfilled",
                    value,
                };

            } catch (reason) {

                // 10. Task reject hua toh error handle karo.
                // Worker band nahi hoga; catch ke baad while loop
                // dobara chalega aur ye next task utha sakega.
                results[index] = {
                    status: "rejected",
                    reason,
                };
            }

            // 11. try/catch ke baad loop dobara chalega.
            // Worker agla task uthayega, jab tak queue khatam na ho.
        }
    }

    // 12. Workers ki sankhya:
    // Limit 2 hai aur tasks 5 hain toh 2 workers banenge.
    // Tasks 1 hain aur limit 3 hai toh sirf 1 worker banega.
    const workerCount = Math.min(limit, tasks.length);

    // 13. Har worker ko start karo.
    // Array.from workerCount jitne workers banata hai.
    // Promise.all sabhi workers ke finish hone ka wait karta hai.
    await Promise.all(
        Array.from({ length: workerCount }, () => worker())
    );

    // 14. Saare workers finish hone ke baad results return karo.
    // Is array mein successful aur failed, dono tarah ke results honge.
    return results;
}

const driverDelays: number[] = [5, 2, 8, 1, 6, 3, 9, 4, 7];
// --- Input Data for Testing ---
const createDriverTask = (id: number, delay: number): DriverTask => () =>
    new Promise((resolve) => {
        console.log(` Fetching Driver ${id}...`);
        setTimeout(() => {
            console.log(` Driver ${id} loaded`);
            resolve(`Data for Driver ${id}`);
        }, delay);
    });

const tasks = driverDelays.map((delay, index) => createDriverTask(delay, delay * 1000));

// If limit is 2, Task 1 and 2 start. 
// When Task 2 finishes at 0.5s, Task 3 starts immediately.
promiseAllWithConcurrencyLimit(tasks, 2).then(results => {
    console.log("All tasks completed:", results);
});