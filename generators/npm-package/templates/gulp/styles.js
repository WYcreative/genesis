import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import postcss from 'gulp-postcss';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

import config from '../config/index.js';

import {getBrowserSync, getDirectory, resolveTildePath} from './utilities.js';



const {src, dest} = gulp;
const sass = gulpSass(dartSass);
const {reload} = getBrowserSync();



function examples() {
	return src(config.examples.styles)
		.pipe(sass({
			importer: [
				(url, filename) => url.startsWith('~')
					? {file: resolveTildePath(url, filename, 'sass')}
					: null,
			],
		}).on('error', sass.logError))
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



examples.displayName = 'examples:styles';
dist.displayName = 'dist:styles';

export {
	examples,
	dist,
};
