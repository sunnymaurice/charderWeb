/* jshint node: true */
'use strict';

var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	livereload = require('gulp-livereload'),
	useref = require('gulp-useref'),
	webserver = require('gulp-webserver');

var srcPath = './src';
var distPath = './www';

// sass預處理器，編譯css文件
gulp.task('sass', function() {
	gulp.task('sass', function() {
		sass(srcPath + '/scss/webapp.scss', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version')) 		// 根據can I use資料庫，自動補上各瀏覽器前綴字符
		.pipe(gulp.dest(distPath + '/css')) 		// css輸出位址
		.pipe(rename({ suffix: '.min' })) 			// 複製一個新增min檔名的檔案
		.pipe(minifycss()) 							// 小型化檔案，去除空白、斷行
		.pipe(gulp.dest(distPath + '/css')); 		// min.css輸出位址
	});
});

gulp.task('scripts', function() {
	gulp.src([
		srcPath + '/scripts/webapp.js',
		srcPath + '/scripts/services/*.js',
		srcPath + '/scripts/controls/*.js'])		// js有載入次序之分
	.pipe(jshint('.jshintrc')) 						// 根據jshintrc設定檔來檢測javascript
	.pipe(jshint.reporter('default')) 				// jshint報表使用預設樣式
	.pipe(concat('webapp.js')) 						// 所有的js檔都串接至此檔案
	.pipe(gulp.dest(distPath + '/js')) 				// js輸出位址
	.pipe(rename({suffix: '.min'})) 				// 複製一個新增min檔名的檔案
	.pipe(uglify()) 								// 醜化及小型化js檔，變數簡短化(a, b, c)、去除空白、斷行
	.pipe(gulp.dest(distPath + '/js')); 			// min.js輸出位址
});

// gulp.task('images', function() {
// 	gulp.src(srcPath + '/img/**/*')
// 	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
// 	.pipe(gulp.dest(distPath + '/img'))
// 	.pipe(notify({ message: 'Images task complete' }));
// });

gulp.task('useref', function () {  
	var assets = useref.assets();

	gulp.src(srcPath + '/index.html')
	.pipe(assets)
	.pipe(assets.restore())
	.pipe(useref())
	.pipe(gulp.dest(distPath));

	assets = useref.assets();
	gulp.src(srcPath + '/templates/**/*.html')
	.pipe(assets)
	.pipe(assets.restore())
	.pipe(useref())
	.pipe(gulp.dest(distPath + '/templates'));
});

 
gulp.task('webserver', function() {
	console.log(webserver);

	gulp.src(distPath)
	.pipe(webserver({
		host: 'localhost',
		port: 8200,
		livereload: true,
		directoryListing: false,
		open: true
	}));
});

gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch(srcPath + '/scss/**/*.scss', ['sass']);

	// Watch .js files
	gulp.watch([srcPath + '/script/webapp.js', srcPath + '/script/**/*.js'], ['scripts']);

	// Watch image files
	// gulp.watch(srcPath + '/img/**/*', ['images']);
	
	// Watch .html files
	gulp.watch(srcPath + '/templates/**/*.html', ['useref']);

	// Create LiveReload server
	livereload.listen();

	// Watch any files in dist/, reload on change
	gulp.watch([srcPath + '/**']).on('change', livereload.changed);

});

gulp.task('default', ['sass', 'useref', 'scripts'], function () {
	gulp.start('watch', 'webserver');
});