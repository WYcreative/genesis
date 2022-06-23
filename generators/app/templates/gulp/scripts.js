import gulp from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import uglifyEs from 'gulp-uglify-es';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;
const {default: uglify} = uglifyEs;


function build() {
	return src(config.src.scripts)
		.pipe(plumber())
		.pipe(babel())
		.pipe(dest(getDirectory(config.build.scripts)));
}


function dist() {
	return src(config.build.scripts)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(dest(getDirectory(config.dist.scripts)));
}


build.displayName = 'scripts:build';
build.displayName = 'scripts:dist';

export {
	build,
	dist,
};
