<% if (type === 'website') { -%>
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path/posix';

<% } -%>
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
<% if (type === 'website') { -%>
import revRewrite from 'gulp-rev-rewrite';
import rename from 'gulp-rename';
<% } -%>

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
	<%_ if (type === 'website') { -%>
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	<%_ } -%>
	return src(config.build.views)
		<%_ if (type === 'website') { -%>
		.pipe(revRewrite({
			manifest,
		}))
		<%_ } -%>
		.pipe(dest(getDirectory(config.dist.views)));
}
<% if (type === 'website') { -%>


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
		.pipe(revRewrite({
			manifest,
			modifyUnreved: path => join('/atlas/examples/assets', path),
			modifyReved: path => join('/assets', path),
		}))
		.pipe(rename(path => {
			if (path.basename.startsWith('assets-')) {
				path.extname = '.cshtml';
			}
		}))
		.pipe(dest(config.backend.base));
}
<% } -%>


build.displayName = 'build:views';
dist.displayName = 'dist:views';
<% if (type === 'website') { -%>
backend.displayName = 'backend:views';
<% } -%>

export {
	build,
	dist,
	<%_ if (type === 'website') { -%>
	backend,
	<%_ } -%>
};
