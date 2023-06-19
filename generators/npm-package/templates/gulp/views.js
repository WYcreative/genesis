import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';

import config from '../config/index.js';

import {getDirectory} from './utilities.js';



const {src, dest} = gulp;



function examples() {
	return src(config.examples.views)
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
		}))
		.pipe(dest(getDirectory(config.build.views)));
}



function dist() {
	return src(config.build.views)
		.pipe(dest(getDirectory(config.dist.views)));
}



examples.displayName = 'examples:views';
dist.displayName = 'dist:views';

export {
	examples,
	dist,
};
