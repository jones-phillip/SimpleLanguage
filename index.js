const fs = require("fs");
const path = require("path");

class Magenta {
    constructor(codes) {
        this.codes = codes
    }

    tokenize() {
        const length = this.codes.length;

        let pos = 0;
        let tokens = [];
        const BUILT_IN_KEYWORDS = ["print"];
        const varChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";

        while (pos < length) {
            let currentChar = this.codes[pos];

            if(currentChar === " " || currentChar === "\n") {
                pos++;
                continue;
            } else if( currentChar === '"') {
                let res = "";
                pos++;

                while (this.codes[pos] !== '"' && this.codes[pos] !== '\n' && pos < length) {
                    res += this.codes[pos];
                    pos++;
                }

                if(this.codes[pos] !== '"') {
                    return {
                        error: "unterminated string"
                    }
                }

                pos++;

                tokens.push({
                    type: "string",
                    value: res
                })
            } else if (varChars.includes(currentChar)) {
                let res = currentChar;
                pos++;

                while(varChars.includes(this.codes[pos]) && pos < length) {
                    res += this.codes[pos];
                    pos++;
                }

                if (!BUILT_IN_KEYWORDS.includes(res)) {
                    return {
                        error: `unexpected token ${res}`
                    }
                }

                tokens.push({
                    type: "keyword",
                    value: res
                });
            } else {
                return {
                    error: `unexpected character ${this.codes[pos]}`
                }
            }
        }

        return {
            error: false,
            tokens
        }
    }

    parse(tokens) {
        const len = tokens.length
        let pos = 0
        while(pos < len) {
          const token = tokens[pos]
          // if token is a print keyword
          if(token.type === "keyword" && token.value === "print") {
            // if the next token doesn't exist
            if(!tokens[pos + 1]) {
              return console.log("Unexpected end of line, expected string")
            }
            // check if the next token is a string
            let isString = tokens[pos + 1].type === "string"
            // if the next token is not a string
            if(!isString) {
              return console.log(`Unexpected token ${tokens[pos + 1].type}, expected string`)
            }
            // if we reach this point, we have valid syntax
            // so we can print the string
            console.log('\x1b[35m%s\x1b[0m', tokens[pos + 1].value)
            // we add 2 because we also check the token after print keyword
            pos += 2
          } else{ // if we didn't match any rules
            return console.log(`Unexpected token ${token.type}`)
          }
        }
    }

    run() {
        const {
            tokens, 
            error
        } = this.tokenize();

        if(error) {
            console.log(error);
            return;
        }
        
        this.parse(tokens);
    }
}


const codes = fs.readFileSync(path.join(__dirname, 'codes.m'), 'utf8').toString();
const magenta = new Magenta(codes);
magenta.run();