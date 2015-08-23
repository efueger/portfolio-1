﻿var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var requirejsOptimize = require('gulp-requirejs-optimize');
var concatCss = require('gulp-concat-css');
var watch = require('gulp-watch');


var requirePaths = {
    lib: 'source/scripts/app/lib',
    views: 'source/scripts/app/views',
    router5: 'node_modules/router5/dist/browser/router5',    
    vendors: 'source/scripts/vendors',
    TweenLite: 'source/scripts/vendors/TweenLite',
    routers: 'source/scripts/app/routers'
};

gulp.task('sass', function () {
    gulp.src('./source/styles/app/main.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(gulp.dest('./build/css'));
});


gulp.task('copy-js-files', function () {
    gulp.src(['node_modules/gulp-requirejs/node_modules/requirejs/require.js', 'source/scripts/vendors/page.js'])
   .pipe(gulp.dest('./build/scripts/'));
});

gulp.task('cssmin', function () {
    gulp.src('./build/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('minifyjs', function () {
    return gulp.src('./build/scripts/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('./build/scripts'));
});


gulp.task('requirejs:dev', function () {
    return gulp.src('source/scripts/app/main.js')
        .pipe(requirejsOptimize(function () {
            return {
                name: 'source/scripts/app/main',
                out: 'build/scripts/main.js',
                baseUrl: '',
                waitSeconds: 0,
                optimizeAllPluginResources: false,
                noGlobal: true,
                optimize: 'none',
                mainConfigFile: 'source/scripts/app/main.js',
                allowSourceOverwrites: false,
                paths: requirePaths
            };
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('requirejs:prod', function () {
    return gulp.src('source/scripts/app/main.js')
        .pipe(requirejsOptimize(function () {
            return {
                name: 'source/scripts/app/main',
                out: 'build/scripts/main.js',
                baseUrl: '',
                waitSeconds: 0,
                optimizeAllPluginResources: true,
                noGlobal: true,
                optimize: 'uglify',
                mainConfigFile: 'source/scripts/app/main.js',
                allowSourceOverwrites: false,
                paths: requirePaths
            };
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./source/styles/**/*.{sass,scss}', ['sass']);
    gulp.watch('./source/scripts/**/*.js', ['requirejs:dev']);
});

gulp.task('dev', ['sass','copy-js-files', 'requirejs:dev'], function () {
});

gulp.task('prod', ['sass', 'copy-js-files','cssmin', 'minifyjs', 'requirejs:prod'], function () {
});