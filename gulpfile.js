const path = require("path");
const fs = require("fs");

const gulp = require("gulp");
const ts = require("gulp-typescript");
const replace = require("gulp-replace");
// const gulpZip = require("gulp-zip");
// const del = require("del");

const buildConfig = JSON.parse(fs.readFileSync("build.json"));
const srcProject = ts.createProject("tsconfig.json");

const baseDir = path.join(buildConfig.bdsDir, "plugins/call")
const distDir = "dist"
const distDataDir = path.join(distDir, "data")
const distCodeDir = path.join(distDir, "program")
const depDir = path.join(distDir, "dependence")
const releaseDir = path.join(distDir, "release")
const buildDir = path.join("resources/build")
const templatesPath = "resources/templates/**/*"

const tsConfigs = JSON.parse(fs.readFileSync("tsconfig.json"))

const packJson = JSON.parse(fs.readFileSync("package.json"))
const name = packJson.name;
const version = packJson.version;

function setLib() {
    const file = "index.ts";
    return gulp.src(file)
        .pipe(replace(
            /^\/\/\/ <reference path=".+"\/>/g,
            `\/\/\/ <reference path="${path.posix.join(buildConfig.libDir, "src", "index.d.ts")}"/>`
        ))
        .pipe(gulp.dest("./"));
}

function makeManifest(cb) {
    const manifestJson = {
        name: packJson.name,
        entry: "./program/index.js",
        type: "lse-node",
        description: packJson.description,
        author: packJson.author,
        version: packJson.version,
        dependencies: [{
            name: "legacy-script-engine-nodejs"
        }]
    }
    fs.writeFileSync(path.join(distDir, "manifest.json"), JSON.stringify(manifestJson, null, 2));
    cb()
}

function makeDataFile() {
    return gulp.src("data/**/*").pipe(gulp.dest(distDataDir));
}

function makeEmptyFile(cb) {
    ["export", "import", "temp", "dist"].forEach(directory => {
        if (fs.existsSync(directory))
            fs.mkdirSync(path.join(distDataDir, directory), { recursive: true });
    });
    cb()
}

function makeTemplates() {
    return gulp.src(templatesPath)
        .pipe(gulp.dest(path.join(distDir, "templates")));
}

function makeConfig() {
    return gulp.src("./config/**/*", { base: "." })
        .pipe(gulp.dest(distCodeDir));
}

function makeCompile() {
    return gulp.src(tsConfigs.include, { base: "." })
        .pipe(srcProject())
        .pipe(gulp.dest(distCodeDir));
}

function copyToDebug() {
    return gulp.src([distDir + "/**/*"], { base: distDir }).pipe(gulp.dest(baseDir));

}

function watch() {
    gulp.watch(tsConfigs.include, (cb)=>{
        return compile;
    })
}

const init = gulp.series([
    setLib,
    makeEmptyFile,
    makeManifest,
    makeDataFile,
    makeConfig,
    makeTemplates
])
const compile = gulp.series([makeCompile, copyToDebug]) 

exports.init = init;
exports.compile = compile
exports.watch = watch
exports.default = compile

// task("zip-llplugin", () => {
//     return gulp.src(path.join(codeDir, "**/*"))
//         .pipe(gulpZip(`${name}.llplugin`))
//         .pipe(gulp.dest(releaseDir));
// });

// task("copy-data-dist", () => {
//     const targetDir = path.join(releaseDir, name)
//     if (fs.existsSync(targetDir))
//         deleteSync([targetDir], { force: true });

//     ["export", "import", "temp", "dist"].forEach(directory => {
//         fs.mkdirSync(path.join(targetDir, directory), { recursive: true });
//     });

//     return gulp.src("data/**/*")
//         .pipe(gulp.dest(targetDir));
// })

// task("copy-build", () => {
//     return gulp.src(buildDir + "/**/*")
//         .pipe(gulp.dest(distDir));
// })

// task("zip-release", () => {
//     return gulp.src(
//         [releaseDir + "/**/*"],
//         { base: releaseDir })
//         .pipe(gulpZip(`${name}-${version}.zip`))
//         .pipe(gulp.dest(distDir));
// });

// task("copy-dep", () => {
//     return gulp.src(
//         ["node_modules/**/*", "!node_modules/@types/**/*"])
//         .pipe(gulp.dest(path.join(depDir, "node_modules")));
// })

// task("zip-dep", () => {
//     return gulp.src(
//         [depDir + "/**/*"],
//         { base: depDir })
//         .pipe(gulpZip(`${name}-${version}-dependencies.zip`))
//         .pipe(gulp.dest(distDir));
// })