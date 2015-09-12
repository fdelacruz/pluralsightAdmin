"use strict";

var gulp = require('gulp'),
		connect = require('gulp-connect'), // runs a local dev server
		open  = require('gulp-open'), // open a URL in a web browser
		browserify = require('browserify'), // bundles JS
		reactify = require('reactify'), // transforms React JSX to JS
		source = require('vinyl-source-stream'), // use conventional text streams with Gulp
		concat = require('gulp-concat'), // concatenates files
		lint = require('gulp-eslint'); // lint JS files, including JSX

var config = {
	port: 4000,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		images: './src/images/*',
		css: [
				'node_modules/bootstrap/dist/css/bootstrap.min.css',
				'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
				'node_modules/toastr/toastr.css'
		],
		dist: './dist',
		mainJs: './src/main.js'
	}
};

// start a local development server
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		 	.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function() {
	gulp.src(config.paths.html)
			.pipe(gulp.dest(config.paths.dist))
			.pipe(connect.reload());
});

gulp.task('js', function() {
	browserify(config.paths.mainJs)
			.transform(reactify)
			.bundle()
			.on('error', console.error.bind(console))
			.pipe(source('bundle.js'))
			.pipe(gulp.dest(config.paths.dist + '/scripts'))
			.pipe(connect.reload());
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
			.pipe(concat('bundle.css'))
			.pipe(gulp.dest(config.paths.dist + '/css'));
});

// migrates images to dist folder
// note that I could even optimize my images here
gulp.task('images', function() {
	gulp.src(config.paths.images)
			.pipe(gulp.dest(config.paths.dist + '/images'))
			.pipe(connect.reload());

			// publish favicon
			gulp.src('./src/favicon.ico')
					.pipe(gulp.dest(config.paths.dist));
});

gulp.task('lint', function() {
	  return gulp.src(config.paths.js)
				.pipe(lint({ config: 'eslint.config.json' }))
				.pipe(lint.format());
});

gulp.task('watch', function() {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html','js', 'css', 'images', 'lint', 'open', 'watch']);
