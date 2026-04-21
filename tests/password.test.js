import { describe, it } from "node:test"
import assert from "node:assert/strict"

import { generatePassword, charsets } from "../src/password.js";

const options = ["upperCase", "lowerCase", "specialCharacters"];

describe("password generator", () => {
    it("should generate a password with the correct length", () => {
        const passwordLength = 10;
        const password = generatePassword(passwordLength, options);
        assert.strictEqual(password.length, passwordLength);
    });

    it("shouldn't have other than the expected characters type", () => {
        const password = generatePassword(20, options);
        const absentCharset = [];

        for (let key in charsets) {
            if (!options.includes(key)) {
                let includes = false;
                for (let char of password) {
                    if (charsets[key].includes(char)) includes = true;
                }
                absentCharset.push(includes);
            }
        }

        assert.strictEqual(absentCharset.some(Boolean), false);
    });

    it("should generate a large password with the correct length", () => {
        const passwordLength = 1000;
        const password = generatePassword(passwordLength, options);
        assert.strictEqual(password.length, passwordLength);
    });

    it ("should generate a single charset type password", () => {
        const singleOptions = ["numbers"];
        const password = generatePassword(20, singleOptions);
        const numbers = charsets.numbers;

        let allNumbers = [...password].every(char => numbers.includes(char));

        assert.strictEqual(allNumbers, true);
    });
});