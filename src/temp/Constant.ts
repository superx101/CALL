const CHUNK_R = 64 * 5;

export default class Constant {
    public static SPACE = {
        MAX_HIGHT: 320,
        MIN_HIGHT: -64,
    }
    public static STRUCTURE = {
        MAX_LENGTH: 64,
        MAX_HIGHT: 64
    }
    public static AREA = {
        MAX_LENGTH: 64 * 1000,
        MAX_HIGHT: 320 + 64
    }
    public static FILL = {
        MAX_HIGHT: 8
    }
    public static CHUNK = {
        R: CHUNK_R,
        R_SQR: CHUNK_R * CHUNK_R
    }
}