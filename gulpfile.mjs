import path from "path";
import * as fs from "fs";

import { deleteSync } from "del";
import gulp from "gulp";
import ts from "gulp-typescript";
import zip from "gulp-zip";

const buildConfig = JSON.parse(
    fs.readFileSync("build.json", { encoding: "utf8" })
);
const packageJson = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf8" })
);

const baseDir = path.join(buildConfig.bdsDir, "plugins");
const distRoot = "dist";
const distDir = distRoot + "/call";
const dataPath = path.join(distDir, "data");
const distDataDir = path.join(distDir, "userdata");

const tsConfigs = JSON.parse(
    fs.readFileSync("tsconfig.json", { encoding: "utf8" })
);

const packJson = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf8" })
);

function makeManifest() {
    const manifestJson = {
        name: packJson.name,
        entry: "index.js",
        type: "lse-nodejs",
        description: packJson.description,
        author: packJson.author,
        version: packJson.version,
        dependencies: [
            {
                name: "legacy-script-engine-nodejs",
            },
        ],
    };
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(
        path.join(distDir, "manifest.json"),
        JSON.stringify(manifestJson, null, 2)
    );
    const newPackJson = JSON.parse(JSON.stringify(packJson));
    newPackJson.devDependencies = {};
    fs.writeFileSync(
        path.join(distDir, "package.json"),
        JSON.stringify(newPackJson, null, 2)
    );

    return gulp.src("./package-lock.json", { base: "." }).pipe(gulp.dest(distDir))
}

function makeIndexJs(cb) {
    fs.writeFileSync(
        path.join(distDir, "index.js"),
        `
        require("./core")
        `.trim()
    )
    cb()
}

function makeDataFile() {
    return gulp
        .src(["./data/config/**/*", "./data/data/**/*"], { base: "./data" })
        .pipe(gulp.dest(distDataDir));
}

function makeEmptyFile(cb) {
    ["export", "import"].forEach((directory) => {
        if (!fs.existsSync(path.join(distDataDir, directory)))
            fs.mkdirSync(path.join(distDataDir, directory), {
                recursive: true,
            });
    });
    cb();
}

function makeBin() {
    return gulp.src("./bin/**/*", { base: "." }).pipe(gulp.dest(distDir));
}

function makeConfig() {
    return gulp.src("./config/**/*", { base: "." }).pipe(gulp.dest(distDir));
}

function compileMain() {
    const mainProject = ts.createProject("tsconfig.json");

    return gulp
        .src(tsConfigs.include, { cwd: ".", base: "."  })
        .pipe(mainProject())
        .pipe(gulp.dest(distDir));
}

function makePlugin() {
    return gulp
        .src(path.join(dataPath, "plugins/**/*"), { base: dataPath })
        .pipe(gulp.dest(path.join(distDataDir)))
        .on("end", () => {
            deleteSync(dataPath);
        });
}

function copyAll() {
    return gulp
        .src([distDir + "/**/*"], { base: "./dist" })
        .pipe(gulp.dest(baseDir));
}

function packToZip() {
    return gulp
        .src([distDir + "/**/*"], { base: "./dist" })
        .pipe(zip(`CALL-${packJson.version}.zip`))
        .pipe(gulp.dest(distRoot));
}

function copyCore() {
    return gulp
        .src([distDir + "/core/**/*", distDir + "/config/**/*"], { base: "./dist" })
        .pipe(gulp.dest(baseDir));
}

function watchFunction() {
    gulp.watch(tsConfigs.include, gulp.series(compileTask, copyCore));
}

function generateToothFile(cb) {
    const toothTemplate = JSON.parse(
        fs.readFileSync("tooth_template.json", { encoding: "utf8" })
    );

    const version = packageJson.version;
    let toothJsonStr = JSON.stringify(toothTemplate, null, 2);

    toothJsonStr = toothJsonStr.replace(/{{VERSION}}/g, version);

    fs.writeFileSync("tooth.json", toothJsonStr);

    cb();
}

const initTask = gulp.series([
    makeEmptyFile,
    makeIndexJs,
    makeManifest,
    makeDataFile,
    makeBin,
    makeConfig,
    copyAll,
    generateToothFile,
]);

const buildInitTask = gulp.series([
    makeEmptyFile,
    makeIndexJs,
    makeManifest,
    makeDataFile,
    makeConfig,
    makeBin
]);

const compileTask = gulp.series([compileMain, makePlugin]);

const devTask = gulp.series([compileTask, watchFunction]);

export const init = initTask;
export const i = initTask;
export const compile = compileTask;
export const c = compileTask;
export const watch = devTask;
export const w = devTask;
export const pack = packToZip;
export const build = gulp.series([buildInitTask, compileTask, packToZip]);
