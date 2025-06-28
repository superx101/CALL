export class Warn extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class UnreachableError extends Error {
    constructor(message = "Unreachable code executed") {
        super(message);
        this.name = "UnreachableError";
    }
}