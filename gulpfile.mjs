import path from "path";
import * as fs from "fs"

import { deleteSync } from "del";
import gulp from "gulp";
import ts from "gulp-typescript";
import replace from "gulp-replace";
import zip from "gulp-zip";
import jeditor from "gulp-json-editor";

const buildConfig = JSON.parse(
    fs.readFileSync("build.json", { encoding: "utf8" })
);
const packageJson = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf8" })
)
const srcProject = ts.createProject("tsconfig.json");

const baseDir = path.join(buildConfig.bdsDir, "plugins");
const distRoot = "dist"
const distDir = distRoot + "/call";
const dataPath = path.join(distDir, "data");
const distDataDir = path.join(distDir, "userdata");

const tsConfigs = JSON.parse(
    fs.readFileSync("tsconfig.json", { encoding: "utf8" })
);

const packJson = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf8" })
);

function setLib() {
    const file = "index.ts";
    return gulp
        .src(file)
        .pipe(
            replace(
                /^\/\/\/ <reference path=".*"\/>/g,
                `\/\/\/ <reference path="${path.posix.join(
                    buildConfig.libDir,
                    "src",
                    "index.d.ts"
                )}"/>`
            )
        )
        .pipe(gulp.dest("./"));
}

function makeManifest(cb) {
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
    cb();
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

function makeConfig() {
    return gulp
        .src("./config/**/*", { base: "." })
        .pipe(gulp.dest(distDir));
}

function compileMain() {
    return gulp
        .src(tsConfigs.include, { base: "." })
        .pipe(srcProject())
        .pipe(gulp.dest(distDir));
}

function makePlugin() {
    return gulp
        .src(path.join(dataPath, "plugins/**/*"), { base: dataPath })
        .pipe(gulp.dest(path.join(distDataDir)))
        .on("end", () => {
            deleteSync(dataPath)
        })
}

function copyToDebug() {
    return gulp
        .src([distDir + "/**/*"], { base: "./dist" })
        .pipe(gulp.dest(baseDir));
}

function packToZip() {
    return gulp.src([distDir + "/**/*"], { base:  "./dist" })
        .pipe(zip(`CALL-${packJson.version}.zip`))
        .pipe(gulp.dest(distRoot))
}

function watchFunction() {
    gulp.watch(tsConfigs.include, gulp.series(compileTask, copyToDebug));
}

function setBuildJson() {
    return gulp.src("build.json")
    .pipe(jeditor({
        bdsDir: "",
        libDir: "dist/types"
    }))
    .pipe(gulp.dest("./"))
}

const initTask = gulp.series([
    setLib,
    makeEmptyFile,
    makeManifest,
    makeDataFile,
    makeConfig,
]);

const compileTask = gulp.series([compileMain, makeConfig, makePlugin]);

const devTask = gulp.series([compileTask, watchFunction]);

export const init = initTask;
export const compile = compileTask;
export const c = compileTask;
export const watch = devTask;
export const w = devTask;
export const pack = packToZip;
export const build = gulp.series([setBuildJson, initTask, compileTask, packToZip])
