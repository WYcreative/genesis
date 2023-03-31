<% if (type === 'website') { -%>
import {existsSync, readFileSync} from 'node:fs';

<% } -%>
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import postcss from 'gulp-postcss';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
<% if (type === 'website') { -%>
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import revRewrite from 'gulp-rev-rewrite';
<% } -%>

import config from '../config/index.js';
import {getBrowserSync, getDirectory<% if (type === 'website') { %>, getRelativePath<% } %>} from './utilities.js';


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
	<%_ if (type === 'website') { -%>
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	<%_ } -%>
	return src(config.build.styles[0], {
		base: getDirectory(config.build.styles[0], 2),
	})
		.pipe(postcss([
			cssnano(),
		]))
		<%_ if (type === 'website') { -%>
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
		<%_ } -%>
		.pipe(dest(getDirectory(config.dist.styles, 2)))<% if (type === 'website') { %>
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)))<% } %>;
}
<% if (type === 'website') { -%>


function backend(done) {
	src([
		config.dist.styles[0],
		`!${config.dist.styles[1]}`,
	])
		.pipe(dest(getDirectory(config.backend.styles[0])));

	src(config.build.styles[1])
		.pipe(rename(path => {
			if (path.basename.startsWith('rte')) {
				let suffix = '';

				if (path.basename.startsWith('rte-')) {
					suffix = path.basename
						.split('-')
						.slice(1)
						.map(word => word.slice(0, 1).toUpperCase() + word.slice(1));
				}

				path.basename = `RteStyle${suffix}`;
			}
		}))
		.pipe(dest(getDirectory(config.backend.styles[1])));

	done();
}
<% } -%>


build.displayName = 'build:styles';
dist.displayName = 'dist:styles';
<% if (type === 'website') { -%>
backend.displayName = 'backend:styles';
<% } -%>

export {
	build,
	dist,
	<%_ if (type === 'website') { -%>
	backend,
	<%_ } -%>
};
