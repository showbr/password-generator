const readline = require("readline/promises");
const { randomInt } = require("crypto");

function parseArgs() {
    const options = {
        length: 0,
        count: 1,
        upperCase: false,
        lowerCase: false,
        numbers: false,
        specialCharacters: false,
    };

    let cliArgs, lengthExpected, countExpected, argumentError = false;
    const argv = process.argv;

    for (let i = 2; i < argv.length; i++) {
        cliArgs = true;
        const arg = argv[i];

        switch (arg) {
            case "--help":
            case "-h":
                console.log("");
                process.exit(0);
                break;
            case "--length":
            case "-l":
                lengthExpected = true;
                break;
            case "--upper":
            case "-C":
                options.upperCase = true;
                break;
            case "--lower":
            case "-c":
                options.lowerCase = true;
                break;
            case "--numbers":
            case "-n":
                options.numbers = true;
                break;
            case "--symbols":
            case "-s":
                options.specialCharacters = true;
                break;
            case "--count":
                countExpected = true;
                break
            default:
                if (lengthExpected) {
                    lengthExpected = false;
                    const parsed = Number(arg);

                    if (Number.isInteger(parsed) && parsed > 0) {
                        options.length = parsed;
                    } else {
                        console.error("Please enter a valid length. (n > 0)");
                        argumentError = true;
                    }
                } else if (countExpected) {
                    countExpected = false;
                    const parsed = Number(arg);

                    if (Number.isInteger(parsed) && parsed > 0) {
                        options.count = parsed;
                    } else {
                        console.error("Please enter a valid count. (n > 0)");
                        argumentError = true;
                    }
                } else {
                    console.error("Invalid argument encountered:", arg);
                    argumentError = true;
                }
        }
    }

    if (lengthExpected || options.length === 0) {
        console.error("Length value is missing!");
        argumentError = true;
    }

    if (countExpected) {
        console.error("Count value is missing!");
        argumentError = true;
    }

    if (argumentError) {
        process.exit(1);
    }

    const boolOptions = Object.values(options).filter(value => typeof value === "boolean");

    console.log(boolOptions);

    if (!boolOptions.some(Boolean)) {
        options.upperCase = true;
        options.lowerCase = true;
        options.numbers = true;
        options.specialCharacters = true;
    }

    console.log(options);

    return [cliArgs, options];
}

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

async function getCount() {
    while (true) {
        const count = await rl.question("How many passwords will be generated? ");
        const parsed = Number(count);

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
    const [cliArgs, options] = parseArgs();

    if (!cliArgs) {
        options.length = await getLength();
        options.count = await getCount();
        options.upperCase = await ask(messages.upperCase);
        options.lowerCase = await ask(messages.lowerCase);
        options.numbers = await ask(messages.numbers);
        options.specialCharacters = await ask(messages.specialCharacters);
    }

    const validOptions = [];

    if (options.upperCase) validOptions.push("upperCase");
    if (options.lowerCase) validOptions.push("lowerCase");
    if (options.numbers) validOptions.push("numbers");
    if (options.specialCharacters) validOptions.push("specialCharacters");

    if (!validateOptions(validOptions)) {
        process.exit(1);
    }

    return [options.length, options.count, validOptions];
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

getOptions().then(([length, count, validOptions]) => {
    for (let i = 1; i <= count; i++) {
        const password = generatePassword(length, validOptions);
        console.log(`Password ${i} generated: ${password}`);
    }
    rl.close()
});


