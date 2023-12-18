import gulp from 'gulp';

import config from '../config/index.js';



const {src, dest} = gulp;



function build() {
	return src(config.src.copy, {
		nodir: true,
	})
		.pipe(dest(config.build.base));
}



function dist() {
	return src(config.build.copy, {
		nodir: true,
	})
		.pipe(dest(config.dist.base));
}



build.displayName = 'build:copy';
dist.displayName = 'dist:copy';

export {
	build,
	dist,
};
