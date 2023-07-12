import {existsSync, readFileSync} from 'node:fs';

import gulp from 'gulp';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';

import {getDirectory, getRelativePath} from './utilities.js';



const {src, dest} = gulp;



function build() {
	return src(config.src.fonts)
		.pipe(dest(getDirectory(config.build.fonts)));
}



function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.fonts, {
		base: config.build.assets,
	})
		.pipe(rev())
		.pipe(revRewrite({
			manifest,
			modifyUnreved: (path, {relative}) => getRelativePath(path, relative),
			modifyReved: (path, {relative}) => getRelativePath(path, relative),
		}))
		.pipe(dest(config.dist.assets))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}



function backend() {
	return src(config.dist.fonts)
		.pipe(dest(getDirectory(config.backend.fonts)));
}



build.displayName = 'build:fonts';
dist.displayName = 'dist:fonts';
backend.displayName = 'backend:fonts';

export {
	build,
	dist,
	backend,
};
