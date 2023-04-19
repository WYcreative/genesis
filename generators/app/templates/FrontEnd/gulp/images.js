<% if (type === 'website') { -%>
import {existsSync, readFileSync} from 'node:fs';
import {basename, extname} from 'node:path/posix';

<% } -%>
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';
<% if (type === 'website') { -%>
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import revRewrite from 'gulp-rev-rewrite';
<% } -%>

import config from '../config/index.js';

import {getDirectory<% if (type === 'website') { %>, getRelativePath<% } %>} from './utilities.js';


const {src, dest} = gulp;


function build() {
	return src(config.src.images)
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(dest(getDirectory(config.build.images)));
}


function dist() {
	<%_ if (type === 'website') { -%>
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	<%_ } -%>
	return src(config.build.images, {
		base: getDirectory(config.build.images, 2),
	})
		<%_ if (type === 'website') { -%>
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
		<%_ } -%>
		.pipe(dest(getDirectory(config.dist.images[0], 2)))<% if (type === 'website') { %>
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)))<% } %>;
}
<% if (type === 'website') { -%>


function backend() {
	return src(config.dist.images)
		.pipe(dest(getDirectory(config.backend.images)));
}
<% } -%>


build.displayName = 'build:images';
dist.displayName = 'dist:images';
<% if (type === 'website') { -%>
backend.displayName = 'backend:images';
<% } -%>

export {
	build,
	dist,
	<%_ if (type === 'website') { -%>
	backend,
	<%_ } -%>
};
