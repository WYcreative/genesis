import del from 'del';

import config from '../config/index.js';


function clean() {
	return del([
		config.build.base,
		config.dist.base,
	]);
}


export default clean;
