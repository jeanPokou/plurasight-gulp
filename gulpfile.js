var args = require('yargs').argv;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});

var config = require('./gulp.config')();
var del = require('del');

// funciton for anaylsing source with JsHint and JSCS
gulp.task('vet', function () {

    log('Analysing source with JhINt and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'), {
            verbose: true
        })
        .pipe($.jshint.reporter('fail'));

});

// task styles: compile css to less
gulp.task('styles', ['clean-styles'], function () {

    log('Compiling less --> css ');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.if(args.verbose, $.print()))
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));

});

// task clean : cleaning temp file containing styles
gulp.task('clean-styles', function () {

    var files = config.temp + '**/*.css';
    clean(files);

});


// task less-watcher : watching less files and calling styles task
gulp.task('less-watcher', function () {

    gulp.watch([config.less], ['styles']);

});

// wiredep for injecting js and css to inject at build time

gulp.task('wiredep', function () {

    log('wire up the bower css and js into the html');
    var options = config.getWiredepDefaultsOptions();
    var wiredep = require('wiredep').stream;
    var jsFiles = gulp.src(config.js);
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(jsFiles))
        .pipe(gulp.dest(config.client));

});

// task inject : insert the user created styles after preprocessing
// call concurently wiredep and styles before
gulp.task('inject', ['styles', 'wiredep'], function () {

    log('wire up the app css ');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));

});

// function for async cleaning a path
function clean(path) {

    log('cleaning ' + $.util.colors.blue(path));
    return del.sync(path);

}


// function for displaying messages log in console (String or Array of items)
function log(msg) {

    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));

    }

}
