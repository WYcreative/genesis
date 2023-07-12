import {createRequire} from 'node:module';
import {join, relative, resolve} from 'node:path/posix';

import {globbySync} from 'globby';
import {rollup} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import uglifyEs from 'gulp-uglify-es';

import config from '../config/index.js';

import {getDirectory} from './utilities.js';


// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../package.json');
const {src, dest} = gulp;
const {default: uglify} = uglifyEs;



function examples() {
	const srcScriptsPath = join(getDirectory(config.src.scripts), '/');
	const examplesScriptsPath = join(getDirectory(config.examples.scripts), '/');
	const buildBasePath = join(getDirectory(config.build.base), '/');
	const buildLibsPath = join(getDirectory(config.build.libs), '/');
	const buildScriptsPath = join(getDirectory(config.build.scripts), '/');
	const relativeLibsPath = relative(buildBasePath, buildLibsPath);

	return rollup({
		input: globbySync(config.examples.scripts),
		plugins: [
			nodeResolve(),
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
				if (assetInfo.facadeModuleId.startsWith(resolve(examplesScriptsPath))) {
					return join(
						relative(buildBasePath, buildScriptsPath),
						relative(
							assetInfo.name.startsWith(examplesScriptsPath)
								? examplesScriptsPath
								: '',
							`${assetInfo.name}.js`,
						),
					);
				}

				if (assetInfo.facadeModuleId.startsWith(resolve(srcScriptsPath))) {
					return join(
						relativeLibsPath,
						pkg.name,
						relative(srcScriptsPath, `${assetInfo.name}.js`),
					);
				}

				return join(relativeLibsPath, '[name].js');
			},
		}));
}



function dist() {
	return src(config.build.scripts)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(dest(getDirectory(config.dist.scripts)));
}



examples.displayName = 'examples:scripts';
dist.displayName = 'dist:scripts';

export {
	examples,
	dist,
};
