var gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifyCss = require("gulp-minify-css"),
    uglify = require("gulp-uglify"),
    gulpFilter = require('gulp-filter'),
    bower = require('main-bower-files');

// bowerで導入したパッケージのCSSを取ってくるタスク
gulp.task('css', function() {
  var cssLibDir = 'dev/assets/css/lib/', // cssを出力するディレクトリ
      cssFilter  = gulpFilter('**/*.css', {restore: true}),
      lessFilter = gulpFilter('**/*.less', {restore: true}); // Bootstrapのコアがlessなのでlessをファイルを抽出するフィルター
  return gulp.src( bower({
      paths: {
        bowerJson: 'bower.json'
      }
    }) )
    .pipe( cssFilter )
    .pipe( rename({
      prefix: '_',
      extname: '.css'
    }) )
    .pipe( gulp.dest(cssLibDir) )
    .pipe( cssFilter.restore )
    // LESSファイルを抽出
    .pipe( lessFilter )
    // LESSをコンパイル
    .pipe( less() )
    .pipe( rename({
      prefix: '_',
      extname: '.css'
    }) )
    // filter.restoreする前にgulp.destで出力しないとフィルター外のファイルも出力されてしまう
    .pipe( gulp.dest(cssLibDir) )
    .pipe( lessFilter.restore );
});

// パッケージのCSSを1つに結合してmin化するタスク
gulp.task('concatCSS', ['css'] ,function() {
  var cssDir = 'dev/assets/css/', // 結合したcssを出力するディレクトリ
      cssLibDir = 'dev/assets/css/lib/'; // ライブラリのCSSが置いてあるディレクトリ
  return gulp.src(cssLibDir + '_*.css')
    .pipe( concat('_bundle.css') )
    // CSSを1つにしたものを出力
    .pipe( gulp.dest(cssDir) )
    .pipe( minifyCss() )
    .pipe( rename({
      extname: '.min.css'
    }) )
    // CSSを1つにしてmin化したものを出力
    .pipe( gulp.dest(cssDir) );
});

// bowerで導入したパッケージのjsを取ってきて1つにまとめるタスク
gulp.task('js', function() {
  var jsDir = 'dev/assets/js/', // jsを出力するディレクトリ
      jsFilter = gulpFilter('**/*.js', {restore: true}); // jsファイルを抽出するフィルター
  return gulp.src( bower({
      paths: {
        bowerJson: 'bower.json'
      }
    }) )
    .pipe( jsFilter )
    .pipe( concat('_bundle.js') )
    // jsを1つにしたものを出力
    .pipe( gulp.dest(jsDir) )
    .pipe( uglify({
      // !から始まるコメントを残す
      preserveComments: 'some'
    }) )
    .pipe( rename({
      extname: '.min.js'
    }) )
    // jsを1つにしてmin化したものを出力
    .pipe( gulp.dest(jsDir) )
    .pipe( jsFilter.restore );
});

// bowerのCSSとJSを取ってくるタスク
gulp.task('buld', ['concatCSS','js']);

gulp.task('default', ['concatCSS','css'])