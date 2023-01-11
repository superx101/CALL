# 文档格式约定
为了更准确的描述等操作而**不产生二义性**，本文档将定义一个**表述规则**
## 指令描述规则
### param : type 表示参数
> param为参数名  
> type为参数类型  
> 例如：a:int 表示一个类型为int的参数a

### 参数类型表  
> 表格中给出了常见的类型，其他类型为自定义类型
>
> | 类型名 | 解释 | 示例 |
> | :----: | :----: | :----: |
> | int | 整数 | 0 |
> | float | 浮点数 | 0.1 |
> | string | 字符串 | "abc" |
> | boolean | 布尔型 | true |
> | enum | 枚举 | list |
> | x y z | 三维坐标 | 0 1 2 |
> | json | json对象 | {"x":0, "y":1} |
> | item | 物品 | minecraft:apple |
> | block | 方块 | minecraft:grass |

### 使用 | 展开表示枚举的所有值  
> CALL中每个参数都对应存在简化参数，利用 | 表示所有枚举项  
> 例如；
> > /call \<list | li :enum\>
>
> 表示的指令有 `/call list` 和 `/call li`
    

### 根指令不展开  
> 为了便于阅读，根指令call则不进行展开  
> 实际上根指令call有两种形式  
> 即`/call` 和 `/ca`

### 使用 \<\> 表示一个必选参数  
> 例如：
>
> > /call \<fill | fi :enum\>
>
>  中的 fill | fi 参数在指令中必须存在，不可省略

### 使用 \[\] 表示一个可选参数 
> \[\] 中的参数可不输入
> 例如：
>
> > /call \<save | sa\> [name :string]
>
> 可直接执行`/call save`

<!-- > /call [menu] -->