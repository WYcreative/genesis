import {join} from 'node:path/posix';

import gulp from 'gulp';
import rename from 'gulp-rename';

import config from '../config/index.js';
import libs from '../config/libs.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function build(done) {
	for (let [destPath, srcPath] of Object.entries(libs)) {
		if (srcPath.startsWith('node_modules') === false && srcPath.startsWith('./') === false && srcPath.startsWith('/') === false) {
			srcPath = join('node_modules', srcPath);
		}

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


build.displayName = 'libs:build';
dist.displayName = 'libs:dist';

export {
	build,
	dist,
};
