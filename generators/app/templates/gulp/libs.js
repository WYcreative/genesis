import {join} from 'node:path/posix';
import {existsSync, readFileSync} from 'node:fs';

import gulp from 'gulp';
import rename from 'gulp-rename';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';
import libs from '../config/libs.js';
import {getDirectory, getRelativePath} from './utilities.js';


const {src, dest} = gulp;


function build(done) {
	for (let [destPath, srcPath] of Object.entries(libs)) {
		if (srcPath.startsWith('node_modules') === false && srcPath.startsWith('./') === false && srcPath.startsWith('/') === false) {
			srcPath = join('node_modules', srcPath);
		}

		src(srcPath)
			.pipe(rename(destPath))
			.pipe(dest(getDirectory(config.build.libs)));
	}

	done();
}


function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.libs, {
		base: getDirectory(config.build.libs, 2),
	})
		.pipe(rev())
		.pipe(revRewrite({
			manifest,
			modifyUnreved: (path, {relative}) => getRelativePath(path, relative),
			modifyReved: (path, {relative}) => getRelativePath(path, relative),
		}))
		.pipe(dest(getDirectory(config.dist.libs, 2)))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}


function backend() {
	return src(config.dist.libs)
		.pipe(dest(getDirectory(config.backend.libs)));
}


build.displayName = 'libs:build';
dist.displayName = 'libs:dist';
backend.displayName = 'libs:backend';

export {
	build,
	dist,
	backend,
};
