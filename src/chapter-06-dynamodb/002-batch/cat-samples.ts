import { Cat } from "./cat-type";

export let samples = new Map<string, Cat>();
let now = Date.now();
for (let i = 0; i < 1000; i++) {
    let name = `cat_${now}_${i}`;
    samples.set(
        name,
        Object.assign(new Cat(), {
            name: name,
            type: Math.floor(Math.random() * 10) % 3
        })
    );
}
