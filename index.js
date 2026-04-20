const { getOptions } = require("./src/cli");
const { generatePassword } = require("./src/password");

getOptions().then(([length, count, validOptions]) => {
    for (let i = 1; i <= count; i++) {
        const password = generatePassword(length, validOptions);
        console.log(`Password ${i} generated: ${password}`);
    }
});


