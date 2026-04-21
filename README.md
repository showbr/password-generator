# password-generator

A CLI password generator with interactive and flag-based modes, built with Node.js.

## Requirements

- Node.js 18+

## Installation

```bash
git clone <repository-url>
cd password-generator
npm install
```

## Usage

```bash
node index.js [options]
```

If no options are provided, interactive mode will be started.

## Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--length <n>` | `-l` | Length of the password (required) |
| `--upper` | `-C` | Include uppercase letters [A-Z] |
| `--lower` | `-c` | Include lowercase letters [a-z] |
| `--numbers` | `-n` | Include numbers [0-9] |
| `--symbols` | `-s` | Include special characters |
| `--count <n>` | | Number of passwords to generate (default: 1) |
| `--help` | `-h` | Display help message |
| `--version` | `-V` | Display version number |

If no character type is specified, all types will be included.

## Examples

```bash
# Generate a 16-character password with all character types
node index.js --length 16

# Generate a password with uppercase letters and symbols only
node index.js --length 16 --upper --symbols

# Generate 5 passwords of length 20
node index.js --length 20 --count 5

# Generate a password with lowercase letters and numbers only
node index.js --length 12 --lower --numbers

# Start interactive mode
node index.js
```

## Project Structure

```
password-generator/
├── src/
│   ├── cli.js        # Argument parsing and option orchestration
│   ├── questions.js  # Interactive prompts
│   └── password.js   # Password generation logic
├── tests/
│   └── password.test.js
├── index.js          # Entry point
├── package.json
└── .gitignore
```

## Testing

```bash
npm test
```

## Security

Password generation uses `crypto.randomInt` from Node's built-in `crypto` module, which is cryptographically secure (CSPRNG). `Math.random` is intentionally avoided as it produces predictable sequences unsuitable for security-sensitive use cases.