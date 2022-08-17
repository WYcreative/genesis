import {existsSync, readFileSync} from 'node:fs';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import revRewrite from 'gulp-rev-rewrite';
import rename from 'gulp-rename';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function build() {
	return src(config.src.views)
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
		}))
		.pipe(dest(getDirectory(config.build.views)));
}


function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.views)
		.pipe(revRewrite({
			manifest,
		}))
		.pipe(dest(getDirectory(config.dist.views)));
}


function backend() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: '{}';

	return src(config.src.backend)
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
			locals: {
				files: JSON.parse(manifest),
			},
		}))
		.pipe(rename(path => {
			path.extname = '.cshtml';
		}))
		.pipe(dest(config.backend.base));
}


build.displayName = 'views:build';
dist.displayName = 'views:dist';
backend.displayName = 'views:backend';

export {
	build,
	dist,
	backend,
};