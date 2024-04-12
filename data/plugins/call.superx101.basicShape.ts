import { Box3, BoxGeometry, Matrix4, Vector3, Vector4 } from "three";
import {
    IPlugin,
    PluginInfo,
    PluginTool,
    ShapePlugin,
} from "../../src/plugin/Plugin";
import Pos3 from "../../src/common/Pos3";
import StructureNBT from "../../src/io/StructureNBT";

i18n.load(
    "plugins/CALL/plugins/shape/call.superx101.basicShape/lang.json",
    "zh_CN",
    {
        zh_CN: {
            title: "基础形状",
            introduction: "CALL自带的一个简单形状包",
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
            "this.getBlockSNBT.warn": "未检测到物品栏方块, 使用默认材质",
            "common_checkSNBT.error": "材质为空, 请输入材质",
            "form.s0": "立方体参数",
            "form.s1": "材质: 从 {} 号物品栏选择\n: {}",
            "form.s2": "输入三维边长\n  x y z",
            "form.s3": "输入三个正数(空格隔开)",
            "form.s4": "输入生成位置\n  默认为当前坐标",
            "form.s5": "输入三个正数(空格隔开)",
            "form.s6":
                "绕轴旋转顺序(欧拉角)\n  注: 本选项的轴指物体的轴\n  并非世界绝对坐标轴\n",
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
        `,
        },
        zh_TW: {
            title: "基礎形狀",
            introduction: "CALL自帶的一個簡單形狀包",
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
            "this.getBlockSNBT.warn": "未檢測到物品欄方塊, 使用默認材質",
            "common_checkSNBT.error": "材質為空, 請輸入材質",
            "form.s0": "立方體參數",
            "form.s1": "材質: 從 {} 號物品欄選擇\n: {}",
            "form.s2": "輸入三維邊長\n  x y z",
            "form.s3": "輸入三個正數(空格隔開)",
            "form.s4": "輸入生成位置\n  默認為當前坐標",
            "form.s5": "輸入三個正數(空格隔開)",
            "form.s6":
                "繞軸旋轉順序(歐拉角)\n  注: 本選項的軸指物體的軸\n  並非世界絕對坐標軸\n",
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
        `,
        },
        en_US: {
            title: "Basic Shape",
            introduction: "A simple shape package that comes with CALL",
            "title.back": "Back to previous level",
            "title.cube": "§lFree§2 Cube",
            "title.plane": "§lFree§2 Plane",
            "title.line": "§lTwo points generate a §2 straight line",
            "title.sphere": "§l§9Sphere",
            "title.ellipsoid": "§lFree§9 Ellipsoid",
            "title.cylinder": "§lFree§9 Cylinder",
            "title.cone": "§lFree§9 Cone",
            "title.tutorial": "§lDescription",
            "common_checkNumber.error1":
                "The parameter {} is invalid, please enter a number",
            "common_checkNumber.error2": "The parameter {} cannot be negative",
            "common_checkVec3.error": "Vector {} cannot be empty",
            "this.getBlockSNBT.warn":
                "No inventory blocks detected, use default texture",
            "common_checkSNBT.error":
                "The material is empty, please enter the material",
            "form.s0": "Cube Parameters",
            "form.s1": "Material: Select from item {} \n : {}",
            "form.s2": "Enter 3D side length \n xy z",
            "form.s3": "Enter three positive numbers (separated by spaces)",
            "form.s4":
                "Enter the generated location \nThe default is the current coordinates",
            "form.s5": "Enter three positive numbers (separated by spaces)",
            "form.s6":
                "Rotation order around the axis (Euler angle)  nNote: The axis of this option refers to the axis of the object  nnot the absolute coordinate axis of the world \n ",
            "form.s7": "rotation angle around the x-axis",
            "form.s8": "rotation angle around the y-axis",
            "form.s9": "Rotation angle around z-axis",
            "form.s10": "Plane Parameters",
            "form.s11": "Material: Select from item {} \n :{}",
            "form.s12":
                "Plane normal vector (vertical plane vector) \nNormal vector is up by default",
            "form.s13": "Input 3D vector (separated by spaces)",
            "form.s14": "Enter size x z",
            "form.s14.5": "Enter two numbers (separated by spaces)",
            "form.s15":
                "Enter the generated location \nThe default is the current coordinates",
            "form.s16": "Enter three positive numbers (separated by spaces)",
            "form.s17": "Straight Line Parameters",
            "form.s18": "Material: Select from item {} \n :{}",
            "form.s19":
                "Input point 1 defaults to the coordinates of point A of your selection",
            "form.s20": "Enter three positive numbers (separated by spaces)",
            "form.s21":
                "Input point 2 defaults to point B coordinates of your selection",
            "form.s22": "Enter three positive numbers (separated by spaces)",
            "form.s23": "Sphere Parameters",
            "form.s24": "Material: Select from item {} \n :{}",
            "form.s25": "Sphere Radius",
            "form.s26": "Enter a positive integer",
            "form.s27": "whether hollow",
            "form.s28":
                "Enter the generated location \nThe default is the current coordinates",
            "form.s29": "Enter three positive numbers (separated by spaces)",
            "form.s30": "ellipsoid parameters",
            "form.s31": "Material: Select from item {} \n :{}",
            "form.s32": "ellipsoid semi-major axis abc",
            "form.s33": "Enter three positive numbers (separated by spaces)",
            "form.s34": "whether hollow",
            "form.s35":
                "Enter the generated location \nThe default is the current coordinates",
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
            "form.s49":
                "Enter the generated location \nThe default is the current coordinates",
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
            "form.s63":
                "Enter the generated location \nThe default is the current coordinates",
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
`,
        },
        ru_RU: {
            title: "Основная форма",
            introduction: "Пакет простой формы, поставляемый с CALL",
            "title.back": "Вернуться на предыдущий уровень",
            "title.cube": "§lКуб свободы§2",
            "title.plane": "§lПлоскость Свободы§2",
            "title.line": "§lДве точки образуют прямую линию §2",
            "title.sphere": "§l§9Sphere",
            "title.ellipsoid": "§lFree§9 Эллипсоид",
            "title.cylinder": "§lСвобода§9 Цилиндр",
            "title.cone": "§lСвободный§9 Конус",
            "title.tutorial": "§lОписание",
            "common_checkNumber.error1":
                "Параметр {} недействителен, введите число",
            "common_checkNumber.error2":
                "Параметр {} не может быть отрицательным",
            "common_checkVec3.error": "Вектор {} не может быть пустым",
            "this.getBlockSNBT.warn":
                "Блок инвентаря не обнаружен, используется текстура по умолчанию",
            "common_checkSNBT.error": "Материал пуст, введите материал",
            "form.s0": "Параметры куба",
            "form.s1": "Материал: Выберите из пункта {}\n: {}",
            "form.s2": "Введите длину стороны 3D\n x y z",
            "form.s3":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s4":
                "Введите место появления\n По умолчанию используются текущие координаты",
            "form.s5":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s6":
                "Порядок вращения вокруг оси (угол Эйлера)\n Примечание: ось этой опции относится к оси объекта\n, а не к оси абсолютных координат мира\n",
            "form.s7": "Угол поворота вокруг оси X",
            "form.s8": "Угол поворота вокруг оси Y",
            "form.s9": "Угол поворота вокруг оси Z",
            "form.s10": "Параметры плоскости",
            "form.s11": "Материал: Выберите из пункта {}\n:{}",
            "form.s12":
                "Вектор нормали к плоскости (вектор вертикальной плоскости)\n По умолчанию вектор нормали направлен вверх",
            "form.s13": "Введите трехмерный вектор (разделенный пробелами)",
            "form.s14": "Введите размер x z",
            "form.s14.5": "Введите два числа (разделенные пробелами)",
            "form.s15":
                "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
            "form.s16":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s17": "Параметры прямой линии",
            "form.s18": "Материал: Выберите из пункта {}\n:{}",
            "form.s19":
                "Введите точку 1, по умолчанию это координаты выбранной вами точки А",
            "form.s20":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s21":
                "Введите точку 2 по умолчанию с координатами точки B по вашему выбору",
            "form.s22":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s23": "Параметры сферы",
            "form.s24": "Материал: Выберите из пункта {}\n:{}",
            "form.s25": "Радиус сферы",
            "form.s26": "Введите положительное целое число",
            "form.s27": "То ли пустотелый",
            "form.s28":
                "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
            "form.s29":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s30": "Параметры эллипсоида",
            "form.s31": "Материал: Выберите из пункта {}\n:{}",
            "form.s32": "Большая полуось эллипсоида abc",
            "form.s33":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s34": "То ли пустотелый",
            "form.s35":
                "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
            "form.s36":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s37": "Преобразовать часть:",
            "form.s38": "Порядок вращения оси (углы Эйлера)",
            "form.s39": "Угол поворота вокруг оси x",
            "form.s40": "Угол поворота вокруг оси Y",
            "form.s41": "Угол поворота вокруг оси Z",
            "form.s42": "Параметры эллиптического цилиндра",
            "form.s43": "Материал: Выберите из пункта {}\n:{}",
            "form.s44": "Большая полуось эллипса: a b",
            "form.s45":
                "Введите два положительных числа (разделенных пробелами)",
            "form.s46": "Высота",
            "form.s47": "Введите положительное число",
            "form.s48": "Будь то пустотелая",
            "form.s49":
                "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
            "form.s50":
                "Введите три положительных числа (разделенных пробелами)",
            "form.s51": "Преобразовать часть:",
            "form.s52": "Порядок вращения вокруг оси (угол Эйлера)",
            "form.s53": "Угол поворота вокруг оси x",
            "form.s54": "Угол поворота вокруг оси Y",
            "form.s55": "Угол поворота вокруг оси Z",
            "form.s56": "Параметры эллиптического цилиндра",
            "form.s57": "Материал: Выберите из пункта {}\n:{}",
            "form.s58": "Большая полуось эллипса: a b",
            "form.s59":
                "Введите два положительных числа (разделенных пробелами)",
            "form.s60": "Высота",
            "form.s61": "Введите положительное число",
            "form.s62": "То ли пустотелый",
            "form.s63":
                "Введите сгенерированное местоположение\nПо умолчанию используются текущие координаты",
            "form.s64":
                "Введите три положительных числа (разделенных пробелами)",
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
         `,
        },
    }
);

class Checker {
    constructor(private langCode: string) {}

    public checkVec3(v3: Vector3, negative = true) {
        if (v3 != null) {
            this.checkNumber(v3.x, negative);
            this.checkNumber(v3.y, negative);
            this.checkNumber(v3.z, negative);
        } else {
            throw new Error(
                i18n.trl(this.langCode, "common_checkVec3.error", `${v3}`)
            );
        }
    }

    public checkNumber(p: number, negative = true) {
        if (p == null || typeof p != "number")
            throw new Error(
                i18n.trl(this.langCode, "common_checkNumber.error1", `${p}`)
            );
        else if (p < 0 && !negative)
            throw new Error(
                i18n.trl(this.langCode, "common_checkNumber.error2", `${p}`)
            );
    }

    public checkSNBT(snbt: string) {
        if (snbt == null)
            throw new Error(i18n.trl(this.langCode, "common_checkSNBT.error"));
    }
}

abstract class Geometry {
    public boundingBox: Box3;

    constructor() {
        this.boundingBox = this.getBoundingBox();
    }

    public abstract isPointInsideGeometry: Vec3Callback;

    public abstract isPointOnSurface: Vec3Callback;

    public abstract getBoundingBox(): Box3;

    public transformedBoundingBox(m4: Matrix4) {
        this.boundingBox = this.boundingBox!.applyMatrix4(m4);
        return this;
    }
}

type Vec3Callback = (v: Vector3) => boolean;
type Odd = {
    x: boolean;
    y: boolean;
    z: boolean;
};

type Voxel = {
    box: Box3;
    blocks: NbtInt[];
};

abstract class ShapeManager {
    constructor(
        protected plugin: IPlugin,
        protected tool: PluginTool,
        protected checker: Checker
    ) {}

    public abstract gen(param: any, pos: Pos3): Voxel;

    public abstract form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void;

    protected runcmd(
        player: LLSE_Player,
        index: number,
        json: any,
        pos: Vector3
    ) {
        player.runcmd(
            `/call shape load "${this.plugin.getId()}" ${index} ${JSON.stringify(
                json
            )} ${pos.x} ${pos.y} ${pos.z}`
        );
    }

    private boxForeach(
        box: Box3,
        odd: Odd,
        callback: (x: number, y: number, z: number) => boolean
    ): NbtInt[] {
        const arr: NbtInt[] = [];
        const nx = odd.x ? 0 : 0.5;
        const ny = odd.y ? 0 : 0.5;
        const nz = odd.z ? 0 : 0.5;

        for (let x = box.min.x + nx; x <= box.max.x + nx; x++) {
            for (let y = box.min.y + ny; y <= box.max.y + ny; y++) {
                for (let z = box.min.z + nz; z <= box.max.z + nz; z++) {
                    if (callback(x, y, z)) arr.push(new NbtInt(0));
                    else arr.push(new NbtInt(-1));
                }
            }
        }
        return arr;
    }

    public getVoxel(
        isHollow: boolean,
        odd: Odd,
        m4: Matrix4,
        geometry: Geometry
    ): Voxel {
        geometry.transformedBoundingBox(m4);
        const im4 = m4.clone().invert();
        let blocks: NbtInt[] = [];
        if (isHollow) {
            blocks = this.boxForeach(geometry.boundingBox!, odd, (x, y, z) => {
                const v3 = new Vector3(x, y, z).applyMatrix4(im4);
                return geometry.isPointOnSurface(v3);
            });
        } else {
            blocks = this.boxForeach(geometry.boundingBox!, odd, (x, y, z) => {
                const v3 = new Vector3(x, y, z).applyMatrix4(im4);
                return geometry.isPointInsideGeometry(v3);
            });
        }
        return {
            blocks,
            box: geometry.boundingBox!,
        };
    }

    public simpleCubeVoxelization(cube: BoxGeometry, m4: Matrix4): Voxel {
        const arr: NbtInt[] = [];

        cube.center();
        cube.computeBoundingBox();
        const pre_box = cube.boundingBox!.clone();

        const m4_i = m4.clone().invert();

        cube.applyMatrix4(m4);
        cube.computeBoundingBox();
        const box = cube.boundingBox!;

        for (let x = box.min.x + 0.5; x < box.max.x; x++) {
            for (let y = box.min.y + 0.5; y < box.max.y; y++) {
                for (let z = box.min.z + 0.5; z < box.max.z; z++) {
                    const v4 = new Vector4(x, y, z, 1).applyMatrix4(m4_i);
                    const v3 = new Vector3(v4.x, v4.y, v4.z);
                    if (pre_box.containsPoint(v3)) arr.push(new NbtInt(0));
                    else arr.push(new NbtInt(-1));
                }
            }
        }
        return {
            blocks: arr,
            box,
        };
    }

    public getBlockSNBT(item: LLSE_Item, player: LLSE_Player) {
        try {
            return item.getNbt().getTag("Block")!.toString();
        } catch (e) {
            this.tool.message.warn(
                player,
                i18n.trl(player.langCode, "this.getBlockSNBT.warn")
            );
        }
        return '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}';
    }
}

class CubeManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkVec3(param, false);
        this.checker.checkNumber(param.xrote, false);
        this.checker.checkNumber(param.yrote, false);
        this.checker.checkNumber(param.zrote, false);
        this.checker.checkSNBT(param.snbt);

        const cube = new BoxGeometry(param.x, param.y, param.z, 1, 1, 1);
        const m4 = this.tool.getRoteMAT4(
            param.xrote,
            param.yrote,
            param.zrote,
            param.order
        );
        return this.simpleCubeVoxelization(cube, m4);
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
        const itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;
        const form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s0"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s1",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s2"),
                i18n.trl(player.langCode, "form.s3")
            )
            .addInput(
                i18n.trl(player.langCode, "form.s4"),
                i18n.trl(player.langCode, "form.s5"),
                `${player.pos.x} ${player.pos.y} ${player.pos.z}`
            )
            .addStepSlider(i18n.trl(player.langCode, "form.s6"), orderArr)
            .addSlider(i18n.trl(player.langCode, "form.s7"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s8"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s9"), 0, 360, 1, 0);

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                const json: any = {};
                const pos: any = {};
                let strs: string;

                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[1].split(" ");
                json.x = parseInt(strs[0]);
                json.y = parseInt(strs[1]);
                json.z = parseInt(strs[2]);

                strs = data[2].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                json.order = orderArr[data[3]];

                json.xrote = parseFloat(data[4]);
                json.yrote = parseFloat(data[5]);
                json.zrote = parseFloat(data[6]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

class PlaneManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkVec3(param.v);
        this.checker.checkNumber(param.x, false);
        this.checker.checkNumber(param.z, false);
        this.checker.checkSNBT(param.snbt);

        const cube = new BoxGeometry(param.x, 1, param.z, 1, 1, 1);
        const va = new Vector3(0, 1, 0);
        const vb = new Vector3(param.v.x, param.v.y, param.v.z);
        const angle = va.angleTo(vb);
        va.cross(vb);

        const m4 = new Matrix4().makeRotationAxis(va.normalize(), angle);
        return this.simpleCubeVoxelization(cube, m4);
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        let itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;
        let form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s10"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s11",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s12"),
                i18n.trl(player.langCode, "form.s13"),
                "0 1 0"
            )
            .addInput(
                i18n.trl(player.langCode, "form.s14"),
                i18n.trl(player.langCode, "form.s14.5")
            )
            .addInput(
                i18n.trl(player.langCode, "form.s15"),
                i18n.trl(player.langCode, "form.s16"),
                `${player.pos.x} ${player.pos.y} ${player.pos.z}`
            );

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                const json: any = {};
                const pos: any = {};
                let strs: string;

                strs = data[1].split(" ");
                json.v = {};
                json.v.x = parseInt(strs[0]);
                json.v.y = parseInt(strs[1]);
                json.v.z = parseInt(strs[2]);
                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[2].split(" ");
                json.x = parseInt(strs[0]);
                json.z = parseInt(strs[1]);

                strs = data[3].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

class LineManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkVec3(param);
        this.checker.checkSNBT(param.snbt);

        let shape = {};

        let va = new Vector3(0, 0, 1);
        let v = new Vector3(param.x, param.y, param.z);
        v.sub(new Vector3(pos.x, pos.y, pos.z)); // line vector
        let cube = new BoxGeometry(1, 1, v.length() + 1, 1, 1, 1);
        let angle = va.angleTo(v); // angle between line and va

        let axisV = va.cross(v).normalize(); // get axis from va and v
        let m4 = new Matrix4().makeRotationAxis(axisV, angle); // get Rotation Matrix from axis and angle
        return this.simpleCubeVoxelization(cube, m4);
        // shape.pos = mc.newpos(
        //     Math.round((param.x + pos.x) / 2),
        //     Math.round((param.y + pos.y) / 2),
        //     Math.round((param.z + pos.z) / 2),
        //     pos.dimid
        // );
        // return shape;
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        let posAStr =
            plData.posA == null
                ? ""
                : `${plData.posA.x} ${plData.posA.y} ${plData.posA.z}`;
        let posBStr =
            plData.posB == null
                ? ""
                : `${plData.posB.x} ${plData.posB.y} ${plData.posB.z}`;
        let itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;
        let form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s17"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s18",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s19"),
                i18n.trl(player.langCode, "form.s20"),
                posAStr
            )
            .addInput(
                i18n.trl(player.langCode, "form.s21"),
                i18n.trl(player.langCode, "form.s22"),
                posBStr
            );

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                let json: any = {};
                let pos: any = {};
                let strs: string;

                strs = data[1].split(" ");
                json.x = parseInt(strs[0]);
                json.y = parseInt(strs[1]);
                json.z = parseInt(strs[2]);
                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[2].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

class ShpereGeometry extends Geometry {
    public r2: number;
    public rn: number;

    constructor(public r: number) {
        super();
        this.r2 = this.r ** 2;
        this.rn = this.r2 - 2 * this.r + 1;
    }

    public getBoundingBox() {
        return new Box3(
            new Vector3(-this.r, -this.r, -this.r),
            new Vector3(this.r, this.r, this.r)
        );
    }

    public isPointInsideGeometry: Vec3Callback = (v) => {
        return v.x ** 2 + v.y ** 2 + v.z ** 2 <= this.r2;
    };

    public isPointOnSurface: Vec3Callback = (v) => {
        const d = v.x ** 2 + v.y ** 2 + v.z ** 2;
        return d > this.rn && d <= this.r2;
    };
}

class SphereManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkNumber(param.r, false);
        this.checker.checkSNBT(param.snbt);

        const sphere = new ShpereGeometry(param.r);
        const isOdd = sphere.r % 2 != 0;

        return this.getVoxel(
            param.isHollow,
            {
                x: isOdd,
                y: isOdd,
                z: isOdd,
            },
            new Matrix4(),
            sphere
        );
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        const itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;

        const form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s23"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s24",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s25"),
                i18n.trl(player.langCode, "form.s26"),
                ""
            )
            .addSwitch(i18n.trl(player.langCode, "form.s27"), false)
            .addInput(
                i18n.trl(player.langCode, "form.s28"),
                i18n.trl(player.langCode, "form.s29"),
                `${player.pos.x} ${player.pos.y} ${player.pos.z}`
            );

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                let json: any = {};
                let pos: any = {};
                let strs: string;

                json.r = parseInt(data[1]);
                json.isHollow = data[2];
                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[3].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

class EllipsiodGeometry extends Geometry {
    public a: number;
    public b: number;
    public c: number;
    public a2: number;
    public b2: number;
    public c2: number;
    public a_2: number;
    public b_2: number;
    public c_2: number;
    public p: {
        a: boolean;
        b: boolean;
        c: boolean;
    };

    constructor(a: number, b: number, c: number) {
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
        };
    }

    public getBoundingBox(): Box3 {
        return new Box3(
            new Vector3(-this.a, -this.b, -this.c),
            new Vector3(this.a, this.b, this.c)
        );
    }

    public isPointInsideGeometry: Vec3Callback = (v) => {
        return (
            v.x ** 2 / this.a2 + v.y ** 2 / this.b2 + v.z ** 2 / this.c2 <= 1
        );
    };

    public isPointOnSurface: Vec3Callback = (v) => {
        const x2 = v.x ** 2;
        const y2 = v.y ** 2;
        const z2 = v.z ** 2;
        const p1 = this.p.a ? 0 : x2 / this.a_2;
        const p2 = this.p.b ? 0 : y2 / this.b_2;
        const p3 = this.p.c ? 0 : z2 / this.c_2;

        return (
            p1 + p2 + p3 >= 1 && x2 / this.a2 + y2 / this.b2 + z2 / this.c2 <= 1
        );
    };
}

class EllipsiodManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkNumber(param.xrote, false);
        this.checker.checkNumber(param.yrote, false);
        this.checker.checkNumber(param.zrote, false);
        this.checker.checkNumber(param.a, false);
        this.checker.checkNumber(param.b, false);
        this.checker.checkNumber(param.c, false);
        this.checker.checkSNBT(param.snbt);

        const m4 = this.tool.getRoteMAT4(
            param.xrote,
            param.yrote,
            param.zrote,
            param.order
        );
        const m4_i = m4.clone().invert();
        const ellipsoid = new EllipsiodGeometry(param.a, param.b, param.c);
        const odd = {
            x: ellipsoid.a % 2 != 0,
            y: ellipsoid.b % 2 != 0,
            z: ellipsoid.c % 2 != 0,
        };

        return this.getVoxel(param.isHollow, odd, m4_i, ellipsoid);
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        let itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;
        const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

        let form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s30"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s31",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s32"),
                i18n.trl(player.langCode, "form.s33"),
                ""
            )
            .addSwitch(i18n.trl(player.langCode, "form.s34"), false)
            .addInput(
                i18n.trl(player.langCode, "form.s35"),
                i18n.trl(player.langCode, "form.s36"),
                `${player.pos.x} ${player.pos.y} ${player.pos.z}`
            )
            .addLabel(i18n.trl(player.langCode, "form.s37"))
            .addStepSlider(i18n.trl(player.langCode, "form.s38"), orderArr)
            .addSlider(i18n.trl(player.langCode, "form.s39"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s40"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s41"), 0, 360, 1, 0);

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                let json: any = {};
                let pos: any = {};
                let strs: string;

                strs = data[1].split(" ");
                json.a = parseInt(strs[0]);
                json.b = parseInt(strs[1]);
                json.c = parseInt(strs[2]);
                json.isHollow = data[2];
                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[3].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                json.order = orderArr[data[5]];
                json.xrote = parseFloat(data[6]);
                json.yrote = parseFloat(data[7]);
                json.zrote = parseFloat(data[8]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

class CylinderGeometry extends Geometry {
    public a: number;
    public b: number;
    public h: number;
    public a2: number;
    public b2: number;
    public a_2: number;
    public b_2: number;
    public h_half: number;
    public h_half_n: number;
    public p: { a: boolean; b: boolean };

    constructor(a: number, b: number, h: number) {
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
        };
    }

    public isPointInsideGeometry: Vec3Callback = (v) => {
        return (
            v.x ** 2 / this.a2 + v.z ** 2 / this.b2 <= 1 &&
            this.h_half >= (v.y < 0 ? -v.y : v.y)
        );
    };

    public isPointOnSurface: Vec3Callback = (v) => {
        const x2 = v.x ** 2;
        const z2 = v.z ** 2;
        const p1 = this.p.a ? 0 : x2 / this.a_2;
        const p2 = this.p.b ? 0 : z2 / this.b_2;

        return (
            p1 + p2 >= 1 &&
            x2 / this.a2 + z2 / this.b2 <= 1 &&
            this.h_half >= (v.y < 0 ? -v.y : v.y)
        );
    };

    public getBoundingBox(): Box3 {
        return new Box3(
            new Vector3(-this.a, -this.h_half, -this.b),
            new Vector3(this.a, this.h_half, this.b)
        );
    }
}

class CylinderManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkNumber(param.xrote, false);
        this.checker.checkNumber(param.yrote, false);
        this.checker.checkNumber(param.zrote, false);
        this.checker.checkNumber(param.a, false);
        this.checker.checkNumber(param.b, false);
        this.checker.checkNumber(param.h, false);
        this.checker.checkSNBT(param.snbt);

        const cylinder = new CylinderGeometry(param.a, param.b, param.h);
        const isOddX = cylinder.a % 2 != 0;
        const isOddY = cylinder.h % 2 != 0;
        const isOddZ = cylinder.b % 2 != 0;
        let m4 = this.tool.getRoteMAT4(
            param.xrote,
            param.yrote,
            param.zrote,
            param.order
        );
        let m4_i = m4.clone().invert();

        cylinder.transformedBoundingBox(m4);

        return this.getVoxel(
            param.isHollow,
            { x: isOddX, y: isOddY, z: isOddZ },
            m4_i,
            cylinder
        );
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        let itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;
        const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

        let form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s42"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s43",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s44"),
                i18n.trl(player.langCode, "form.s45"),
                ""
            )
            .addInput(
                i18n.trl(player.langCode, "form.s46"),
                i18n.trl(player.langCode, "form.s47"),
                ""
            )
            .addSwitch(i18n.trl(player.langCode, "form.s48"), false)
            .addInput(
                i18n.trl(player.langCode, "form.s49"),
                i18n.trl(player.langCode, "form.s50"),
                `${player.pos.x} ${player.pos.y} ${player.pos.z}`
            )
            .addLabel(i18n.trl(player.langCode, "form.s51"))
            .addStepSlider(i18n.trl(player.langCode, "form.s52"), orderArr)
            .addSlider(i18n.trl(player.langCode, "form.s53"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s54"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s55"), 0, 360, 1, 0);

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                let json: any = {};
                let pos: any = {};
                let strs: string;

                strs = data[1].split(" ");
                json.a = parseInt(strs[0]);
                json.b = parseInt(strs[1]);
                json.h = parseInt(data[2]);
                json.isHollow = data[3];
                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[4].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                json.order = orderArr[data[6]];
                json.xrote = parseFloat(data[7]);
                json.yrote = parseFloat(data[8]);
                json.zrote = parseFloat(data[9]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

class ConeGeometry extends Geometry {
    public a: number;
    public b: number;
    public h: number;
    public a2: number;
    public b2: number;
    public h_: number;
    public a_2: number;
    public b_2: number;
    public p: { a: boolean; b: boolean };

    constructor(a: number, b: number, h: number) {
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
        };
    }

    public getBoundingBox() {
        return new Box3(
            new Vector3(-this.a, -1, -this.b),
            new Vector3(this.a, this.h + 1, this.b)
        );
    }

    public isPointInsideGeometry: Vec3Callback = (v) => {
        const n = this.h / (this.h - v.y);
        return (
            (v.x ** 2 / this.a2 + v.z ** 2 / this.b2) * n <= 1 &&
            v.y <= this.h &&
            v.y >= 0
        );
    };

    public isPointOnSurface: Vec3Callback = (v) => {
        const x2 = v.x ** 2;
        const z2 = v.z ** 2;

        if (v.y >= this.h_)
            return (
                ((x2 / this.a2 + z2 / this.b2) * this.h) / (this.h - v.y) <=
                    1 && v.y <= this.h
            );
        else
            return (
                ((x2 / this.a2 + z2 / this.b2) * this.h) / (this.h - v.y) <=
                    1 &&
                ((x2 / this.a_2 + z2 / this.b_2) * this.h_) / (this.h_ - v.y) >=
                    1 &&
                v.y <= this.h &&
                v.y >= 0
            );
    };
}

class ConeManager extends ShapeManager {
    public gen(param: any, pos: Pos3): Voxel {
        this.checker.checkNumber(param.xrote, false);
        this.checker.checkNumber(param.yrote, false);
        this.checker.checkNumber(param.zrote, false);
        this.checker.checkNumber(param.a, false);
        this.checker.checkNumber(param.b, false);
        this.checker.checkNumber(param.h, false);
        this.checker.checkSNBT(param.snbt);

        const cone = new ConeGeometry(param.a, param.b, param.h);
        const isOddX = cone.a % 2 != 0;
        const isOddY = cone.h % 2 != 0;
        const isOddZ = cone.b % 2 != 0;
        let m4 = this.tool.getRoteMAT4(
            param.xrote,
            param.yrote,
            param.zrote,
            param.order
        );
        let m4_i = m4.clone().invert();

        return this.getVoxel(
            param.isHollow,
            { x: isOddX, y: isOddY, z: isOddZ },
            m4_i,
            cone
        );
    }

    public form(
        player: LLSE_Player,
        index: number,
        plData: any
    ): void {
        let itemStr = plData.itemA.isNull()
            ? ""
            : `${plData.itemA.type} ${plData.itemA.aux}`;
        const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

        let form = mc
            .newCustomForm()
            .setTitle(i18n.trl(player.langCode, "form.s56"))
            .addLabel(
                i18n.trl(
                    player.langCode,
                    "form.s57",
                    `${plData.itemAIndex + 1}`,
                    `${itemStr}`
                )
            )
            .addInput(
                i18n.trl(player.langCode, "form.s58"),
                i18n.trl(player.langCode, "form.s59"),
                ""
            )
            .addInput(
                i18n.trl(player.langCode, "form.s60"),
                i18n.trl(player.langCode, "form.s61"),
                ""
            )
            .addSwitch(i18n.trl(player.langCode, "form.s62"), false)
            .addInput(
                i18n.trl(player.langCode, "form.s63"),
                i18n.trl(player.langCode, "form.s64"),
                `${player.pos.x} ${player.pos.y} ${player.pos.z}`
            )
            .addLabel(i18n.trl(player.langCode, "form.s65"))
            .addStepSlider(i18n.trl(player.langCode, "form.s66"), orderArr)
            .addSlider(i18n.trl(player.langCode, "form.s67"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s68"), 0, 360, 1, 0)
            .addSlider(i18n.trl(player.langCode, "form.s69"), 0, 360, 1, 0);

        player.sendForm(form, (pl, data) => {
            if (data != null) {
                let json: any = {};
                let pos: any = {};
                let strs: string;

                strs = data[1].split(" ");
                json.a = parseInt(strs[0]);
                json.b = parseInt(strs[1]);
                json.h = parseInt(data[2]);
                json.isHollow = data[3];
                json.snbt = this.getBlockSNBT(plData.itemA, player);

                strs = data[4].split(" ");
                pos.x = parseInt(strs[0]);
                pos.y = parseInt(strs[1]);
                pos.z = parseInt(strs[2]);

                json.order = orderArr[data[6]];

                json.xrote = parseFloat(data[7]);
                json.yrote = parseFloat(data[8]);
                json.zrote = parseFloat(data[9]);

                this.runcmd(pl, index, json, pos);
            } else {
                this.plugin.onMenu(player);
            }
        });
    }
}

export default class BasicShapePlugin extends ShapePlugin implements IPlugin {
    private map: {
        [key: number]: new (
            plugin: IPlugin,
            tool: PluginTool,
            checker: Checker
        ) => ShapeManager;
    } = {
        0: CubeManager,
        1: PlaneManager,
        2: LineManager,
        3: SphereManager,
        4: EllipsiodManager,
        5: CylinderManager,
        6: ConeManager,
    };

    public getId(): string {
        return "basicshape";
    }

    public getInfo(langCode: string): PluginInfo {
        return {
            name: i18n.trl(langCode, "title"),
            version: "3.0.0",
            author: "superx101",
            introduction: i18n.trl(langCode, "introduction"),
            shapes: 7,
            icon: "textures/ui/switch_face_button_down.png",
        };
    }

    public onMenu(player: LLSE_Player): void {
        try {
            let plData = this.tool.getData(player);
            let lang = player.langCode;
            let form = mc
                .newSimpleForm()
                .setTitle(i18n.trl(lang, "title"))
                .setContent(i18n.trl(lang, "introduction"))
                .addButton(i18n.trl(lang, "title.back"), "")
                .addButton(i18n.trl(lang, "title.cube"), "")
                .addButton(i18n.trl(lang, "title.plane"), "")
                .addButton(i18n.trl(lang, "title.line"), "")
                .addButton(i18n.trl(lang, "title.sphere"), "")
                .addButton(i18n.trl(lang, "title.ellipsoid"), "")
                .addButton(i18n.trl(lang, "title.cylinder"), "")
                .addButton(i18n.trl(lang, "title.cone"), "");

            player.sendForm(form, (pl, index) => {
                if (!index) {
                    this.tool.toListForm(player);
                    return;
                }
                const constructor = this.map[index];
                const instance = new constructor(
                    this,
                    this.tool,
                    new Checker(player.langCode)
                );
                instance.form(player, index, plData);
            });
        } catch (e) {
            this.tool.message.error(player, e.message);
        }
    }

    public onCmd(
        player: LLSE_Player,
        index: number,
        pos: Pos3,
        param: any
    ): StructureNBT {
        const constructor = this.map[index];
        const instance = new constructor(
            this,
            this.tool,
            new Checker(player.langCode)
        );
        const voxel = instance.gen(param, pos);

        const size = voxel.box.getSize(new Vector3()).toArray();
        const blockIndices = [
            voxel.blocks,
            voxel.blocks.map((v) => new NbtInt(-1)),
        ];
        return new StructureNBT(
            1,
            size,
            blockIndices,
            new NbtList([]),
            new NbtList(),
            new NbtCompound(),
            [0, 0, 0]
        );
    }
}
