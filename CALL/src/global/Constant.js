const CHUNK_R = 64 * 5;

class Constant {
    static SPACE = {
        MAX_HIGHT: 320,
        MIN_HIGHT: -64,
    }
    static STRUCTURE = {
        MAX_LENGTH: 64,
        MAX_HIGHT: 64
    }
    static AREA = {
        MAX_LENGTH: 64 * 1000,
        MAX_HIGHT: 320
    }
    static FILL = {
        MAX_HIGHT: 8
    }
    static CHUNK = {
        R: CHUNK_R,
        R_SQR: CHUNK_R * CHUNK_R
    }
}

module.exports = Constant;