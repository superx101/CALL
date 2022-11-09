class Enums {
    static msg = {
        /**普通消息*/
        RAW: 0,
        /**聊天消息*/
        CHAT: 1,
        /**音乐盒消息*/
        POPUP: 4,
        /**物品栏上方的消息*/
        TIP: 5,
        /**Json格式消息*/
        JSON: 9
    }

    static DIRECTION = {
        NEG_Y: 0,
        POS_Y: 1,
        NEG_Z: 2,
        POS_Z: 3,
        NEG_X: 4,
        POS_X: 5
    }
}

module.exports = Enums;