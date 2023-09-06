import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path/posix';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import walk from 'pug-walk';
import revRewrite from 'gulp-rev-rewrite';
import rename from 'gulp-rename';

import config from '../config/index.js';

import {getDirectory, resolveTildePath} from './utilities.js';



const {src, dest} = gulp;

const pugOptions = {
	pretty: true,
	plugins: [
		{
			postParse: (ast, {filename}) =>
				walk(ast, (node, replace) => {
					if (['Include', 'RawInclude'].includes(node.type) && node.file.path.startsWith('~')) {
						const path = node.file.path
							.slice(0, /^~(?:@.+\/.+|[^@].+)\/.+/.test(node.file.path) === false ? -4 : undefined);

						const resolvedPath = resolveTildePath(path, filename, 'pug');

						if (resolvedPath) {
							const clone = JSON.parse(JSON.stringify(node));

							clone.file.path = resolvedPath;

							replace(clone);

							return false;
						}
					}

					return true;
				}),
		},
	],
};



function build() {
	return src(config.src.views)
		.pipe(plumber())
		.pipe(pug(pugOptions))
		.pipe(dest(getDirectory(config.build.views)));
}



function examples() {
	return src(config.examples.views)
		.pipe(plumber())
		.pipe(pug(pugOptions))
		.pipe(dest(getDirectory(config.buildExamples.views)));
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



function distExamples() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.buildExamples.views)
		.pipe(revRewrite({
			manifest,
		}))
		.pipe(dest(getDirectory(config.distExamples.views)));
}



function backend() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: '{}';

	return src(config.src.backend)
		.pipe(plumber())
		.pipe(pug({
			...pugOptions,
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



build.displayName = 'build:views';
examples.displayName = 'examples:views';
dist.displayName = 'dist:views';
distExamples.displayName = 'dist:examples:views';
backend.displayName = 'backend:views';

export {
	build,
	examples,
	dist,
	distExamples,
	backend,
};
