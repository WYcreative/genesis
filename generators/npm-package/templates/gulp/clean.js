import {deleteAsync} from 'del';

import config from '../config/index.js';



function build() {
	return deleteAsync([
		config.build.base,
	]);
}



function dist() {
	return deleteAsync([
		config.dist.base,
	]);
}



build.displayName = 'build:clean';
dist.displayName = 'dist:clean';

export {
	build,
	dist,
};
