var gulp = require('gulp'),  
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./public"
        },
        open: false,
    });
});

var paths = {  
    'dev': {
        'less': './_dev/less/',
        'js': './_dev/js/'
    },
    'assets': {
        'css': './public/assets/css/',
        'js': './public/assets/js/',
        'fonts': './public/assets/fonts/',
        'vendor': './bower_components/'
    }
};

function catchError(error) { 
    console.log(error.toString());
    this.emit('end'); 
}

gulp.task('build', ['copy-fonts', 'copy-variables', 'styles.css', 'scripts.js']);

gulp.task('copy-fonts', function() {  
  return gulp.src(paths.assets.vendor + 'bootstrap/fonts/**')
    .pipe(gulp.dest(paths.assets.fonts));
});

gulp.task('copy-variables', function() {  
  return gulp.src(paths.assets.vendor + 'bootstrap/less/variables.less')
    .pipe(gulp.dest(paths.dev.less));
});

gulp.task('styles.css', function() {  
  return gulp.src(paths.dev.less + 'styles.less')
    .pipe(less()).on('error', catchError)
    .pipe(gulp.dest(paths.assets.css)) 
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.assets.css))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts.js', function() {  
  return gulp.src([
      paths.assets.vendor + 'jquery/dist/jquery.js',
      paths.assets.vendor + 'bootstrap/dist/js/bootstrap.js',
      paths.dev.js + 'scripts.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(paths.assets.js))
    .pipe(uglify()).on('error', catchError)
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.assets.js))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', ['browser-sync'], function() {  
  gulp.watch(paths.dev.less + '*.less', ['styles.css', browserSync.reload]);
  gulp.watch(paths.dev.js + '*.js', ['scripts.js', browserSync.reload]);
  gulp.watch('./public/*.html', browserSync.reload);
});
