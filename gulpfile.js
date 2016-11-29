var gulp = require("gulp");
var concat = require("gulp-concat");
var gp_rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('concat', function() {

    gulp.src([
            './Kakao.js',
            './Kakao/plugins.js',
            './Kakao/lib/listener.js',
            './Kakao/lib/filter.js',
            './Kakao/lib/format.js',
            './Kakao/lib/istype.js',
            './Kakao/lib/media.js',
            './Kakao/lib/object.js',
            './Kakao/lib/regex.js',
            './Kakao/lib/prototype.js',
            './Kakao/screens.js',
            './Kakao/reference.js',
            './Kakao/selectors.js',
            './Kakao/selectors.all.js',
            './Kakao/selectors.defaults.js',
            './Kakao/selectors.inline.js',
            './Kakao/selectors.table.js',
            './Kakao/selectors.float.js',
            './Kakao/markers.js',
            './Kakao/grid.js',
            './Kakao/groups.js',
            './Kakao/magnets.js',
            './Kakao/clones.js',
            './Kakao/settings.js',
            './Kakao/start.js'
        ])
        .pipe(concat('Kakao.package.js'))
        .pipe(gulp.dest("./"))
        .pipe(gp_rename('Kakao.package.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./"))
})

gulp.task('default', ['concat']);