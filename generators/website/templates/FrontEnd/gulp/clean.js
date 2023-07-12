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
		config.backend.fonts,
		config.backend.images,
		...Object.values(config.backend.styles),
		config.backend.libs,
		config.backend.scripts,
	], {
		force: true,
	});
}



build.displayName = 'build:clean';
dist.displayName = 'dist:clean';
backend.displayName = 'backend:clean';

export {
	build,
	dist,
	backend,
};
