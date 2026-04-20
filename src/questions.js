const readline = require("readline/promises");

let rl = null;

function getReadline() {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    return rl;
}

async function getLength() {
    while (true) {
        const length = await getReadline().question("How many characters will the password have? ");
        const parsed = Number(length);

        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }

        console.log("Please enter a valid number.");
    }
}

async function getCount() {
    while (true) {
        const count = await getReadline().question("How many passwords will be generated? ");
        const parsed = Number(count);

        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }

        console.log("Please enter a valid number.");
    }
}

async function ask(message) {
    while (true) {
        const answer = await getReadline().question(message);
        const lowerCaseAnswer = answer.toLowerCase();

        if (["y", "n", "yes", "no"].includes(lowerCaseAnswer)) {
            return lowerCaseAnswer[0] === "y";
        }

        console.log("Please enter a valid answer. (y/n)");
    }
}

function close() {
    if (rl) rl.close();
}

module.exports = { ask, getLength, getCount, close };