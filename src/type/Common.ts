export enum Compare {
    GREATER = 1,
    EQUAL = 0,
    LESSER = -1
}

export enum Listener {
    Join = "onJoin",
    Left = "onLeft",
    UseItemOn = "onUseItemOn",
    StartDestroyBlock = "onStartDestroyBlock"
}

export enum FileMode {
    ReadMode = 0,
    WriteMode = 1,
    AppendMode = 2
}