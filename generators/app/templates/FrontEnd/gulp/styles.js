import {existsSync, readFileSync} from 'node:fs';

import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import postcss from 'gulp-postcss';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';
import {getBrowserSync, getDirectory, getRelativePath} from './utilities.js';


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
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.styles[0], {
		base: getDirectory(config.build.styles[0], 2),
	})
		.pipe(postcss([
			cssnano(),
		]))
		.pipe(rev())
		.pipe(rename(path => {
			if (path.basename.startsWith('rte-')) {
				path.basename = 'rte';
			}
		}))
		.pipe(revRewrite({
			manifest,
			modifyUnreved: (path, {relative}) => getRelativePath(path, relative),
			modifyReved: (path, {relative}) => getRelativePath(path, relative),
		}))
		.pipe(dest(getDirectory(config.dist.styles, 2)))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}


function backend(done) {
	src([
		config.dist.styles[0],
		`!${config.dist.styles[1]}`,
	])
		.pipe(dest(getDirectory(config.backend.styles[0])));

	src(config.build.styles[1])
		.pipe(rename(path => {
			if (path.basename === 'rte') {
				path.basename = 'RteStyle';
			}
		}))
		.pipe(dest(getDirectory(config.backend.styles[1])));

	done();
}


build.displayName = 'styles:build';
dist.displayName = 'styles:dist';
backend.displayName = 'styles:backend';

export {
	build,
	dist,
	backend,
};
