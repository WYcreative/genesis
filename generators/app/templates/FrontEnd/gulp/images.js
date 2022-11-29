import {existsSync, readFileSync} from 'node:fs';
import {basename, extname} from 'node:path/posix';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';
import {getDirectory, getRelativePath} from './utilities.js';


const {src, dest} = gulp;


function build() {
	return src(config.src.images)
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(dest(getDirectory(config.build.images)));
}


function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.images, {
		base: getDirectory(config.build.images, 2),
	})
		.pipe(rev())
		// TODO: Remove this once BE finds a method for handling image file revisions.
		.pipe(rename((path, {revOrigPath}) => {
			path.basename = basename(revOrigPath, extname(revOrigPath));
		}))
		.pipe(revRewrite({
			manifest,
			modifyUnreved: (path, {relative}) => getRelativePath(path, relative),
			modifyReved: (path, {relative}) => getRelativePath(path, relative),
		}))
		.pipe(dest(getDirectory(config.dist.images[0], 2)))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}


function backend() {
	return src(config.dist.images)
		.pipe(dest(getDirectory(config.backend.images)));
}


build.displayName = 'images:build';
dist.displayName = 'images:dist';
backend.displayName = 'images:backend';

export {
	build,
	dist,
	backend,
};
