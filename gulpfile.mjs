import path from "path";
import * as fs from "fs"

import {deleteSync} from "del";
import gulp from "gulp";
import ts from "gulp-typescript";
import replace from "gulp-replace";

const buildConfig = JSON.parse(
    fs.readFileSync("build.json", { encoding: "utf8" })
);
const srcProject = ts.createProject("tsconfig.json");

const baseDir = path.join(buildConfig.bdsDir, "plugins/call");
const distDir = "dist";
const dataPath = path.join(distDir, "data");
const distDataDir = path.join(distDir, "userdata");
const distCodeDir = path.join(distDir);

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
                /^\/\/\/ <reference path=".+"\/>/g,
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
        .pipe(gulp.dest(distCodeDir));
}

function compileMain() {
    return gulp
        .src(tsConfigs.include, { base: "." })
        .pipe(srcProject())
        .pipe(gulp.dest(distCodeDir));
}

function makePlugin() {
    
    return gulp
        .src(path.join(dataPath, "plugins/**/*"), { base: dataPath })
        .pipe(gulp.dest(path.join(distDataDir)))
        .on("end", ()=>{
            deleteSync(dataPath)
        })
}

function copyToDebug() {
    return gulp
        .src([distDir + "/**/*"], { base: distDir })
        .pipe(gulp.dest(baseDir));
}

function watchFunction() {
    gulp.watch(tsConfigs.include, compileTask);
}

const initTask = gulp.series([
    setLib,
    makeEmptyFile,
    makeManifest,
    makeDataFile,
    makeConfig,
]);

const compileTask = gulp.series([compileMain, makePlugin, copyToDebug]);

const watchTask = gulp.series([compileTask, watchFunction]);

export const init = initTask;
export const compile = compileTask;
export const c = compileTask;
export const watch = watchTask;
export const w = watchTask;
