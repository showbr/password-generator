import { getLength, getCount, ask, close } from './questions.js';

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
                console.log("Usage: node index.js [options]\n" +
                    "\n" +
                    "Options:\n" +
                    "  -l, --length <n>    Length of the password (required)\n" +
                    "  -C, --upper         Include uppercase letters [A-Z]\n" +
                    "  -c, --lower         Include lowercase letters [a-z]\n" +
                    "  -n, --numbers       Include numbers [0-9]\n" +
                    "  -s, --symbols       Include special characters\n" +
                    "      --count <n>     Number of passwords to generate (default: 1)\n" +
                    "  -h, --help          Display this help message\n" +
                    "\n" +
                    "Examples:\n" +
                    "  node index.js --length 16\n" +
                    "  node index.js --length 16 --symbols --upper\n" +
                    "  node index.js --length 20 --count 5\n" +
                    "  node index.js --length 12 --lower --numbers\n" +
                    "\n" +
                    "Notes:\n" +
                    "  If no options are provided, interactive mode will be started.\n" +
                    "  If no character type is specified, all types will be included.");
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

    // If the user didn't specify any character type, enable all by default.
    const boolOptions = Object.values(options).filter(value => typeof value === "boolean");
    if (!boolOptions.some(Boolean)) {
        options.upperCase = true;
        options.lowerCase = true;
        options.numbers = true;
        options.specialCharacters = true;
    }

    return [cliArgs, options];
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

export async function getOptions() {
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

    close();

    return [options.length, options.count, validOptions];
}