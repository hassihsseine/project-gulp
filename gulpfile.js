var gulp = require('gulp');
var browsersync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
//var jpegtran = require('imagemin-jpegtran');
//var gifsicle = require('imagemin-gifsicle');
// var pngopti = require('imagemin-pngquant');


async function styles() {
    return gulp.src('src/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browsersync.stream());
}

async function bootstrap_styles() {
    return gulp.src('src/bootstrap/bootstrap.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(rename('bootstrap.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browsersync.stream());
}

async function vendor_styles() {
    return gulp.src('src/plugins/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browsersync.stream());
}

async function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browsersync.stream());
}

async function vendor_scripts() {
    return gulp.src('src/plugins/**/*.js')
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browsersync.stream());
}

async function compress_images() {
    return gulp.src("src/images/**/*.*")
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false,
                    cleanupIDs: false,
                }]
            })
        ]))
        .pipe(gulp.dest('dist/images'))
        .pipe(browsersync.stream());
}

function watch() {
    browsersync.init({
        server: {
            baseDir: './',
        }
    })
    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch('src/bootstrap/**/*.scss', bootstrap_styles);
    gulp.watch('src/images/**/*.*', compress_images);
    gulp.watch('src/plugins/**/*.js', vendor_styles);
    gulp.watch('src/plugins/**/*.js', vendor_scripts);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browsersync.reload);
}

exports.default = gulp.series(
    gulp.parallel([styles, bootstrap_styles]),
    compress_images,
    gulp.parallel([vendor_styles, vendor_scripts, scripts]),
    watch,
)

exports.styles = styles;
exports.bootstrap_styles = bootstrap_styles;
exports.vendor_styles = vendor_styles;


exports.vendor_script = vendor_scripts;
exports.scripts = scripts;