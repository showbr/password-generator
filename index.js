const readline = require("readline/promises");

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
        const upperCase = await rl.question(message);

        if (["y", "n", "yes", "no"].includes(upperCase.toLowerCase())) {
            return upperCase[0] === "y";
        }

        console.log("Please enter a valid answer. (y/n)");
    }
}

function validateOptions(upperCase, lowerCase, numbers, specialCharacters) {
    if (!lowerCase && !upperCase && !numbers && !specialCharacters) {
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

async function main() {
    const length = await getLength();
    const upperCase = await ask(messages.upperCase);
    const lowerCase = await ask(messages.lowerCase);
    const numbers = await ask(messages.numbers);
    const specialCharacters = await ask(messages.specialCharacters);

    if (!validateOptions(upperCase, lowerCase, numbers, specialCharacters)) {
        process.exit(1);
    }
}

main().then(() => rl.close());
