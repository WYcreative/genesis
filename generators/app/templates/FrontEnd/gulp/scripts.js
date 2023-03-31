<% if (type === 'website') { -%>
import {existsSync, readFileSync} from 'node:fs';

<% } -%>
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import uglifyEs from 'gulp-uglify-es';
<% if (type === 'website') { -%>
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';
<% } -%>

import config from '../config/index.js';
import {getDirectory<% if (type === 'website') { %>, getRelativePath<% } -%>} from './utilities.js';


const {src, dest} = gulp;
const {default: uglify} = uglifyEs;


function build() {
	return src(config.src.scripts)
		.pipe(plumber())
		.pipe(babel())
		.pipe(dest(getDirectory(config.build.scripts)));
}


function dist() {
	<%_ if (type === 'website') { -%>
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	<%_ } -%>
	return src(config.build.scripts, {
		base: getDirectory(config.build.scripts, 2),
	})
		.pipe(plumber())
		.pipe(uglify())
		<%_ if (type === 'website') { -%>
		.pipe(rev())
		.pipe(revRewrite({
			manifest,
			modifyUnreved: (path, {relative}) => getRelativePath(path, relative),
			modifyReved: (path, {relative}) => getRelativePath(path, relative),
		}))
		<%_ } -%>
		.pipe(dest(getDirectory(config.dist.scripts, 2)))<% if (type === 'website') { %>
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)))<% } %>;
}
<% if (type === 'website') { -%>


function backend() {
	return src(config.dist.scripts)
		.pipe(dest(getDirectory(config.backend.scripts)));
}
<% } -%>


build.displayName = 'build:scripts';
dist.displayName = 'dist:scripts';
<% if (type === 'website') { -%>
backend.displayName = 'backend:scripts';
<% } -%>

export {
	build,
	dist,
	<%_ if (type === 'website') { -%>
	backend,
	<%_ } -%>
};
