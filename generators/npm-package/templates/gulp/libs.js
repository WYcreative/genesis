import {join} from 'node:path/posix';
import {readFileSync} from 'node:fs';

import {deleteSync} from 'del';
import {globbySync, isDynamicPattern} from 'globby';
import gulp from 'gulp';
import rename from 'gulp-rename';

import config from '../config/index.js';

import {getDirectory} from './utilities.js';



const {src, dest} = gulp;



async function build(done) { // eslint-disable-line complexity
	const {dependencies} = JSON.parse(readFileSync('./package.json'));
	const {default: libs} = await import(`${join('..', config.libs)}?t=${Date.now()}`);

	const normalizedLibs = {};

	for (const dependency of Object.keys(dependencies)) {
		const definedInLibs = Object.values(libs).some(value => {
			if (typeof value === 'string') {
				value = [value];
			}

			return value.some(item => item.includes(dependency));
		});

		if (definedInLibs) {
			continue;
		}

		let {files, exports, main, browser} = JSON.parse(readFileSync(join('node_modules', dependency, 'package.json')));

		files = typeof exports === 'object' && exports !== null && Array.isArray(exports) === false
			? (
				Object.values(exports).some(item => typeof item !== 'string')
					? Object.entries(exports).filter(([key, _]) =>
						[
							'import',
							'require',
							'module',
							'style',
							'browser',
							'default',
						].includes(key),
					).map(([_, value]) => value)
					: Object.values(exports)
			)
			: exports || files || main || browser || 'index.js';

		files = globbySync(files, {
			cwd: join('node_modules', dependency),
		});

		for (const file of files) {
			normalizedLibs[join(dependency, file)] = join('node_modules', dependency, file);
		}
	}

	for (let [destPath, srcPaths] of Object.entries(libs)) {
		if (typeof srcPaths === 'string') {
			srcPaths = [srcPaths];
		}

		for (const srcPath of srcPaths) {
			// Match one of the following:
			// - module/**
			// - @scope/module/**
			// - node_modules/module/**
			// - node_modules/@scope/module/**
			// - /node_modules/module/**
			// - /node_modules/@scope/module/**
			// - ./node_modules/module/**
			// - ./node_modules/@scope/module/**
			const packageRegex = /^(?:(?!\.{0,2}\/)(?:node_modules\/)?|\.{0,2}\/node_modules\/)(?<package>(?!@|node_modules).+?(?=\/)|@(?:.+?(?=\/)){2})\/(?<file>.+)/;
			const packageMatch = srcPath.match(packageRegex);

			if (packageMatch) {
				const cwd = join('node_modules', packageMatch.groups.package);
				const files = globbySync(packageMatch.groups.file, {
					cwd,
				});

				for (const file of files) {
					normalizedLibs[isDynamicPattern(srcPath) ? join(destPath, file) : destPath] = join(cwd, file);
				}
			} else if (isDynamicPattern(srcPath)) {
				const cwd = getDirectory(srcPath);
				const glob = srcPath.slice(cwd.length);
				const files = globbySync(glob.startsWith('/') ? glob.slice(1) : glob, {
					cwd,
				});

				for (const file of files) {
					normalizedLibs[join(destPath, file)] = join(cwd, file);
				}
			} else {
				normalizedLibs[destPath] = srcPath;
			}
		}
	}

	deleteSync(config.build.libs);

	for (const [destPath, srcPath] of Object.entries(normalizedLibs)) {
		src(srcPath)
			.pipe(rename(destPath))
			.pipe(dest(getDirectory(config.build.libs)));
	}

	done();
}



function dist() {
	return src(config.build.libs)
		.pipe(dest(getDirectory(config.dist.libs)));
}



build.displayName = 'build:libs';
dist.displayName = 'dist:libs';

export {
	build,
	dist,
};
