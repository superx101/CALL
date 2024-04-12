export class Warn extends Error {
    constructor(msg: string) {
        super(msg);
    }
}