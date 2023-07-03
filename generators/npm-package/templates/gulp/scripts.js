import {join, relative} from 'node:path/posix';

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
		.pipe(dest(join(getDirectory(config.build.libs), config.name, relative(config.src.base, getDirectory(config.src.scripts)))));
}



function examples() {
	return src(config.examples.scripts)
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



build.displayName = 'build:scripts';
examples.displayName = 'examples:scripts';
dist.displayName = 'dist:scripts';

export {
	build,
	examples,
	dist,
};
