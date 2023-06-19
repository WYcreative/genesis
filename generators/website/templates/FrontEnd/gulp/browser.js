import config from '../config/index.js';

import {getBrowserSync} from './utilities.js';



const browserSyncInstance = getBrowserSync();



function build(done) {
	browserSyncInstance.init({
		server: config.build.base,
		ghostMode: false,
		middleware: [
			(request, _, next) => {
				request.url = request.url.replace('atlas/', '');

				next();
			},
		],
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
