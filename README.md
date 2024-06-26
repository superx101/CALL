![CALL](./docs/image/introduction_1.0.0.png)

# ⚠️Do not refer to and learn from this project⚠️

At the start of the project, the author didn't even know JavaScript 
and had no idea what TypeScript was.
So, this project is full of some wicked syntax and organization.

If you're a beginner in LSE and want to improve your development skills by studying some existing projects, 

🚨❗🚫🙅‍♂️please don't refer to this one🙅‍♂️🚫❗🚨.

# Introduction to plug-ins

English | [简体中文](./docs/user/introduction.md)

## Introduction
Construct Assistant for LeviLamina, abbreviated as CALL, is an auxiliary construction tool for BDS, and provides API to support other plug-in developers to expand the functions of CALL.

**Why CALL?**
- ___Command operation___  
All operations in CALL support commands, so you can use the command box to perform a CALL operation for a player, for example: `/execute @p ~ ~ ~/call menu`

- ___User experience___  
CALL is committed to improving the user experience, and all basic operations can be completed by **GUI** clicking (**Graphical interface**) without excessive learning costs. For instructions, this plug-in provides default values and **Simplified instruction**, for example, instructions: `/call area start ~ ~ ~` can be simplified to `/ca ar a` you can also bind instructions to,**Shortcut key**one-click execution, more convenient

- ___Multi-person collaboration___   
Structures you can save with other players**Share**

- ___Cross archive___  
Copied, saved structures can be **Cross archive** used

- ___Custom permissions___  
Backstage administrator **Customize** : Which players can use CALL?

- ___Wide range___  
CALL uses a thread-wait approach to avoid the situation where the operation fails because the chunk is not loaded. In theory, a single region of that CALL may B
   
- ___Third-party support___  
CALL allows other developers to write plug-ins that extend functionality, which you can install **Third-party plug-ins** to get **More functions**

- ___Open source and free___  
This plugin uses the GPL-3.0 protocol, full **Open source and free** project address: <https://github.com/superx101/CALL> _(It's my first BDS plug-in, Please forgive if there are any mistakes)_ Feedback and Suggestions: [691552572](https://jq.qq.com/?_wv=1027&k=9soqRZuV)

- ___Automatic update___  
Automatic download, automatic installation, and automatic reloading of plug-ins Since version 1.0.0, CALL can enable automatic updates in the configuration, or enter background commands for semi-automatic `call update` updates.

- ___Documentation Tutorial___  
CALL provides you [document](https://superx101.github.io/CALL/) with a detailed record of plug-in installation, usage, and third-party plug-in development tutorials.

## Function
- **Selection fill**  
- **The selection is cleared**  
- **Selection replacement**  
- **Selection translation**  
- **Selection stacking**  
- **Selection mirroring**  
- **Selection rotation**  
- **Undo**  
- **Redo**  
- **Copy**  
- **Paste**  
- **Save the structure**  
- **Load Save**  
- **Delete and save**  
- **Share and save**  
- **Shortcut key**  
- **Generate a shape**
- **Import**
- **Export**

## Shape
The shapes of the current version are as follows:
![Shape](./docs/image/shape.png)

## Run the Project
This project is written in vscode, so it is recommended that you also use vscode to run the code. Once you have your IDE ready, follow the steps below to build the project.
1. Download [nodejs](https://nodejs.org/en/download)
2. Download [HelperLib](https://github.com/LiteLDev/HelperLib/releases)
3. Run `npm install` to install all dependencies
4. Specify the BDS path in `gulpfile.mjs`
5. Run `npx gulp init` to init data and HelperLib
6. Run `npx gulp watch` and write code
