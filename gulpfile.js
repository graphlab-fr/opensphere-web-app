var gulp = require('gulp');
var browserSync = require('browser-sync');

/**
 * -----------------------
 * Commande par DÉFAUT
 * ---
 * - Affichage du message "Hello world"
 * -----------------------
 */

gulp.task('default', function () {
    console.log('Hello world');
});

/**
 * -----------------------
 * Commandes de GÉNÉRATION
 * ---
 * - $ gulp css => compliation SCSS -> main.css + prefixage
 * - $ gulp js => concatenation JS -> main.js
 * -----------------------
 */

// https://www.npmjs.com/package/gulp-sass
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
// https://www.npmjs.com/package/gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function () {
    return gulp.src('./dist/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('./assets'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// https://www.npmjs.com/package/gulp-concat
var concat = require('gulp-concat');

gulp.task('js', function () {
    return gulp.src('./dist/scripts/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./assets/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * -----------------------
 * Commandes de MINIFICATION
 * ---
 * - $ gulp minify => minification JS et CSS
 * -----------------------
 */

https: //www.npmjs.com/package/gulp-clean-css
    var minifyCss = require('gulp-clean-css');

gulp.task('minifyCSS', function () {
    return gulp.src('./assets/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./assets/'));
});

// https://www.npmjs.com/package/gulp-minify
var minifyJs = require('gulp-minify');

gulp.task('minifyJS', function () {
    return gulp.src('./assets/*.js')
        .pipe(minifyJs({
            ext: {
                src: 'main.js'
            }
        }))
        .pipe(gulp.dest('./assets/'));
});

gulp.task('minify', gulp.series('minifyCSS', 'minifyJS'));

/**
 * -----------------------
 * Commande d'AUTOMATISATION
 * ---
 * - $ gulp watch => activation des commandes de GÉNÉRATION
 * -----------------------
 */

gulp.task('watch', function () {
    gulp.watch('./dist/sass/**/*.scss', gulp.series('css'))
        .on('change', function (event) {
            console.log('CSS updated');
        });
    gulp.watch('./dist/scripts/*.js', gulp.series('js'))
        .on('change', function (event) {
            console.log('JS updated');
        });
});