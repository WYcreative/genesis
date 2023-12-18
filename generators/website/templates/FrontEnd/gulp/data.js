import {Buffer} from 'node:buffer';
import {existsSync, readFileSync} from 'node:fs';
import {basename, extname} from 'node:path/posix';

import gulp from 'gulp';
import isBinary from 'gulp-is-binary';
import tap from 'gulp-tap';
import stripJsonComments from 'strip-json-comments';
import rename from 'gulp-rename';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';

import {getDirectory, getRelativePath} from './utilities.js';



const {src, dest} = gulp;



function build() {
	return src(config.src.data)
		.pipe(isBinary())
		.pipe(tap(file => {
			if (file.isNull() || file.isBinary()) {
				return;
			}

			let contents = file.contents.toString();

			if (extname(file.path) === '.jsonc') {
				contents = stripJsonComments(contents, {
					trailingCommas: true,
				});
			}

			file.contents = Buffer.from(contents);
		}))
		.pipe(rename(path => {
			if (path.extname === '.jsonc') {
				path.extname = basename('.json');
			}
		}))
		.pipe(dest(getDirectory(config.build.data)));
}



function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.data, {
		base: config.build.assets,
	})
		.pipe(isBinary())
		.pipe(tap(file => {
			if (file.isNull() || file.isBinary()) {
				return;
			}

			let contents = file.contents.toString();

			if (extname(file.path) === '.json') {
				contents = JSON.stringify(JSON.parse(contents));
			}

			file.contents = Buffer.from(contents);
		}))
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
	return src(config.dist.data)
		.pipe(dest(getDirectory(config.backend.data)));
}



build.displayName = 'build:data';
dist.displayName = 'dist:data';
backend.displayName = 'backend:data';

export {
	build,
	dist,
	backend,
};
