import gulp from 'gulp';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function build() {
	return src(config.src.images)
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(dest(getDirectory(config.build.images)));
}


function dist() {
	return src(config.build.images)
		.pipe(dest(getDirectory(config.dist.images)));
}


build.displayName = 'images:build';
dist.displayName = 'images:dist';

export {
	build,
	dist,
};
