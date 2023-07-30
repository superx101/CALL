# 快捷键 `tool`
## 概念
为了方便执行指令、以免与其他插件的热键冲突，CALL提供了一个快捷键机制：  
您可通过使用一个**特定种类**、**特定名称**的物品**点击任意方块**激活快捷键，激活后将**执行**一组提前绑定好的**指令**序列。

## 绑定指令

#### 指令

> /call \<tool | to :enum\> \<bind | bi :enum\> \<item :item\> \<right | left :enum> \<cmd :string\> \<describe :string\> \[name :string\]

- `item`：绑定物品的id
- `type`：快捷键激活方式：`right`:右键激活 `left`:左键激活
- `cmd`：指令组字符串，用;分隔多条指令。例如：`"/say hello;/say world"`

    为拓展指令功能，定义如下变量，执行指令时将会把变量计算为指定的值

    > `posf`：点击的浮点坐标对象  
    > 坐标对象属性：{x, y, z, dimid} //dimid为维度数
    
    > `pos`：被点击的方块的整数坐标对象  
    > 坐标对象属性：{x, y, z, dimid} //dimid为维度数

    > `block`：被点击的方块对象  
    > 方块对象属性请见[LL方块文档](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Block)  
    > 下表中列出LL2.9.0版本中的方块对象属性：
    >   | 属性 | 含义 | 类型 |
    >   | :-: | :-: | :-: |
    >   | block.name | 游戏内显示的方块名称 | String |
    >   | states | 方块状态值 (该变量由CALL提供) | String |
    >   | block.type | 方块标准类型名 | String |
    >   | block.id | 方块的游戏内id | Integer |
    >   | block.pos | 方块所在坐标 | IntPos |
    >   | block.tileData | 方块数据值 | Integer |
    >   | block.variant | The block variant | Integer |
    >   | block.translucency | 方块透明度 | Integer |
    >   | block.thickness | 方块厚度 | Integer |
    >   | block.isAir | 方块是否为空气 | Boolean |
    >   | block.isBounceBlock | 是否为可弹跳方块 | Boolean |
    >   | block.isButtonBlock | 是否为按钮方块 | Boolean |
    >   | block.isCropBlock | 是否为农作物方块 | Boolean |
    >   | block.isDoorBlock | 是否为门方块 | Boolean |
    >   | block.isFenceBlock | 是否为栅栏方块 | Boolean |
    >   | block.isFenceGateBlock | 是否为栅栏门方块 | Boolean |
    >   | block.isThinFenceBlock | 是否为细栅栏方块 | Boolean |
    >   | block.isHeavyBlock | 是否为重的方块 | Boolean |
    >   | block.isStemBlock | 是否为干方块 | Boolean |
    >   | block.isSlabBlock | 是否为半转方块 | Boolean |
    >   | block.isUnbreakable | 方块是否为不可破坏 | Boolean |
    >   | block.isWaterBlockingBlock | 方块是否可阻挡水 | Boolean |

    > `itemA`：物品栏第a格物品对象(a由设置决定)  
    > 物品属性请见[LL物品文档](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Item)
    > 下表中列出LL2.9.0版本中的物品对象属性：
    >  | 属性 | 含义 | 类型 |
    >  | :-: | :-: | :-: |
    >  | itemA.name | 游戏内显示的物品名称 | String |
    >  | itemA.type | 物品标准类型名 | String |
    >  | itemA.id | 物品的游戏内id | Integer |
    >  | itemA.count | 这个物品对象堆叠的个数 | Integer |
    >  | itemA.aux | 物品附加值（如羊毛颜色） | Integer |
    >  | itemA.damage | 物品当前耐久 | Integer |
    >  | itemA.attackDamage | 物品攻击伤害 | Integer |
    >  | itemA.maxDamage | 物品最大耐久 | Integer |
    >  | itemA.lore | 物品Lore | Array\<String, String...> |
    >  | itemA.isArmorItem | 物品是否为盔甲 | Boolean |
    >  | itemA.isBlock | 物品是否为方块 | Boolean |
    >  | itemA.isDamageableItem | 物品是否可被破坏 | Boolean |
    >  | itemA.isDamaged | 物品耐久是否被消耗 | Boolean |
    >  | itemA.isEnchanted | 物品是否已被附魔 | Boolean |
    >  | itemA.isEnchantingBook | 物品是否为附魔书 | Boolean |
    >  | itemA.isFireResistant | 物品是否防火 | Boolean |
    >  | itemA.isFullStack | 物品是否已堆叠到最大堆叠数 | Boolean |
    >  | itemA.isGlint | 物品是否闪烁 | Boolean |
    >  | itemA.isHorseArmorItem | 物品是否为马铠 | Boolean |
    >  | itemA.isLiquidClipItem | Whether the item is liquid clip | Boolean |
    >  | itemA.isMusicDiscItem | 物品是否为唱片 | Boolean |
    >  | itemA.isOffhandItem | 物品是否可设置到副手 | Boolean |
    >  | itemA.isPotionItem | 物品是否为药水 | Boolean |
    >  | itemA.isStackable | 物品是否可堆叠 | Boolean |
    >  | itemA.isWearableItem | 物品是否可穿戴 | Boolean |

    > `itemB`：物品栏第b格物品对象(b由设置决定)   
    > 同上

    > `itemArr`：物品栏数组  
    > 一个物品对象的数组  
    > 访问方式举例：itemArr[0] 表示第0格物品栏的物品对象, 获取物品对象后使用方式和itemA一致

    > `me`：使用者自己的玩家对象  
    > 物品属性请见[LL玩家文档](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Player)  
    > 下表中列出LL2.9.0版本中的玩家对象属性：
    >    | 属性 | 含义 | 类型 |
    >    | :-: | :-: | :-: |
    >    | me.name | 玩家名 | String |
    >    | me.pos | 玩家所在坐标 | FloatPos |
    >    | me.blockPos | 玩家所在的方块坐标 | IntPos |
    >    | me.lastDeathPos | 玩家上次死亡的坐标 | IntPos |
    >    | me.realName | 玩家的真实名字 | String |
    >    | me.xuid | 玩家XUID字符串 | String |
    >    | me.uuid | 玩家Uuid字符串 | String |
    >    | me.permLevel | 玩家的操作权限等级（0 - 4） | Integer |
    >    | me.gameMode | 玩家的游戏模式（0 - 3） | Integer |
    >    | me.canFly | 玩家是否可以飞行 | Boolean |
    >    | me.canSleep | 玩家是否可以睡觉 | Boolean |
    >    | me.canBeSeenOnMap | 玩家是否可以在地图上看到 | Boolean |
    >    | me.canFreeze | 玩家是否可以冻结 | Boolean |
    >    | me.canSeeDaylight | 玩家是否能看到日光 | Boolean |
    >    | me.canShowNameTag | 玩家是否可以显示姓名标签 | Boolean |
    >    | me.canStartSleepInBed | 玩家是否可以开始在床上睡觉 | Boolean |
    >    | me.canPickupItems | 玩家是否可以拾取物品 | Boolean |
    >    | me.maxHealth | 玩家最大生命值 | Integer |
    >    | me.health | 玩家当前生命值 | Integer |
    >    | me.inAir | 玩家当前是否悬空 | Boolean |
    >    | me.inWater | 玩家当前是否在水中 | Boolean |
    >    | me.inLava | 玩家是否在熔岩中 | Boolean |
    >    | me.inRain | 玩家是否下雨 | Boolean |
    >    | me.inSnow | 玩家是否在雪中 | Boolean |
    >    | me.inWall | 玩家是否在墙上 | Boolean |
    >    | me.inWaterOrRain | 玩家是否在水中或雨中 | Boolean |
    >    | me.inWorld | 玩家是否在世界 | Boolean |
    >    | me.inClouds | 玩家是否在云端 | Boolean |
    >    | me.sneaking | 玩家当前是否正在潜行 | Boolean |
    >    | me.speed | 玩家当前速度 | Float |
    >    | me.direction | 玩家当前朝向 | DirectionAngle |
    >    | me.uniqueId | 玩家（实体的）唯一标识符 | String |
    >    | me.langCode | 玩家设置的语言的标识符(形如zh_CN) | String |
    >    | me.isLoading | 玩家是否已经加载 | Boolean |
    >    | me.isInvisible | 玩家是否隐身中 | Boolean |
    >    | me.isInsidePortal | 玩家在传送门中 | Boolean |
    >    | me.isHurt | 玩家是否受伤 | Boolean |
    >    | me.isTrusting | 未知 | Boolean |
    >    | me.isTouchingDamageBlock | 玩家是否在能造成伤害的方块上 | Boolean |
    >    | me.isHungry | 玩家是否饿了 | Boolean |
    >    | me.isOnFire | 玩家是否着火 | Boolean |
    >    | me.isOnGround | 玩家是否在地上 | Boolean |
    >    | me.isOnHotBlock | 玩家是否在高温方块上（岩浆等） | Boolean |
    >    | me.isTrading | 玩家在交易 | Boolean |
    >    | me.isAdventure | 玩家是否是冒险模式 | Boolean |
    >    | me.isGliding | 玩家在滑行 | Boolean |
    >    | me.isSurvival | 玩家是否是生存模式 | Boolean |
    >    | me.isSpectator | 玩家是否是观众模式 | Boolean |
    >    | me.isRiding | 玩家是否在骑行 | Boolean |
    >    | me.isDancing | 玩家在跳舞？ | Boolean |
    >    | me.isCreative | 玩家是否是创造模式 | Boolean |
    >    | me.isFlying | 玩家是否在飞行 | Boolean |
    >    | me.isSleeping | 玩家是否正在睡觉 | Boolean |
    >    | me.isMoving | 玩家是否正在移动 | Boolean |
    >    | me.ip | 玩家设备IP地址 | String |

    示例: 
    | 指令 | 说明 |
    | :-: | :-: |
    | `"/give @s ${block.type} 1 ${block.tileData}"` | 给玩家一个快捷键点击到的方块 |
    | `'/give @s apple;/say "I get an apple"'` | 给玩家一个苹果后说“I get an apple” |
    | `"/say ${me.xuid}"` | 说出玩家自己的xuid值 |
    | `"/say ${itemArr[0].type}"` | 说出玩家第0号物品栏中物品的种类 |
    | `"/gamemode ${me.isSurvival ? 1 : 0}"` | 如果玩家为生存模式则设置为创造模式，否则设置为生存 |
    | `"/say ${me.pos.x * 2 + 1}"` | 说出现在玩家坐标x值的2倍加1 |

- `describe`：快捷键描述，一个简单的说明，不影响快捷键匹配
- `name`：物品名称，若不输入则匹配没有名字的物品作为快捷键

## 解除绑定
#### 指令

> /call \<tool | to :enum\> \<unbind | un :enum\> \<item :item\> \<right | left :enum> \[name :string\]

- `item`：绑定物品的id
- `type`：快捷键激活方式：`right`:右键激活 `left`:左键激活
- `name`：物品名称，若不输入则匹配没有名字的物品作为快捷键

## 列出快捷键

#### 指令

> /call \<shape | sh :enum\> \<list | li :enum\>

## 默认快捷键

!> 服务器后台管理员可更换默认快捷键，**实际快捷键**请**以服务器为准**

- [打开菜单](user/function/menu?id=%e6%89%93%e5%bc%80%e8%8f%9c%e5%8d%95-menu): **钟**`id: minecraft:clock`
- [设置选区a点](user/function/area?id=%e8%ae%be%e7%bd%ae%e9%80%89%e5%8c%baa%e7%82%b9)：**箭矢**`id: minecraft:arrow`
- [设置选区b点](user/function/area?id=%e8%ae%be%e7%bd%ae%e9%80%89%e5%8c%bab%e7%82%b9)：**木棍**`id: minecraft:stick`
- [轮流设定ab点](user/function/area?id=%e8%bd%ae%e6%b5%81%e8%ae%be%e5%ae%9aab%e7%82%b9)：**木斧**`id: minecraft:wooden_axe`
- [取消选区](/user/function/area?id=%e6%b8%85%e9%99%a4%e9%80%89%e5%8c%ba)：**剪刀**`id:minecraft:shears`
- [复制](user/function/other?id=%e5%a4%8d%e5%88%b6-copy)：**烈焰棒**`id: minecraft:blaze_rod`
- [粘贴](user/function/other?id=%e7%b2%98%e8%b4%b4-paste)：**骨头**`id: minecraft:bone`
- 编辑点击方块的属性：**绿宝石**`id: minecraft:wooden_emerald`
- 获取点击的方块：**木稿**`id: minecraft:wooden_pickaxe`