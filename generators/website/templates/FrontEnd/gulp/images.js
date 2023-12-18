import {existsSync, readFileSync} from 'node:fs';
import {basename, extname} from 'node:path/posix';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import svgmin from 'gulp-svgmin';
import filter from 'gulp-filter';
import sharp from 'gulp-sharp-responsive';
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';

import {getDirectory, getRelativePath} from './utilities.js';



const {src, dest, lastRun} = gulp;



function build() {
	const vector = filter('**/*.svg', {restore: true});
	const raster = filter(['**', '!**/*.svg'], {restore: true});
	const ignoreWebP = filter(['**', '!**/favicons/**/*.webp'], {restore: true});

	return src(config.src.images, {
		since: lastRun(build),
	})
		.pipe(plumber())
		.pipe(vector)
		.pipe(svgmin({
			multipass: true,
		}))
		.pipe(vector.restore)
		.pipe(raster)
		.pipe(sharp({
			formats: [
				{
					pngOptions: {
						quality: 90,
					},
				},
				{
					format: 'webp',
				},
			],
		}))
		.pipe(raster.restore)
		.pipe(ignoreWebP)
		.pipe(dest(getDirectory(config.build.images)));
}



function examples() {
	const vector = filter('**/*.svg', {restore: true});
	const raster = filter(['**', '!**/*.svg'], {restore: true});

	return src(config.examples.images, {
		since: lastRun(examples),
	})
		.pipe(plumber())
		.pipe(vector)
		.pipe(svgmin({
			multipass: true,
		}))
		.pipe(vector.restore)
		.pipe(raster)
		.pipe(sharp({
			formats: [
				{
					pngOptions: {
						quality: 90,
					},
				},
				{
					format: 'webp',
				},
			],
		}))
		.pipe(raster.restore)
		.pipe(dest(getDirectory(config.buildExamples.images)));
}



function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.images, {
		base: config.build.assets,
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
		.pipe(dest(config.dist.assets))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}



function distExamples() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.buildExamples.images, {
		base: config.buildExamples.assets,
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
		.pipe(dest(config.distExamples.assets))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}



function backend() {
	return src(config.dist.images)
		.pipe(dest(getDirectory(config.backend.images)));
}



build.displayName = 'build:images';
examples.displayName = 'examples:images';
dist.displayName = 'dist:images';
distExamples.displayName = 'dist:examples:images';
backend.displayName = 'backend:images';

export {
	build,
	examples,
	dist,
	distExamples,
	backend,
};
