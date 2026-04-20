import { getOptions } from "./src/cli.js";
import { generatePassword } from "./src/password.js";

getOptions().then(([length, count, validOptions]) => {
    for (let i = 1; i <= count; i++) {
        const password = generatePassword(length, validOptions);
        console.log(`Password ${i} generated: ${password}`);
    }
});


