import config from '../config/index.js';

import {getBrowserSync} from './utilities.js';



const browserSyncInstance = getBrowserSync();



function build(done) {
	browserSyncInstance.init({
		server: config.build.base,
		startPath: config.hasBackend ? null : '/atlas',
		ghostMode: false,
	});

	done();
}



function reload(done) {
	browserSyncInstance.reload();

	done();
}



build.displayName = 'build:browser';

export {
	build,
	reload,
};
