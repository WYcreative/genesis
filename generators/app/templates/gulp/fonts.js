import gulp from 'gulp';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function build() {
	return src(config.src.fonts)
		.pipe(dest(getDirectory(config.build.fonts)));
}


function dist() {
	return src(config.build.fonts)
		.pipe(dest(getDirectory(config.dist.fonts)));
}


build.displayName = 'fonts:build';
dist.displayName = 'fonts:dist';

export {
	build,
	dist,
};
