import {existsSync, readFileSync} from 'node:fs';

import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import jsonImporter from 'node-sass-json-importer';
import postcss from 'gulp-postcss';
import presetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';

import {getBrowserSync, getDirectory, getRelativePath, resolveTildePath} from './utilities.js';



const {src, dest} = gulp;
const sass = gulpSass(dartSass);
const {reload} = getBrowserSync();



function build() {
	return src(config.src.styles)
		.pipe(sass({
			importer: [
				(url, filename) => url.startsWith('~')
					? {file: resolveTildePath(url, filename, 'sass')}
					: null,
				jsonImporter(),
			],
		}).on('error', sass.logError))
		.pipe(postcss([
			presetEnv({
				features: {
					'custom-properties': false,
					'prefers-color-scheme-query': false,
					'logical-properties-and-values': false,
				},
			}),
		]))
		.pipe(reload({
			stream: true,
		}))
		.pipe(dest(getDirectory(config.build.styles.general)));
}



function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.styles.general, {
		base: config.build.assets,
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
		.pipe(dest(config.dist.assets))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}



function backend(done) {
	src([
		config.dist.styles.general,
		`!${config.dist.styles.rte}`,
	])
		.pipe(dest(getDirectory(config.backend.styles.general)));

	src(config.build.styles.rte)
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
		.pipe(dest(getDirectory(config.backend.styles.rte)));

	done();
}



build.displayName = 'build:styles';
dist.displayName = 'dist:styles';
backend.displayName = 'backend:styles';

export {
	build,
	dist,
	backend,
};
