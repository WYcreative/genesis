import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import postcss from 'gulp-postcss';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

import config from '../config/index.js';
import {getBrowserSync, getDirectory} from './utilities.js';


const {src, dest} = gulp;
const sass = gulpSass(dartSass);
const {reload} = getBrowserSync();


function build() {
	return src(config.src.styles)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			presetEnv(),
		]))
		.pipe(reload({
			stream: true,
		}))
		.pipe(dest(getDirectory(config.build.styles)));
}


function dist() {
	return src(config.build.styles)
		.pipe(postcss([
			cssnano(),
		]))
		.pipe(dest(getDirectory(config.dist.styles)));
}


build.displayName = 'styles:build';
dist.displayName = 'styles:dist';

export {
	build,
	dist,
};
