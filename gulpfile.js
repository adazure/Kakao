var gulp = require("gulp");
var concat = require("gulp-concat");
var gp_rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('concat', function() {

    gulp.src([
            './Kakao.js',
            './Kakao/lib/dom.js',
            './Kakao/lib/filter.js',
            './Kakao/lib/foreach.js',
            './Kakao/lib/format.js',
            './Kakao/lib/istype.js',
            './Kakao/lib/media.js',
            './Kakao/lib/object.js',
            './Kakao/lib/regex.js',
            './Kakao/lib/style.js',
            './Kakao/lib/listener.js',
            './Kakao/screens.js',
            './Kakao/reference.js',
            './Kakao/selectors.js',
            './Kakao/markers.js',
            './Kakao/grid.js',
            './Kakao/groups.js',
            './Kakao/magnet.js',
            './Kakao/Start.js'
        ])
        .pipe(concat('Kakao.package.js'))
        .pipe(gulp.dest("./"))
        .pipe(gp_rename('Kakao.package.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./"))
})

gulp.task('default', ['concat']);