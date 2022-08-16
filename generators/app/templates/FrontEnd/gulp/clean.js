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
		config.revManifest,
	]);
}


function backend() {
	return deleteAsync([
		config.backend.styles,
		config.backend.scripts,
	], {
		force: true,
	});
}


build.displayName = 'clean:build';
dist.displayName = 'clean:dist';
backend.displayName = 'clean:backend';

export {
	build,
	dist,
	backend,
};
