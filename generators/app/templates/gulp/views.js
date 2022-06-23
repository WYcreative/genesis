import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function build() {
	return src([
		config.src.views,
		'!**/_*/**',
		'!**/_*',
	])
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
		}))
		.pipe(dest(getDirectory(config.build.views)));
}


function dist() {
	return src(config.build.views)
		.pipe(dest(getDirectory(config.dist.views)));
}


build.displayName = 'views:build';
dist.displayName = 'views:dist';

export {
	build,
	dist,
};
