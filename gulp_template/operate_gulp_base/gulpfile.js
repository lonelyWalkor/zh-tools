var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    plugins = gulpLoadPlugins(),
    pkg = require('./package.json'),
    banner = ['/**',
//         ' * DGG-' + new Date() + ' ',
        ' * DGG-研发部 2017-5  ',
        ' * @version： v<%= pkg.version %>',
        ' * @link： http://www.dgg.net',
        ' */',
        ''].join('\n'),
    PATH = {};

/* = 全局设置
 -------------------------------------------------------------- */
PATH.SRC = {
    HTML_UI : ['src/html/ui-cli/*.html'],
    CSS: ['src/css/**/*.css', '!src/css/common/**/*.css', '!src/css/**/*.min.css'],
    JS: ['src/js/**/*.js', '!src/js/**/*.min.js', '!src/js/base/dgg.js','!src/js/about/*.js'],
    IMAGE: ['src/images/**/*.{png,jpg,gif,svg}','!src/images/**/dgg_temp_*.{png,jpg,gif,svg}', '!src/images/temp/*.{png,jpg,gif,svg}'],
    LESS: 'src/css/**/*.less',
//     PLUGS: ['src/plugs/**/*.js', 'src/plugs/**/*.css', 'src/plugs/**/*.less','!src/plugs/vue/*.js','!src/plugs/qrcode/qrcode.js'],
    PLUGS_LESS: ['src/plugs/**/*.less'],
    PLUGS_CSS: ['src/plugs/**/*.css'],
    PLUGS_JS: ['src/plugs/**/*.js', '!src/plugs/vue/*.js', '!src/plugs/qrcode/qrcode.js']
};
PATH.DEST = {
    HTML_UI : 'src/html/ui/',
    CSS: 'build/css',
    JS: 'build/js',
    IMAGE: 'build/images',
    PLUGS: 'build/plugs'
};
PATH.CONCAT={
    DGG_BASE_JS:['src/js/base/dgg.js','build/js/jquery-1.10.2.min.js','src/js/base/dgg-common.js']
}

//html
gulp.task('html', function () {
    return gulp.src(PATH.SRC.HTML_UI)
        .pipe(plugins.fileInclude({
            prefix: '@@',
            basepath: 'src/html/template'
        }))
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(PATH.DEST.HTML_UI))
});


gulp.task('script-base', function (){
    gulp.src(PATH.CONCAT.DGG_BASE_JS)
        .pipe(plugins.concat('dgg-0.0.1.js'))
        // .pipe(gulp.dest(destPath.script));
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify({preserveComments: 'some'}))
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(gulp.dest(PATH.DEST.JS+'/base'));
});

gulp.task('css', function (){
    gulp.src(PATH.SRC.CSS)
        .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.minifyCss())
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(gulp.dest(PATH.DEST.CSS));
    gulp.src(PATH.SRC.PLUGS_CSS)
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.minifyCss())
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(gulp.dest(PATH.DEST.PLUGS));
});
gulp.task("js", function (){
    gulp.src(PATH.SRC.JS)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default', {verbose: true}))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.uglify({mangle: true}))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(gulp.dest(PATH.DEST.JS));
    gulp.src(PATH.SRC.PLUGS_JS)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default', {verbose: true}))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.uglify({mangle: true}))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(gulp.dest(PATH.DEST.PLUGS));
})
gulp.task('images', function (){
    return gulp.src(PATH.SRC.IMAGE)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(PATH.DEST.IMAGE));
});
gulp.task('less', function (){
    gulp.src(PATH.SRC.LESS)
        .pipe(plugins.less())
        .pipe(gulp.dest(function (f){
            return f.base;
        }));
    gulp.src(PATH.SRC.PLUGS_LESS)
        .pipe(plugins.less())
        .pipe(gulp.dest(function (f){
            return f.base;
        }));
});
gulp.task('copy',  function() {
    return gulp.src('src/js/about/*')
        .pipe(gulp.dest('build/js/about/'))
});
gulp.task('watch-less', function (){
    return gulp.watch([PATH.SRC.LESS, PATH.SRC.PLUGS_LESS], ['less']);
});
gulp.task('watch', function (){
    gulp.watch([PATH.SRC.CSS, PATH.SRC.PLUGS_CSS], ['css']);
    gulp.watch([PATH.SRC.JS, PATH.SRC.PLUGS_JS], ['js']);
    gulp.watch(PATH.SRC.IMAGE, ['images']);
    gulp.watch(PATH.SRC.HTML_UI, ['html']);
});
gulp.task('de', function (){
    return gulp.start ('js','css', 'images', 'less','script-base','html','copy');
});
gulp.task('release', function (){
    return gulp.start('less', 'js', 'css', 'image');
});
gulp.task('help', function (){
    console.log('gulp help			    gulp参数说明');
    console.log('----------------- 开发环境 -----------------');
    console.log('gulp css			    CSS压缩&重命名');
    console.log('gulp js			    JS压缩&重命名&检查');
    console.log('gulp images			    IMAGE图片压缩');
    console.log('gulp watch-less		LESS预解析');
    console.log('gulp watch			    CSS\JS\IMAGE动态监控');
    console.log('---------------- 发布环境 -----------------');
    console.log('gulp de			    测试打包');
    console.log('gulp release			打包发布');
});
