import { Command } from "commander";

import { getLength, getCount, ask, close } from './questions.js';

const program = new Command();

program
    .name("password-generator")
    .description("CLI password generator with interactive functions")
    .version("1.0.0")

const positiveInt = (name) => (value) => {
    const n = Number(value);

    if (!Number.isInteger(n) || n <= 0) {
        console.error(`${name} must be an integer greater than 0`);
        process.exit(1);
    }

    return n;
};

program
    .option("-l, --length <n>", "Length of the password (required)", positiveInt("Length"))
    .option("-C, --upper", "Include uppercase letters [A-Z]")
    .option("-c, --lower", "Include lowercase letters [a-z]")
    .option("-n, --numbers", "Include numbers [0-9]")
    .option("-s, --symbols", "Include special characters")
    .option("--count <n>", "Number of passwords to generate", positiveInt("Count"), 1);

program.addHelpText(
    "after",
    "\nExamples:\n" +
    "  node index.js --length 16\n" +
    "  node index.js --length 16 --symbols --upper\n" +
    "  node index.js --length 20 --count 5\n" +
    "  node index.js --length 12 --lower --numbers\n"
);

program.addHelpText(
    "after",
    "Notes:\n" +
    "  If no options are provided, interactive mode will be started.\n" +
    "  If no character type is specified, all types will be included."
);

program.parse(process.argv);
const commanderOptions = program.opts();

function parseOptions(options) {
    // Find if any parameter came from the CLI
    const cliArgs = Object.keys(options).some(
        key => program.getOptionValueSource(key) === 'cli'
    );

    const parsedOptions = {
        length: options.length || 0,
        count: options.count,
        upperCase: options.upper || false,
        lowerCase: options.lower || false,
        numbers: options.numbers || false,
        specialCharacters: options.symbols || false,
    };

    if (parsedOptions.length === 0 && cliArgs) {
        console.error("Length value is missing!");
        process.exit(1);
    }

    // If the user didn't specify any character type, enable all by default.
    const boolOptions = Object.values(parsedOptions).filter(value => typeof value === "boolean");
    if (!boolOptions.some(Boolean)) {
        parsedOptions.upperCase = true;
        parsedOptions.lowerCase = true;
        parsedOptions.numbers = true;
        parsedOptions.specialCharacters = true;
    }

    return [cliArgs, parsedOptions];
}

const messages = {
    upperCase: "Will the password have upper case characters [A-Z]? (y/n) ",
    lowerCase: "Will the password have lower case characters [a-z]? (y/n) ",
    numbers: "Will the password have numbers [0-9]? (y/n) ",
    specialCharacters: "Will the password have special characters? (y/n) ",
}

export async function getOptions() {
    const [cliArgs, options] = parseOptions(commanderOptions);

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

    close();

    return [options.length, options.count, validOptions];
}