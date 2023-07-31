import {join, relative} from 'node:path/posix';

import config from '../config/index.js';

import {getBrowserSync, getDirectory} from './utilities.js';



const browserSyncInstance = getBrowserSync();



function build(done) {
	const atlasPath = join('/', relative(config.build.base, getDirectory(config.build.atlas)));
	const assetsPath = join('/', relative(config.build.base, getDirectory(config.build.assets)));

	browserSyncInstance.init({
		server: config.build.base,
		startPath: config.hasBackend ? undefined : atlasPath,
		ghostMode: false,
		middleware: [
			(request, _, next) => {
				if (
					config.hasBackend
					&& request.url.startsWith(atlasPath) === false
					&& request.url.startsWith(assetsPath) === false
				) {
					request.url = join(atlasPath, request.url);
				}

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
