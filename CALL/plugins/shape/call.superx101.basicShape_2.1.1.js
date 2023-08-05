/// <reference path="../Shape.d.ts"/> 
/////////////////////////////////////////// common //////////////////////////////////////////////////
// i18n
i18n.load("plugins/CALL/plugins/shape/call.superx101.basicShape/lang.json", "zh_CN", {
    "zh_CN": {
        "title": "基础形状",
        "introduction": "CALL自带的一个简单形状包",
        "title.back": "返回上一级",
        "title.cube": "§l自由§2立方体",
        "title.plane": "§l自由§2平面",
        "title.line": "§l两点生成§2直线",
        "title.sphere": "§l§9球体",
        "title.ellipsoid": "§l自由§9椭球体",
        "title.cylinder": "§l自由§9圆柱体",
        "title.cone": "§l自由§9圆锥",
        "title.tutorial": "§l说明",
        "common_checkNumber.error1": "参数 {} 不合法, 请输入数字",
        "common_checkNumber.error2": "参数 {} 不能为负数",
        "common_checkVec3.error": "向量 {} 不能为空",
        "common_getBlockSNBT.warn": "未检测到物品栏方块, 使用默认材质",
        "common_checkSNBT.error": "材质为空, 请输入材质",
        "form.s0": "立方体参数",
        "form.s1": "材质: 从 {} 号物品栏选择\n: {}",
        "form.s2": "输入三维边长\n  x y z",
        "form.s3": "输入三个正数(空格隔开)",
        "form.s4": "输入生成位置\n  默认为当前坐标",
        "form.s5": "输入三个正数(空格隔开)",
        "form.s6": "绕轴旋转顺序(欧拉角)\n  注: 本选项的轴指物体的轴\n  并非世界绝对坐标轴\n",
        "form.s7": "绕x轴旋转角度",
        "form.s8": "绕y轴旋转角度",
        "form.s9": "绕z轴旋转角度",
        "form.s10": "平面参数",
        "form.s11": "材质: 从{}号物品栏选择\n:{}",
        "form.s12": "平面法向量(垂直平面的向量)\n  法向量默认向上",
        "form.s13": "输入三维向量(空格分割)",
        "form.s14": "输入尺寸 x z",
        "form.s14.5": "输入两个数(空格分割)",
        "form.s15": "输入生成位置\n默认为当前坐标",
        "form.s16": "输入三个正数(空格隔开)",
        "form.s17": "直线参数",
        "form.s18": "材质: 从{}号物品栏选择\n:{}",
        "form.s19": "输入点1 默认为您选区的点A坐标",
        "form.s20": "输入三个正数(空格隔开)",
        "form.s21": "输入点2 默认为您选区的点B坐标",
        "form.s22": "输入三个正数(空格隔开)",
        "form.s23": "球体参数",
        "form.s24": "材质: 从{}号物品栏选择\n:{}",
        "form.s25": "球体半径",
        "form.s26": "输入正整数",
        "form.s27": "是否空心",
        "form.s28": "输入生成位置\n默认为当前坐标",
        "form.s29": "输入三个正数(空格隔开)",
        "form.s30": "椭球体参数",
        "form.s31": "材质: 从{}号物品栏选择\n:{}",
        "form.s32": "椭球体半长轴abc",
        "form.s33": "输入三个正数(空格隔开)",
        "form.s34": "是否空心",
        "form.s35": "输入生成位置\n默认为当前坐标",
        "form.s36": "输入三个正数(空格隔开)",
        "form.s37": "  变换部分：",
        "form.s38": "绕轴旋转顺序(欧拉角)",
        "form.s39": "绕x轴旋转角度",
        "form.s40": "绕y轴旋转角度",
        "form.s41": "绕z轴旋转角度",
        "form.s42": "椭圆柱体参数",
        "form.s43": "材质: 从{}号物品栏选择\n:{}",
        "form.s44": "椭圆面半长轴: a b",
        "form.s45": "输入两个正数(空格隔开)",
        "form.s46": "高",
        "form.s47": "输入正数",
        "form.s48": "是否中空",
        "form.s49": "输入生成位置\n默认为当前坐标",
        "form.s50": "输入三个正数(空格隔开)",
        "form.s51": "  变换部分：",
        "form.s52": "绕轴旋转顺序(欧拉角)",
        "form.s53": "绕x轴旋转角度",
        "form.s54": "绕y轴旋转角度",
        "form.s55": "绕z轴旋转角度",
        "form.s56": "椭圆柱体参数",
        "form.s57": "材质: 从{}号物品栏选择\n:{}",
        "form.s58": "椭圆面半长轴: a b",
        "form.s59": "输入两个正数(空格隔开)",
        "form.s60": "高",
        "form.s61": "输入正数",
        "form.s62": "是否空心",
        "form.s63": "输入生成位置\n默认为当前坐标",
        "form.s64": "输入三个正数(空格隔开)",
        "form.s65": "  变换部分：",
        "form.s66": "绕轴旋转顺序(欧拉角)",
        "form.s67": "绕x轴旋转角度",
        "form.s68": "绕y轴旋转角度",
        "form.s69": "绕z轴旋转角度",
        "tutorial.context": `[基础概念介绍]:
        1.自由变换
            本形状包中的“自由变换”为任意角度的旋转
        2.生成位置
            默认的生成位置为您脚下
            您也可自定义生成位置
            形状包将以您指定的位置为中心生成形状
    [形状包介绍]:
        1.立方体
            生成立方体
            可自由变换角度
        2.平面
            生成平面
            可定义平面的法向量
            (即定义平面的朝向)
        3.直线
            根据您选区中的两点生成一条直线
            或自定义两点来生成直线
        4.球体
            根据半径生成球体
            可为空心    
        5.椭球体
            根据长半轴abc生成椭球体
            可为空心
            参数abc有关方程: x^2/a^2 + y^2/b^2 + z^2/c^2 = 1
        6.圆柱
            根据圆面(或椭圆)和高生成圆柱体
            可为中空
        7.圆锥
            根据圆面(或椭圆)和高生成圆锥
            可为空心
        `
    },
    "zh_TW": {
        "title": "基礎形狀",
        "introduction": "CALL自帶的一個簡單形狀包",
        "title.back": "返回上一級",
        "title.cube": "§l自由§2立方體",
        "title.plane": "§l自由§2平面",
        "title.line": "§l兩點生成§2直線",
        "title.sphere": "§l§9球體",
        "title.ellipsoid": "§l自由§9橢球體",
        "title.cylinder": "§l自由§9圓柱體",
        "title.cone": "§l自由§9圓錐",
        "title.tutorial": "§l說明",
        "common_checkNumber.error1": "參數 {} 不合法, 請輸入數字",
        "common_checkNumber.error2": "參數 {} 不能為負數",
        "common_checkVec3.error": "向量 {} 不能為空",
        "common_getBlockSNBT.warn": "未檢測到物品欄方塊, 使用默認材質",
        "common_checkSNBT.error": "材質為空, 請輸入材質",
        "form.s0": "立方體參數",
        "form.s1": "材質: 從 {} 號物品欄選擇\n: {}",
        "form.s2": "輸入三維邊長\n  x y z",
        "form.s3": "輸入三個正數(空格隔開)",
        "form.s4": "輸入生成位置\n  默認為當前坐標",
        "form.s5": "輸入三個正數(空格隔開)",
        "form.s6": "繞軸旋轉順序(歐拉角)\n  注: 本選項的軸指物體的軸\n  並非世界絕對坐標軸\n",
        "form.s7": "繞x軸旋轉角度",
        "form.s8": "繞y軸旋轉角度",
        "form.s9": "繞z軸旋轉角度",
        "form.s10": "平面參數",
        "form.s11": "材質: 從{}號物品欄選擇\n:{}",
        "form.s12": "平面法向量(垂直平面的向量)\n  法向量默認向上",
        "form.s13": "輸入三維向量(空格分割)",
        "form.s14": "輸入尺寸 x z",
        "form.s14.5": "輸入兩個數(空格分割)",
        "form.s15": "輸入生成位置\n默認為當前坐標",
        "form.s16": "輸入三個正數(空格隔開)",
        "form.s17": "直線參數",
        "form.s18": "材質: 從{}號物品欄選擇\n:{}",
        "form.s19": "輸入點1 默認為您選區的點A坐標",
        "form.s20": "輸入三個正數(空格隔開)",
        "form.s21": "輸入點2 默認為您選區的點B坐標",
        "form.s22": "輸入三個正數(空格隔開)",
        "form.s23": "球體參數",
        "form.s24": "材質: 從{}號物品欄選擇\n:{}",
        "form.s25": "球體半徑",
        "form.s26": "輸入正整數",
        "form.s27": "是否空心",
        "form.s28": "輸入生成位置\n默認為當前坐標",
        "form.s29": "輸入三個正數(空格隔開)",
        "form.s30": "橢球體參數",
        "form.s31": "材質: 從{}號物品欄選擇\n:{}",
        "form.s32": "橢球體半長軸abc",
        "form.s33": "輸入三個正數(空格隔開)",
        "form.s34": "是否空心",
        "form.s35": "輸入生成位置\n默認為當前坐標",
        "form.s36": "輸入三個正數(空格隔開)",
        "form.s37": "  變換部分：",
        "form.s38": "繞軸旋轉順序(歐拉角)",
        "form.s39": "繞x軸旋轉角度",
        "form.s40": "繞y軸旋轉角度",
        "form.s41": "繞z軸旋轉角度",
        "form.s42": "橢圓柱體參數",
        "form.s43": "材質: 從{}號物品欄選擇\n:{}",
        "form.s44": "橢圓面半長軸: a b",
        "form.s45": "輸入兩個正數(空格隔開)",
        "form.s46": "高",
        "form.s47": "輸入正數",
        "form.s48": "是否中空",
        "form.s49": "輸入生成位置\n默認為當前坐標",
        "form.s50": "輸入三個正數(空格隔開)",
        "form.s51": "  變換部分：",
        "form.s52": "繞軸旋轉順序(歐拉角)",
        "form.s53": "繞x軸旋轉角度",
        "form.s54": "繞y軸旋轉角度",
        "form.s55": "繞z軸旋轉角度",
        "form.s56": "橢圓柱體參數",
        "form.s57": "材質: 從{}號物品欄選擇\n:{}",
        "form.s58": "橢圓面半長軸: a b",
        "form.s59": "輸入兩個正數(空格隔開)",
        "form.s60": "高",
        "form.s61": "輸入正數",
        "form.s62": "是否空心",
        "form.s63": "輸入生成位置\n默認為當前坐標",
        "form.s64": "輸入三個正數(空格隔開)",
        "form.s65": "  變換部分：",
        "form.s66": "繞軸旋轉順序(歐拉角)",
        "form.s67": "繞x軸旋轉角度",
        "form.s68": "繞y軸旋轉角度",
        "form.s69": "繞z軸旋轉角度",
        "tutorial.context": `[基礎概念介紹]:
        1.自由變換
            本形狀包中的“自由變換”為任意角度的旋轉
        2.生成位置
            默認的生成位置為您腳下
            您也可自定義生成位置
            形狀包將以您指定的位置為中心生成形狀
    [形狀包介紹]:
        1.立方體
            生成立方體
            可自由變換角度
        2.平面
            生成平面
            可定義平面的法向量
            (即定義平面的朝向)
        3.直線
            根據您選區中的兩點生成一條直線
            或自定義兩點來生成直線
        4.球體
            根據半徑生成球體
            可為空心    
        5.橢球體
            根據長半軸abc生成橢球體
            可為空心
            參數abc有關方程: x^2/a^2 + y^2/b^2 + z^2/c^2 = 1
        6.圓柱
            根據圓面(或橢圓)和高生成圓柱體
            可為中空
        7.圓錐
            根據圓面(或橢圓)和高生成圓錐
            可為空心
        `
    },
    "en_US": {
        "title": "Basic Shape",
        "introduction": "A simple shape package that comes with CALL",
        "title.back": "Back to previous level",
        "title.cube": "§lFree§2 Cube",
        "title.plane": "§lFree§2 Plane",
        "title.line": "§lTwo points generate a §2 straight line",
        "title.sphere": "§l§9Sphere",
        "title.ellipsoid": "§lFree§9 Ellipsoid",
        "title.cylinder": "§lFree§9 Cylinder",
        "title.cone": "§lFree§9 Cone",
        "title.tutorial": "§lDescription",
        "common_checkNumber.error1": "The parameter {} is invalid, please enter a number",
        "common_checkNumber.error2": "The parameter {} cannot be negative",
        "common_checkVec3.error": "Vector {} cannot be empty",
        "common_getBlockSNBT.warn": "No inventory blocks detected, use default texture",
        "common_checkSNBT.error": "The material is empty, please enter the material",
        "form.s0": "Cube Parameters",
        "form.s1": "Material: Select from item {} \n : {}",
        "form.s2": "Enter 3D side length \n xy z",
        "form.s3": "Enter three positive numbers (separated by spaces)",
        "form.s4": "Enter the generated location \nThe default is the current coordinates",
        "form.s5": "Enter three positive numbers (separated by spaces)",
        "form.s6": "Rotation order around the axis (Euler angle) \ nNote: The axis of this option refers to the axis of the object \ nnot the absolute coordinate axis of the world \n ",
        "form.s7": "rotation angle around the x-axis",
        "form.s8": "rotation angle around the y-axis",
        "form.s9": "Rotation angle around z-axis",
        "form.s10": "Plane Parameters",
        "form.s11": "Material: Select from item {} \n :{}",
        "form.s12": "Plane normal vector (vertical plane vector) \nNormal vector is up by default",
        "form.s13": "Input 3D vector (separated by spaces)",
        "form.s14": "Enter size x z",
        "form.s14.5": "Enter two numbers (separated by spaces)",
        "form.s15": "Enter the generated location \nThe default is the current coordinates",
        "form.s16": "Enter three positive numbers (separated by spaces)",
        "form.s17": "Straight Line Parameters",
        "form.s18": "Material: Select from item {} \n :{}",
        "form.s19": "Input point 1 defaults to the coordinates of point A of your selection",
        "form.s20": "Enter three positive numbers (separated by spaces)",
        "form.s21": "Input point 2 defaults to point B coordinates of your selection",
        "form.s22": "Enter three positive numbers (separated by spaces)",
        "form.s23": "Sphere Parameters",
        "form.s24": "Material: Select from item {} \n :{}",
        "form.s25": "Sphere Radius",
        "form.s26": "Enter a positive integer",
        "form.s27": "whether hollow",
        "form.s28": "Enter the generated location \nThe default is the current coordinates",
        "form.s29": "Enter three positive numbers (separated by spaces)",
        "form.s30": "ellipsoid parameters",
        "form.s31": "Material: Select from item {} \n :{}",
        "form.s32": "ellipsoid semi-major axis abc",
        "form.s33": "Enter three positive numbers (separated by spaces)",
        "form.s34": "whether hollow",
        "form.s35": "Enter the generated location \nThe default is the current coordinates",
        "form.s36": "Enter three positive numbers (separated by spaces)",
        "form.s37": "Transform part:",
        "form.s38": "Rotation order around axis (Euler angles)",
        "form.s39": "Rotation angle around the x-axis",
        "form.s40": "rotation angle around the y-axis",
        "form.s41": "Rotation angle around z-axis",
        "form.s42": "Elliptic Cylinder Parameters",
        "form.s43": "Material: Select from item {} \n :{}",
        "form.s44": "Semi-major axis of ellipse: a b",
        "form.s45": "Enter two positive numbers (separated by spaces)",
        "form.s46": "height",
        "form.s47": "Enter a positive number",
        "form.s48": "whether hollow",
        "form.s49": "Enter the generated location \nThe default is the current coordinates",
        "form.s50": "Enter three positive numbers (separated by spaces)",
        "form.s51": "Transform part:",
        "form.s52": "Rotation order around axis (Euler angles)",
        "form.s53": "Rotation angle around the x-axis",
        "form.s54": "rotation angle around the y-axis",
        "form.s55": "Rotation angle around the z axis",
        "form.s56": "Elliptic Cylinder Parameters",
        "form.s57": "Material: Select from item {} \n :{}",
        "form.s58": "Semi-major axis of the ellipse: a b",
        "form.s59": "Enter two positive numbers (separated by spaces)",
        "form.s60": "height",
        "form.s61": "Enter a positive number",
        "form.s62": "whether hollow",
        "form.s63": "Enter the generated location \nThe default is the current coordinates",
        "form.s64": "Enter three positive numbers (separated by spaces)",
        "form.s65": "Transform part:",
        "form.s66": "Rotation order around axis (Euler angles)",
        "form.s67": "Rotation angle around the x-axis",
        "form.s68": "rotation angle around the y-axis",
        "form.s69": "Rotation angle around z-axis",
        "tutorial.context": `[Introduction to basic concepts]:
        1. Free Transformation
            The "free transformation" in this shape pack is rotation at any angle
        2. Generate location
            The default spawn location is under your feet
            You can also customize the build location
            The shapepack will generate the shape centered on the location you specify
[Shape pack introduction]:
        1. Cube
            generate cube
            Angle can be changed freely
        2. Plane
            generating plane
            The normal vector of the definable plane
            (i.e. define the orientation of the plane)
        3. Straight line
            Generates a line from two points in your selection
            Or customize two points to generate a straight line
        4. Sphere
            Generate a sphere based on radius
            Can be hollow       
        5. Ellipsoid
            Generate an ellipsoid based on the semi-major axis abc
            Can be hollow
            Parameter abc related equation: x^2/a^2 + y^2/b^2 + z^2/c^2 = 1
        6. Cylindrical
            Generate a cylinder from a circular face (or ellipse) and height
            Can be hollow
        7. Cone
            Generate a cone from a circular face (or ellipse) and height
            Can be hollow
`
    },
    "ru_RU": {
        "title": "Основная форма",
        "introduction": "Пакет простой формы, поставляемый с CALL",
        "title.back": "Вернуться на предыдущий уровень",
        "title.cube": "§lКуб свободы§2",
        "title.plane": "§lПлоскость Свободы§2",
        "title.line": "§lДве точки образуют прямую линию §2",
        "title.sphere": "§l§9Sphere",
        "title.ellipsoid": "§lFree§9 Эллипсоид",
        "title.cylinder": "§lСвобода§9 Цилиндр",
        "title.cone": "§lСвободный§9 Конус",
        "title.tutorial": "§lОписание",
        "common_checkNumber.error1": "Параметр {} недействителен, введите число",
        "common_checkNumber.error2": "Параметр {} не может быть отрицательным",
        "common_checkVec3.error": "Вектор {} не может быть пустым",
        "common_getBlockSNBT.warn": "Блок инвентаря не обнаружен, используется текстура по умолчанию",
        "common_checkSNBT.error": "Материал пуст, введите материал",
        "form.s0": "Параметры куба",
        "form.s1": "Материал: Выберите из пункта {}\n: {}",
        "form.s2": "Введите длину стороны 3D\n x y z",
        "form.s3": "Введите три положительных числа (разделенных пробелами)",
        "form.s4": "Введите место появления\n По умолчанию используются текущие координаты",
        "form.s5": "Введите три положительных числа (разделенных пробелами)",
        "form.s6": "Порядок вращения вокруг оси (угол Эйлера)\n Примечание: ось этой опции относится к оси объекта\n, а не к оси абсолютных координат мира\n",
        "form.s7": "Угол поворота вокруг оси X",
        "form.s8": "Угол поворота вокруг оси Y",
        "form.s9": "Угол поворота вокруг оси Z",
        "form.s10": "Параметры плоскости",
        "form.s11": "Материал: Выберите из пункта {}\n:{}",
        "form.s12": "Вектор нормали к плоскости (вектор вертикальной плоскости)\n По умолчанию вектор нормали направлен вверх",
        "form.s13": "Введите трехмерный вектор (разделенный пробелами)",
        "form.s14": "Введите размер x z",
        "form.s14.5": "Введите два числа (разделенные пробелами)",
        "form.s15": "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
        "form.s16": "Введите три положительных числа (разделенных пробелами)",
        "form.s17": "Параметры прямой линии",
        "form.s18": "Материал: Выберите из пункта {}\n:{}",
        "form.s19": "Введите точку 1, по умолчанию это координаты выбранной вами точки А",
        "form.s20": "Введите три положительных числа (разделенных пробелами)",
        "form.s21": "Введите точку 2 по умолчанию с координатами точки B по вашему выбору",
        "form.s22": "Введите три положительных числа (разделенных пробелами)",
        "form.s23": "Параметры сферы",
        "form.s24": "Материал: Выберите из пункта {}\n:{}",
        "form.s25": "Радиус сферы",
        "form.s26": "Введите положительное целое число",
        "form.s27": "То ли пустотелый",
        "form.s28": "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
        "form.s29": "Введите три положительных числа (разделенных пробелами)",
        "form.s30": "Параметры эллипсоида",
        "form.s31": "Материал: Выберите из пункта {}\n:{}",
        "form.s32": "Большая полуось эллипсоида abc",
        "form.s33": "Введите три положительных числа (разделенных пробелами)",
        "form.s34": "То ли пустотелый",
        "form.s35": "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
        "form.s36": "Введите три положительных числа (разделенных пробелами)",
        "form.s37": "Преобразовать часть:",
        "form.s38": "Порядок вращения оси (углы Эйлера)",
        "form.s39": "Угол поворота вокруг оси x",
        "form.s40": "Угол поворота вокруг оси Y",
        "form.s41": "Угол поворота вокруг оси Z",
        "form.s42": "Параметры эллиптического цилиндра",
        "form.s43": "Материал: Выберите из пункта {}\n:{}",
        "form.s44": "Большая полуось эллипса: a b",
        "form.s45": "Введите два положительных числа (разделенных пробелами)",
        "form.s46": "Высота",
        "form.s47": "Введите положительное число",
        "form.s48": "Будь то пустотелая",
        "form.s49": "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
        "form.s50": "Введите три положительных числа (разделенных пробелами)",
        "form.s51": "Преобразовать часть:",
        "form.s52": "Порядок вращения вокруг оси (угол Эйлера)",
        "form.s53": "Угол поворота вокруг оси x",
        "form.s54": "Угол поворота вокруг оси Y",
        "form.s55": "Угол поворота вокруг оси Z",
        "form.s56": "Параметры эллиптического цилиндра",
        "form.s57": "Материал: Выберите из пункта {}\n:{}",
        "form.s58": "Большая полуось эллипса: a b",
        "form.s59": "Введите два положительных числа (разделенных пробелами)",
        "form.s60": "Высота",
        "form.s61": "Введите положительное число",
        "form.s62": "То ли пустотелый",
        "form.s63": "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
        "form.s64": "Введите три положительных числа (разделенных пробелами)",
        "form.s65": "Преобразовать часть:",
        "form.s66": "Порядок вращения оси (угол Эйлера)",
        "form.s67": "Угол поворота вокруг оси x",
        "form.s68": "Угол поворота вокруг оси Y",
        "form.s69": "Угол поворота вокруг оси Z",
        "tutorial.context": `[Введение в основные понятия]:
         1. Свободная трансформация
             «Свободная трансформация» в этом пакете форм — это вращение под любым углом.
         2. Создать местоположение
             Место возрождения по умолчанию — у вас под ногами.
             Вы также можете настроить место сборки
             Shapepack создаст фигуру с центром в указанном вами месте.
     [Введение пакета формы]:
         1. Куб
             сгенерировать куб
             Угол можно свободно менять
         2. Самолет
             производящая плоскость
             Нормальный вектор определимой плоскости
             (т.е. определить ориентацию плоскости)
         3. Прямая линия
             Создает линию из двух точек в вашем выборе
             Или настройте две точки, чтобы создать прямую линию
         4. Сфера
             Создание сферы на основе радиуса
             Может быть полым
         5. Эллипсоид
             Создайте эллипсоид на основе большой полуоси abc
             Может быть полым
             Уравнение, связанное с параметром abc: x^2/a^2 + y^2/b^2 + z^2/c^2 = 1
         6. Цилиндрический
             Создайте цилиндр из круглой грани (или эллипса) и высоты
             Может быть полым
         7. Конус
             Создайте конус из круглой грани (или эллипса) и высоты
             Может быть полым
         `
    }
});

function info(langCode) {
    return {
        name: i18n.trl(langCode, "title"),
        introduction: i18n.trl(langCode, "introduction"),
    }
}

//Bounding box
class Box {
    constructor(min = new SHP.THREE.Vector3(+ Infinity, + Infinity, + Infinity), max = new SHP.THREE.Vector3(- Infinity, - Infinity, - Infinity)) {
        this.min = min;
        this.max = max;
    }

    set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }

    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }

    clone() {
        return new this.constructor().copy(this);
    }

    setFromVector3(array) {
        let minX = + Infinity;
        let minY = + Infinity;
        let minZ = + Infinity;
        let maxX = - Infinity;
        let maxY = - Infinity;
        let maxZ = - Infinity;

        for (let i = 0, l = array.length; i < l; i++) {
            const x = Math.round(array[i].x);
            const y = Math.round(array[i].y);
            const z = Math.round(array[i].z);

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;
        }
        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    }
}

//Cube
class Cube {
    constructor(box) {
        this.arr = [];
        this.boundingBox = box.clone();
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.min.y, box.min.z)) // 左下前
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.min.y, box.min.z)) // 右下前
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.max.y, box.min.z)) // 左上前
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.max.y, box.min.z)) // 右上前
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.min.y, box.max.z)) // 左下后
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.min.y, box.max.z)) // 右下后
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.max.y, box.max.z)) // 左上后
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.max.y, box.max.z)) // 右上后
    }

    applyMatrix4(m4) {
        this.arr.forEach(v3 => {
            v3.applyMatrix4(m4);
        })
        return this;
    }

    getBoundingBox() {
        return this.boundingBox.setFromVector3(this.arr);
    }
}

//几何体定义
class Geometry {
    constructor() {
        this.boundingBox = null;
    }
    computeBoundingBox() { }
    isPointInsideGeometry() { }
    isPointOnSurface() { }
    transformedBoundingBox(m4) {
        this.boundingBox = new Cube(this.boundingBox)
            .applyMatrix4(m4)
            .getBoundingBox();
        return this;
    }
}

//检查数字参数
function common_checkNumber(langCode, p, negative = true) {
    if (p == null || typeof (p) != "number") throw new Error(i18n.trl(langCode, "common_checkNumber.error1", `${p}`));
    else if (p < 0 && !negative) throw new Error(i18n.trl(langCode, "common_checkNumber.error2", `${p}`))
}

//检查向量参数
function common_checkVec3(langCode, v3, negative = true) {
    if (v3 != null) {
        common_checkNumber(langCode, v3.x, negative);
        common_checkNumber(langCode, v3.y, negative);
        common_checkNumber(langCode, v3.z, negative);
    }
    else {
        throw new Error(i18n.trl(langCode, "common_checkVec3.error", `${v3}`));
    }
}

//从item获取方块SNBT
function common_getBlockSNBT(item, player) {
    try {
        return item.getNbt().getTag("Block").toString();
    }
    catch (e) {
        SHP.Message.warn(player, i18n.trl(player.langCode, "common_getBlockSNBT.warn"))
    }
    return '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}';
}

function common_checkSNBT(langCode, snbt) {
    if (snbt == null) throw new Error(i18n.trl(langCode, "common_checkSNBT.error"))
}

//遍历包围盒
function common_boxForeach(box, isOddX, isOddY, isOddZ, snbt, callback) {
    const arr = [];
    const nx = isOddX ? 0 : 0.5;
    const ny = isOddY ? 0 : 0.5;
    const nz = isOddZ ? 0 : 0.5;

    for (let x = box.min.x + nx; x <= box.max.x + nx; x++) {
        for (let y = box.min.y + ny; y <= box.max.y + ny; y++) {
            for (let z = box.min.z + nz; z <= box.max.z + nz; z++) {
                if (callback(x, y, z)) {
                    arr.push(SHP.setBlock(x - nx, y - ny, z - nz, snbt, null));
                }
            }
        }
    }

    if (arr.length == 0)
        arr.push(SHP.setBlock(0, 0, 0, snbt, null));

    return arr;
}

/////////////////////////////////////////// common end //////////////////////////////////////////////////

/////////////////////////////////////////// cube //////////////////////////////////////////////////
//简单的立方体体素化算法
function cube_simpleCubeVoxelization(cube, m4, SNBT) {
    const arr = [];

    //变换前包围盒
    cube.center();
    cube.computeBoundingBox();
    let pre_box = cube.boundingBox.clone();

    //逆矩阵
    let m4_i = m4.clone().invert();

    //包围盒
    cube.applyMatrix4(m4);
    cube.computeBoundingBox();
    let box = cube.boundingBox;

    //遍历包围盒求体素
    for (let x = box.min.x + 0.5; x < box.max.x; x++) {
        for (let y = box.min.y + 0.5; y < box.max.y; y++) {
            for (let z = box.min.z + 0.5; z < box.max.z; z++) {
                //方体变换后求点是否在内部 == 点反向变换后求是否在方体内部
                const v4 = SHP.getVector4(x, y, z, 1).applyMatrix4(m4_i);
                if (pre_box.containsPoint(v4)) {
                    arr.push(SHP.setBlock(Math.round(x), Math.round(y), Math.round(z), SNBT, null));
                }
            }
        }
    }
    return arr;
}

//立方体参数表单
function cube_form(player, index, intPos, plData) {
    let orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s0"))
        .addLabel(i18n.trl(player.langCode, "form.s1", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s2"), i18n.trl(player.langCode, "form.s3"))
        .addInput(i18n.trl(player.langCode, "form.s4"), i18n.trl(player.langCode, "form.s5"), `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addStepSlider(i18n.trl(player.langCode, "form.s6"), orderArr)
        .addSlider(i18n.trl(player.langCode, "form.s7"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s8"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s9"), 0, 360, 1, 0)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            //材质
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            //边长
            strs = data[1].split(" ");
            json.x = parseInt(strs[0]);
            json.y = parseInt(strs[1]);
            json.z = parseInt(strs[2]);

            //生成点
            strs = data[2].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            json.order = orderArr[data[3]];//绕轴旋转顺序
            //旋转值
            json.xrote = parseFloat(data[4]);
            json.yrote = parseFloat(data[5]);
            json.zrote = parseFloat(data[6]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    })
}

//生成立方体
function cube_generate(param, player, itemA) {
    common_checkVec3(player.langCode, param, false);
    common_checkNumber(player.langCode, param.xrote, false);
    common_checkNumber(player.langCode, param.yrote, false);
    common_checkNumber(player.langCode, param.zrote, false);
    common_checkSNBT(player.langCode, param.snbt);

    let cube = new SHP.THREE.BoxGeometry(param.x, param.y, param.z, 1, 1, 1);
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);//旋转变换矩阵
    return cube_simpleCubeVoxelization(cube, m4, param.snbt);
}
/////////////////////////////////////////// cube end //////////////////////////////////////////////////

/////////////////////////////////////////// plane //////////////////////////////////////////////////
//平面参数表单
function plane_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s10"))
        .addLabel(i18n.trl(player.langCode, "form.s11", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s12"), i18n.trl(player.langCode, "form.s13"), "0 1 0")
        .addInput(i18n.trl(player.langCode, "form.s14"), i18n.trl(player.langCode, "form.s14.5"))
        .addInput(i18n.trl(player.langCode, "form.s15"), i18n.trl(player.langCode, "form.s16"), `${intPos.x} ${intPos.y} ${intPos.z}`)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.v = {};
            json.v.x = parseInt(strs[0]);
            json.v.y = parseInt(strs[1]);
            json.v.z = parseInt(strs[2]);
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            strs = data[2].split(" ");
            json.x = parseInt(strs[0]);
            json.z = parseInt(strs[1]);

            strs = data[3].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    });
}

//生成平面
function plane_generate(param, player, itemA) {
    common_checkVec3(player.langCode, param.v);
    common_checkNumber(player.langCode, param.x, false);
    common_checkNumber(player.langCode, param.z, false);
    common_checkSNBT(player.langCode, param.snbt);

    let cube = new SHP.THREE.BoxGeometry(param.x, 1, param.z, 1, 1, 1);
    let va = SHP.getVector3(0, 1, 0);
    let vb = SHP.getVector3(param.v.x, param.v.y, param.v.z);
    let angle = va.angleTo(vb);//向量之间的角度
    va.cross(vb);//叉积(求垂直两个向量的向量)

    let m4 = SHP.getMAT4().makeRotationAxis(va.normalize(), angle);
    return cube_simpleCubeVoxelization(cube, m4, param.snbt);
}
/////////////////////////////////////////// plane end //////////////////////////////////////////////////

/////////////////////////////////////////// line //////////////////////////////////////////////////
//直线参数表单
function line_form(player, index, intPos, plData) {
    let posAStr = plData.posA == null ? "" : `${plData.posA.x} ${plData.posA.y} ${plData.posA.z}`;
    let posBStr = plData.posB == null ? "" : `${plData.posB.x} ${plData.posB.y} ${plData.posB.z}`;
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s17"))
        .addLabel(i18n.trl(player.langCode, "form.s18", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s19"), i18n.trl(player.langCode, "form.s20"), posAStr)
        .addInput(i18n.trl(player.langCode, "form.s21"), i18n.trl(player.langCode, "form.s22"), posBStr)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.x = parseInt(strs[0]);
            json.y = parseInt(strs[1]);
            json.z = parseInt(strs[2]);
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            strs = data[2].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    });
}

//生成直线
function line_generate(param, intPos, player, itemA) {
    common_checkVec3(player.langCode, param);
    common_checkSNBT(player.langCode, param.snbt);

    let shape = {};

    let va = SHP.getVector3(0, 0, 1);
    let v = SHP.getVector3(param.x, param.y, param.z)
    v.sub(SHP.getVector3(intPos.x, intPos.y, intPos.z)); // line vector
    let cube = new SHP.THREE.BoxGeometry(1, 1, v.length() + 1, 1, 1, 1);
    let angle = va.angleTo(v); // angle between line and va

    let axisV = va.cross(v).normalize();// get axis from va and v
    let m4 = SHP.getMAT4().makeRotationAxis(axisV, angle);// get Rotation Matrix from axis and angle
    shape.arr = cube_simpleCubeVoxelization(cube, m4, param.snbt);
    shape.pos = mc.newIntPos(Math.round((param.x + intPos.x) / 2), Math.round((param.y + intPos.y) / 2), Math.round((param.z + intPos.z) / 2), intPos.dimid);
    return shape;
}

/////////////////////////////////////////// line end //////////////////////////////////////////////////

/////////////////////////////////////////// Sphere //////////////////////////////////////////////////
class Sphere extends Geometry {
    constructor(r) {
        super();
        this.r = r;
        this.computeBoundingBox();
        this.r2 = this.r ** 2;
        this.rn = this.r2 - 2 * this.r + 1;
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.r, -this.r, -this.r), new SHP.THREE.Vector3(this.r, this.r, this.r));
    }
    isPointInsideGeometry(x, y, z) {
        return x ** 2 + y ** 2 + z ** 2 <= this.r2;
    }
    isPointOnSurface(x, y, z) {
        const d = x ** 2 + y ** 2 + z ** 2;
        return d > this.rn && d <= this.r2;//[0 <= (d - r) < 1] == [r^2-2r+1 < d^2 <= r^2] 
    }
}

//球体表单
function sphere_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;

    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s23"))
        .addLabel(i18n.trl(player.langCode, "form.s24", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s25"), i18n.trl(player.langCode, "form.s26"), "")
        .addSwitch(i18n.trl(player.langCode, "form.s27"), false)
        .addInput(i18n.trl(player.langCode, "form.s28"), i18n.trl(player.langCode, "form.s29"), `${intPos.x} ${intPos.y} ${intPos.z}`)


    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            json.r = parseInt(data[1]);
            json.isHollow = data[2];
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            strs = data[3].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    });
}

//球体生成
function sphere_generate(param, player, itemA) {
    common_checkNumber(player.langCode, param.r, false);
    common_checkSNBT(player.langCode, param.snbt);

    const sphere = new Sphere(param.r);
    const isOdd = (sphere.r % 2 != 0);

    if (param.isHollow) {
        return common_boxForeach(sphere.boundingBox, isOdd, isOdd, isOdd, param.snbt, (x, y, z) => {
            return sphere.isPointOnSurface(x, y, z);
        })
    }
    else {
        return common_boxForeach(sphere.boundingBox, isOdd, isOdd, isOdd, param.snbt, (x, y, z) => {
            return sphere.isPointInsideGeometry(x, y, z);
        })
    }
}
/////////////////////////////////////////// Sphere end //////////////////////////////////////////////////

/////////////////////////////////////////// Ellipsoid //////////////////////////////////////////////////
class Ellipsiod extends Geometry {
    constructor(a, b, c) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
        this.a2 = a ** 2;
        this.b2 = b ** 2;
        this.c2 = c ** 2;
        this.a_2 = (a - 1) ** 2;
        this.b_2 = (b - 1) ** 2;
        this.c_2 = (c - 1) ** 2;
        this.p = {
            a: this.a == 1,
            b: this.b == 1,
            c: this.c == 1,
        }
        this.computeBoundingBox();
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.a, -this.b, -this.c), new SHP.THREE.Vector3(this.a, this.b, this.c));
    }
    isPointInsideGeometry(x, y, z) {
        return x ** 2 / this.a2 + y ** 2 / this.b2 + z ** 2 / this.c2 <= 1;
    }
    isPointOnSurface(x, y, z) {
        const x2 = x ** 2;
        const y2 = y ** 2;
        const z2 = z ** 2;
        const p1 = this.p.a ? 0 : x2 / this.a_2
        const p2 = this.p.b ? 0 : y2 / this.b_2
        const p3 = this.p.c ? 0 : z2 / this.c_2

        return p1 + p2 + p3 >= 1 && x2 / this.a2 + y2 / this.b2 + z2 / this.c2 <= 1;
    }
}

//椭球表单
function ellipsoid_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s30"))
        .addLabel(i18n.trl(player.langCode, "form.s31", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s32"), i18n.trl(player.langCode, "form.s33"), "")
        .addSwitch(i18n.trl(player.langCode, "form.s34"), false)
        .addInput(i18n.trl(player.langCode, "form.s35"), i18n.trl(player.langCode, "form.s36"), `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addLabel(i18n.trl(player.langCode, "form.s37"))
        .addStepSlider(i18n.trl(player.langCode, "form.s38"), orderArr)
        .addSlider(i18n.trl(player.langCode, "form.s39"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s40"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s41"), 0, 360, 1, 0)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.a = parseInt(strs[0]);
            json.b = parseInt(strs[1]);
            json.c = parseInt(strs[2]);
            json.isHollow = data[2];
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            //生成位置
            strs = data[3].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            json.order = orderArr[data[5]];//绕轴旋转顺序
            //旋转值
            json.xrote = parseFloat(data[6]);
            json.yrote = parseFloat(data[7]);
            json.zrote = parseFloat(data[8]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    });
}

//椭球生成
function ellipsoid_generate(param, player, itemA) {
    common_checkNumber(player.langCode, param.xrote, false);
    common_checkNumber(player.langCode, param.yrote, false);
    common_checkNumber(player.langCode, param.zrote, false);
    common_checkNumber(player.langCode, param.a, false);
    common_checkNumber(player.langCode, param.b, false);
    common_checkNumber(player.langCode, param.c, false);
    common_checkSNBT(player.langCode, param.snbt);

    const ellipsoid = new Ellipsiod(param.a, param.b, param.c);
    const isOddX = (ellipsoid.a % 2 != 0);
    const isOddY = (ellipsoid.b % 2 != 0);
    const isOddZ = (ellipsoid.c % 2 != 0);
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);//变换矩阵
    let m4_i = m4.clone().invert();//逆矩阵

    //变换后包围盒
    ellipsoid.transformedBoundingBox(m4);
    const box = ellipsoid.boundingBox;

    if (param.isHollow) {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            //逆变换点后根据原几何体进行判断
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return ellipsoid.isPointOnSurface(v3.x, v3.y, v3.z);
        })
    }
    else {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return ellipsoid.isPointInsideGeometry(v3.x, v3.y, v3.z);
        })
    }
}

/////////////////////////////////////////// Ellipsoid end //////////////////////////////////////////////////

/////////////////////////////////////////// Cylinder //////////////////////////////////////////////////
class Cylinder extends Geometry {
    constructor(a, b, h) {
        super();
        this.a = a;
        this.b = b;
        this.h = h;
        this.a2 = a ** 2;
        this.b2 = b ** 2;
        this.a_2 = (a - 1) ** 2;
        this.b_2 = (b - 1) ** 2;
        this.h_half = h / 2;
        this.h_half_n = -this.h_half;
        this.p = {
            a: this.a == 1,
            b: this.b == 1,
        }

        this.computeBoundingBox();
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.a, -this.h_half, -this.b), new SHP.THREE.Vector3(this.a, this.h_half, this.b));
    }
    isPointInsideGeometry(x, y, z) {
        return x ** 2 / this.a2 + z ** 2 / this.b2 <= 1 && this.h_half >= (y < 0 ? -y : y);
    }
    isPointOnSurface(x, y, z) {
        const x2 = x ** 2;
        const z2 = z ** 2;
        const p1 = this.p.a ? 0 : x2 / this.a_2
        const p2 = this.p.b ? 0 : z2 / this.b_2

        return p1 + p2 >= 1 && x2 / this.a2 + z2 / this.b2 <= 1 && this.h_half >= (y < 0 ? -y : y);
    }
}

//椭圆柱表单
function cylinder_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s42"))
        .addLabel(i18n.trl(player.langCode, "form.s43", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s44"), i18n.trl(player.langCode, "form.s45"), "")
        .addInput(i18n.trl(player.langCode, "form.s46"), i18n.trl(player.langCode, "form.s47"), "")
        .addSwitch(i18n.trl(player.langCode, "form.s48"), false)
        .addInput(i18n.trl(player.langCode, "form.s49"), i18n.trl(player.langCode, "form.s50"), `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addLabel(i18n.trl(player.langCode, "form.s51"))
        .addStepSlider(i18n.trl(player.langCode, "form.s52"), orderArr)
        .addSlider(i18n.trl(player.langCode, "form.s53"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s54"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s55"), 0, 360, 1, 0)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.a = parseInt(strs[0]);
            json.b = parseInt(strs[1]);
            json.h = parseInt(data[2]);
            json.isHollow = data[3];
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            //生成位置
            strs = data[4].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            json.order = orderArr[data[6]];//绕轴旋转顺序
            //旋转值
            json.xrote = parseFloat(data[7]);
            json.yrote = parseFloat(data[8]);
            json.zrote = parseFloat(data[9]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    });
}

//椭圆柱生成
function cylinder_generate(param, player, itemA) {
    common_checkNumber(player.langCode, param.xrote, false);
    common_checkNumber(player.langCode, param.yrote, false);
    common_checkNumber(player.langCode, param.zrote, false);
    common_checkNumber(player.langCode, param.a, false);
    common_checkNumber(player.langCode, param.b, false);
    common_checkNumber(player.langCode, param.h, false);
    common_checkSNBT(player.langCode, param.snbt);

    const cylinder = new Cylinder(param.a, param.b, param.h);
    const isOddX = (cylinder.a % 2 != 0);
    const isOddY = (cylinder.h % 2 != 0);
    const isOddZ = (cylinder.b % 2 != 0)
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);//变换矩阵
    let m4_i = m4.clone().invert();//逆矩阵

    //变换后包围盒
    cylinder.transformedBoundingBox(m4);
    const box = cylinder.boundingBox;

    if (param.isHollow) {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            //逆变换点后根据原几何体进行判断
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cylinder.isPointOnSurface(v3.x, v3.y, v3.z);
        })
    }
    else {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cylinder.isPointInsideGeometry(v3.x, v3.y, v3.z);
        })
    }
}
/////////////////////////////////////////// Cylinder end //////////////////////////////////////////////////

/////////////////////////////////////////// Cone //////////////////////////////////////////////////
class Cone extends Geometry {
    constructor(a, b, h) {
        super();
        this.a = a;
        this.b = b;
        this.h = h;
        this.a2 = a ** 2;
        this.b2 = b ** 2;
        this.h_ = h - 1;
        this.a_2 = (a - 1.2) ** 2;
        this.b_2 = (b - 1.2) ** 2;
        this.p = {
            a: this.a == 1,
            b: this.b == 1,
        }

        this.computeBoundingBox();
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.a, -1, -this.b), new SHP.THREE.Vector3(this.a, this.h + 1, this.b));
    }
    isPointInsideGeometry(x, y, z) {
        const n = this.h / (this.h - y);
        return (x ** 2 / this.a2 + z ** 2 / this.b2) * n <= 1 && y <= this.h && y >= 0;
    }
    isPointOnSurface(x, y, z) {
        const x2 = x ** 2;
        const z2 = z ** 2;

        if (y >= this.h_)
            return (x2 / this.a2 + z2 / this.b2) * this.h / (this.h - y) <= 1 && y <= this.h;
        else
            return (x2 / this.a2 + z2 / this.b2) * this.h / (this.h - y) <= 1 && (x2 / this.a_2 + z2 / this.b_2) * this.h_ / (this.h_ - y) >= 1 && y <= this.h && y >= 0;
    }
}

//圆锥表单
function cone_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

    let form = mc.newCustomForm()
        .setTitle(i18n.trl(player.langCode, "form.s56"))
        .addLabel(i18n.trl(player.langCode, "form.s57", `${plData.itemAIndex + 1}`, `${itemStr}`))
        .addInput(i18n.trl(player.langCode, "form.s58"), i18n.trl(player.langCode, "form.s59"), "")
        .addInput(i18n.trl(player.langCode, "form.s60"), i18n.trl(player.langCode, "form.s61"), "")
        .addSwitch(i18n.trl(player.langCode, "form.s62"), false)
        .addInput(i18n.trl(player.langCode, "form.s63"), i18n.trl(player.langCode, "form.s64"), `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addLabel(i18n.trl(player.langCode, "form.s65"))
        .addStepSlider(i18n.trl(player.langCode, "form.s66"), orderArr)
        .addSlider(i18n.trl(player.langCode, "form.s67"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s68"), 0, 360, 1, 0)
        .addSlider(i18n.trl(player.langCode, "form.s69"), 0, 360, 1, 0)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.a = parseInt(strs[0]);
            json.b = parseInt(strs[1]);
            json.h = parseInt(data[2]);
            json.isHollow = data[3];
            json.snbt = common_getBlockSNBT(plData.itemA, player);

            //生成位置
            strs = data[4].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            json.order = orderArr[data[6]];//绕轴旋转顺序
            //旋转值
            json.xrote = parseFloat(data[7]);
            json.yrote = parseFloat(data[8]);
            json.zrote = parseFloat(data[9]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
        else {
            menu(player, intPos);
        }
    });
}

//圆锥生成
function cone_generate(param, player, itemA) {
    common_checkNumber(player.langCode, param.xrote, false);
    common_checkNumber(player.langCode, param.yrote, false);
    common_checkNumber(player.langCode, param.zrote, false);
    common_checkNumber(player.langCode, param.a, false);
    common_checkNumber(player.langCode, param.b, false);
    common_checkNumber(player.langCode, param.h, false);
    common_checkSNBT(player.langCode, param.snbt);

    const cone = new Cone(param.a, param.b, param.h);
    const isOddX = (cone.a % 2 != 0);
    const isOddY = (cone.h % 2 != 0);
    const isOddZ = (cone.b % 2 != 0)
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);//变换矩阵
    let m4_i = m4.clone().invert();//逆矩阵

    //变换后包围盒
    cone.transformedBoundingBox(m4);
    const box = cone.boundingBox;

    if (param.isHollow) {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            //逆变换点后根据原几何体进行判断
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cone.isPointOnSurface(v3.x, v3.y, v3.z);
        })
    }
    else {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cone.isPointInsideGeometry(v3.x, v3.y, v3.z);
        })
    }
}
/////////////////////////////////////////// Cone end //////////////////////////////////////////////////

/////////////////////////////////////////// global //////////////////////////////////////////////////
function cmd(player, index, intPos, param) {
    try {
        let plData = SHP.getData(player);
        let shape = { pos: null, arr: null };
        switch (index) {
            case 0:
                shape.arr = cube_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 1:
                shape.arr = plane_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 2:
                shape = line_generate(param, intPos, player, plData.itemA);
                break;
            case 3:
                shape.arr = sphere_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 4:
                shape.arr = ellipsoid_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 5:
                shape.arr = cylinder_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 6:
                shape.arr = cone_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
        }
        return shape;
    } catch (e) {
        SHP.Message.error(player, e.message);
    }
}

function tutorial_form(player, intPos) {
    let form = mc.newSimpleForm()
        .setTitle(i18n.trl(player.langCode, "title.tutorial"))
        .setContent(i18n.trl(player.langCode, "tutorial.context"))

    player.sendForm(form, (pl, data) => {
        if (data == null) {
            menu(player, intPos);
        }
    })
}

function menu(player, intPos) {
    let back = 0;
    try {
        let plData = SHP.getData(player);
        let lang = player.langCode;
        let form = mc.newSimpleForm()
            .setTitle(i18n.trl(lang, "title"))
            .setContent(i18n.trl(lang, "introduction"))
            .addButton(i18n.trl(lang, "title.back"), "")
            .addButton(i18n.trl(lang, "title.cube"), "")
            .addButton(i18n.trl(lang, "title.plane"), "")
            .addButton(i18n.trl(lang, "title.line"), "")
            .addButton(i18n.trl(lang, "title.sphere"), "")
            .addButton(i18n.trl(lang, "title.ellipsoid"), "")
            .addButton(i18n.trl(lang, "title.cylinder"), "")
            .addButton(i18n.trl(lang, "title.cone"), "")
            .addButton(i18n.trl(lang, "title.tutorial"), "")

        player.sendForm(form, (pl, index) => {
            switch (index) {
                case 0:
                    SHP.listForm(player);
                    break;
                case 1:
                    cube_form(player, index - 1, intPos, plData);
                    break;
                case 2:
                    plane_form(player, index - 1, intPos, plData);
                    break;
                case 3:
                    line_form(player, index - 1, intPos, plData);
                    break;
                case 4:
                    sphere_form(player, index - 1, intPos, plData);
                    break;
                case 5:
                    ellipsoid_form(player, index - 1, intPos, plData);
                    break;
                case 6:
                    cylinder_form(player, index - 1, intPos, plData);
                    break;
                case 7:
                    cone_form(player, index - 1, intPos, plData);
                    break;
                case 8:
                    tutorial_form(player, intPos);
                    break;
            }
        });

    }
    catch (e) {
        SHP.Message.error(player, 'form error: ' + e.message);
    }
    return back;
}

SHP.registerPackage(7, "textures/ui/switch_face_button_down.png");
SHP.export_info(info);
SHP.export_cmd(cmd);
SHP.export_form(menu);
/////////////////////////////////////////// global end //////////////////////////////////////////////////