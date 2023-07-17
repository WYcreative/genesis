import {join, relative, resolve} from 'node:path/posix';
import {existsSync, readFileSync} from 'node:fs';

import {globbySync} from 'globby';
import {rollup} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import uglifyEs from 'gulp-uglify-es';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';

import {getDirectory, getRelativePath} from './utilities.js';



const {src, dest} = gulp;
const {default: uglify} = uglifyEs;



function build() {
	const srcScriptsPath = join(getDirectory(config.src.scripts), '/');
	const buildBasePath = join(getDirectory(config.build.base), '/');
	const buildLibsPath = join(getDirectory(config.build.libs), '/');
	const buildScriptsPath = join(getDirectory(config.build.scripts), '/');
	const relativeLibsPath = relative(buildBasePath, buildLibsPath);

	return rollup({
		input: globbySync(config.src.scripts),
		plugins: [
			nodeResolve({
				browser: true,
			}),
			commonjs(),
			babel({
				babelHelpers: 'bundled',
			}),
		],
	})
		.then(({write}) => write({
			preserveModules: true,
			dir: buildBasePath,
			preserveModulesRoot: './node_modules',
			entryFileNames(assetInfo) {
				if (assetInfo.facadeModuleId.startsWith(resolve(srcScriptsPath))) {
					return join(
						relative(buildBasePath, buildScriptsPath),
						relative(
							assetInfo.name.startsWith(srcScriptsPath)
								? srcScriptsPath
								: '',
							`${assetInfo.name}.js`,
						),
					);
				}

				return join(relativeLibsPath, '[name].js');
			},
		}));
}



function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.scripts, {
		base: config.build.assets,
	})
		.pipe(plumber())
		.pipe(uglify())
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
	return src(config.dist.scripts)
		.pipe(dest(getDirectory(config.backend.scripts)));
}



build.displayName = 'build:scripts';
dist.displayName = 'dist:scripts';
backend.displayName = 'backend:scripts';

export {
	build,
	dist,
	backend,
};
