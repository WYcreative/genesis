import {deleteAsync} from 'del';

import config from '../config/index.js';


function clean() {
	return deleteAsync([
		config.build.base,
		config.dist.base,
	]);
}


export default clean;
