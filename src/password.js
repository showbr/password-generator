import { randomInt } from 'crypto';

export const charsets = {
    upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowerCase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    specialCharacters: "!@#$%^&*()-_=+,.<>/?;[]{}"
}

// Uses crypto.randomInt instead of Math.random — Math.random is not
// cryptographically secure and can produce predictable sequences.
// First pick a random character type, then a random character within that type.
function generateChar(options) {
    const charType = options[randomInt(0, options.length)];
    const char = charsets[charType];
    return char[randomInt(0, char.length)];
}

export function generatePassword(length, options) {
    let password = ""
    for (let i = 0; i < length; i++) {
        const char = generateChar(options);
        password += char;
    }

    return password;
}