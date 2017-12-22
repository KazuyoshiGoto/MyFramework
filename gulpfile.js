var gulp = require('gulp');
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var browserSync = require("browser-sync");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

//setting : paths
var paths = {
  'scss': './src/sass/',
  'css': './dist/css/',
  'pug': './src/pug/',
  'html': './dist/',
  'jsSrc': './src/js/',
  'jsDist': './dist/js/'
}
//setting : Sass Options
var sassOptions = {
  outputStyle: 'compressed'
}
//setting : Pug Options
var pugOptions = {
  pretty: true
}

//Sassコンパイル
gulp.task('scss', function () {
  gulp.src(paths.scss + '**/*.scss')
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css))
});

//Pugコンパイル
gulp.task('pug', () => {
  return gulp.src([paths.pug + '**/*.pug', '!' + paths.pug + '**/_*.pug'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.html));
});

//JS結合
gulp.task('browserify', () => {
  return browserify({
    entries: [paths.jsSrc + 'main.js', paths.jsSrc + 'vuetest.js',]
  })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.jsDist));
});

//JS圧縮
gulp.task('compress', () => {
  return gulp.src(paths.jsDist + '*.js')
    .pipe(uglify())
    .pipe(gulp.dest(paths.jsDist));
});

//ブラウザ同期
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: paths.html
    }
  });
  gulp.watch(paths.js + "**/*.js", ['reload']);
  gulp.watch(paths.html + "**/*.html", ['reload']);
  gulp.watch(paths.css + "**/*.css", ['reload']);
});
gulp.task('reload', () => {
  browserSync.reload();
});

//watch
gulp.task('watch', function () {
  gulp.watch(paths.scss + '**/*.scss', ['scss']);
  gulp.watch([paths.pug + '**/*.pug', '!' + paths.pug + '**/_*.pug'], ['pug']);
  gulp.watch(paths.jsSrc + '**/*.js', ['browserify']);
  gulp.watch(paths.jsDist + '**/*.js', ['compress']);
});

gulp.task('default', ['browser-sync', 'watch']);