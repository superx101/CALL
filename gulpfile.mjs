// eg. E:/Mincraft/bedrock-server-1.20.13
const bdsDir = ""
// eg. E:/Mincraft/HelperLib
const libDir = ""
// ** Do not submit(git push) the above modifications **

import gulp from "gulp";
import ts from "gulp-typescript";
import gulpZip from "gulp-zip";
import replace from "gulp-replace";
import path from "path";
import fs from "fs";
import { deleteSync } from "del"

const srcProject = ts.createProject("tsconfig.json");

const dataDir = path.join(bdsDir, "plugins/CALL")
const codeDir = path.join(bdsDir, "plugins/nodejs/call")
const distDir = "dist"
const depDir = path.join(distDir, "dependence")
const releaseDir = path.join(distDir, "release")
const buildDir = path.join("resources/build")
const templatesPath = "resources/templates/**/*"

const otherFiles = ["package.json", "config/**/*"]

const tsConfigs = JSON.parse(fs.readFileSync("tsconfig.json"))

const pack = JSON.parse(fs.readFileSync("package.json"))
const name = pack.name;
const version = pack.version;

gulp.task("set-lib", () => {
    const file = "index.ts";
    return gulp.src(file)
        .pipe(replace(
            /^\/\/\/ <reference path=".+"\/>/g,
            `\/\/\/ <reference path="${path.posix.join(libDir, "src", "index.d.ts")}"/>`
        ))
        .pipe(gulp.dest("./"));
})

gulp.task("copy-data", () => {
    ["export", "import", "temp", "dist"].forEach(directory => {
        if (fs.existsSync(directory))
            fs.mkdirSync(path.join(dataDir, directory), { recursive: true });
    });

    return gulp.src("data/**/*")
        .pipe(gulp.dest(dataDir));
})

gulp.task("copy-templates", ()=>{
    return gulp.src(templatesPath)
        .pipe(gulp.dest(path.join(codeDir, "templates")));
})

gulp.task("copy-others", () => {
    return gulp.src(otherFiles, { base: "." })
        .pipe(gulp.dest(path.join(codeDir)));
})

gulp.task("compile-ts", () => {
    return gulp.src(tsConfigs.include, { base: "." })
        .pipe(srcProject())
        .pipe(gulp.dest(path.join(codeDir)));
});

gulp.task("zip-llplugin", () => {
    return gulp.src(path.join(codeDir, "**/*"))
        .pipe(gulpZip(`${name}.llplugin`))
        .pipe(gulp.dest(releaseDir));
});

gulp.task("copy-data-dist", () => {
    const targetDir = path.join(releaseDir, name)
    if (fs.existsSync(targetDir))
        deleteSync([targetDir], { force: true });

    ["export", "import", "temp", "dist"].forEach(directory => {
        fs.mkdirSync(path.join(targetDir, directory), { recursive: true });
    });

    return gulp.src("data/**/*")
        .pipe(gulp.dest(targetDir));
})

gulp.task("copy-build", () => {
    return gulp.src(buildDir + "/**/*")
        .pipe(gulp.dest(distDir));
})

gulp.task("zip-release", () => {
    return gulp.src(
        [releaseDir + "/**/*"],
        { base: releaseDir })
        .pipe(gulpZip(`${name}-${version}.zip`))
        .pipe(gulp.dest(distDir));
});

gulp.task("copy-dep", ()=>{
    return gulp.src(
        ["node_modules/**/*", "!node_modules/@types/**/*"])
        .pipe(gulp.dest(path.join(depDir, "node_modules")));
})

gulp.task("zip-dep", ()=>{
    return gulp.src(
        [depDir + "/**/*"],
        { base: depDir })
        .pipe(gulpZip(`${name}-${version}-dependencies.zip`))
        .pipe(gulp.dest(distDir));
})

gulp.task("init", gulp.series(["set-lib", "copy-data"]))

gulp.task("compile",
    gulp.parallel("compile-ts","copy-templates", "copy-others")
)

gulp.task("watch", () => {
    gulp.series("compile")()
    gulp.watch(tsConfigs.include, gulp.series("compile-ts"));
    gulp.watch(otherFiles, gulp.series("copy-others"));
    gulp.watch(templatesPath, gulp.series("copy-data"));
});

gulp.task("build", gulp.series([
    "set-lib",
    "compile",
    "zip-llplugin",
    "copy-data-dist",
    "copy-build",
    "zip-release",
    "copy-dep",
    "zip-dep"
]));

gulp.task("default", gulp.series("watch"));