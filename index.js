const readline = require("readline/promises");
const { randomInt } = require("crypto");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function getLength() {
    while (true) {
        const length = await rl.question("How many characters will the password have? ");
        const parsed = Number(length);

        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }

        console.log("Please enter a valid number.");
    }
}

async function ask(message) {
    while (true) {
        const answer = await rl.question(message);
        const lowerCaseAnswer = answer.toLowerCase();

        if (["y", "n", "yes", "no"].includes(lowerCaseAnswer)) {
            return lowerCaseAnswer[0] === "y";
        }

        console.log("Please enter a valid answer. (y/n)");
    }
}

function validateOptions(options) {
    if (options.length === 0) {
        console.log("You must select at least one character type.")
        return false;
    }

    return true;
}

const messages = {
    upperCase: "Will the password have upper case characters [A-Z]? (y/n) ",
    lowerCase: "Will the password have lower case characters [a-z]? (y/n) ",
    numbers: "Will the password have numbers [0-9]? (y/n) ",
    specialCharacters: "Will the password have special characters? (y/n) ",
}

async function getOptions() {
    const length = await getLength();
    const upperCase = await ask(messages.upperCase);
    const lowerCase = await ask(messages.lowerCase);
    const numbers = await ask(messages.numbers);
    const specialCharacters = await ask(messages.specialCharacters);

    const validOptions = [];

    if (upperCase) validOptions.push("upperCase");
    if (lowerCase) validOptions.push("lowerCase");
    if (numbers) validOptions.push("numbers");
    if (specialCharacters) validOptions.push("specialCharacters");

    if (!validateOptions(validOptions)) {
        process.exit(1);
    }

    return [length, validOptions];
}

const charsets = {
    upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowerCase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    specialCharacters: "!@#$%^&*()-_=+,.<>/?;[]{}"
}

function generateChar(options) {
    const charType = options[randomInt(0, options.length)];
    const char = charsets[charType];
    return char[randomInt(0, char.length)];
}

function generatePassword(length, options) {
    let password = ""
    for (let i = 0; i < length; i++) {
        const char = generateChar(options);
        password += char;
    }

    return password;
}

getOptions().then(([length, validOptions]) => {
    const password = generatePassword(length, validOptions);
    console.log(`\nPassword generated: ${password}`);
    rl.close()
});


