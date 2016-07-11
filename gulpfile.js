var gulp = require('gulp'),
    notify = require('gulp-notify'),
    gulpif = require('gulp-if'),
    //uglify = require('gulp-uglify'),
    //minifyCss = require('gulp-minify-css'),
    sass= require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sftp = require('gulp-sftp'),
    plumberNotifier = require('gulp-plumber-notifier'),
    plumber = require('gulp-plumber'),
    wait = require('gulp-wait'),
    ftp = require( 'vinyl-ftp' );




function errorAlert(error){
  notify.onError({title: "SCSS Error", message: error.toString(), sound: "Sosumi"})(error); //Error Notification
  console.log(error.toString());//Prints Error to Console
  this.emit("end"); //End function
};

//ftp
var conn = ftp.create( {
  host:     '185.47.153.28',
  user:     'wfsadmin',
  password: '',
  parallel: 10
} );
// css
gulp.task('css', function () {
  return gulp.src('./sass/all*.scss')
    //.pipe(plumber())
    //.pipe(plumberNotifier())
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(wait(500))
    .pipe(sass({ includePaths : ['_/sass/'] })) 
    .pipe(autoprefixer({
      browsers: ['last 10 versions', '> 1%', 'IE 9'],
      cascade: false
    }))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('D:/OpenServer/domains/bitrix-onbike/bitrix/templates/onbike'))
    //.pipe( conn.dest( '/www/new.on-bike.by/bitrix/templates/onbike' ) )
    .pipe( conn.dest( '/www/on-bike.by/bitrix/templates/onbike' ) )
    .pipe(notify('CSS - Done!'));
});

// SFTP
gulp.task('sftp', function () {
  return gulp.src('css/all.css')
    .pipe(sftp({
      host: 'wfs.by',
      auth: 'key',
      remotePath: '/home/evasby/www/on-bike/bitrix/templates/onbike/css'
    }));
});
gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['css']);
  //gulp.watch('css/all.css', ['sftp']);
});

// default
//gulp.task('default', ['css', 'sftp', 'watch']);
gulp.task('default', ['css', 'watch']);