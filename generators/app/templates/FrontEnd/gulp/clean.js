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
		<%_ if (type === 'website') { -%>
		config.revManifest,
		<%_ } -%>
	]);
}
<% if (type === 'website') { -%>


function backend() {
	return deleteAsync([
		config.backend.fonts,
		config.backend.images,
		...config.backend.styles,
		config.backend.libs,
		config.backend.scripts,
	], {
		force: true,
	});
}
<% } -%>


build.displayName = 'build:clean';
dist.displayName = 'dist:clean';
<% if (type === 'website') { -%>
backend.displayName = 'backend:clean';
<% } -%>

export {
	build,
	dist,
	<%_ if (type === 'website') { -%>
	backend,
	<%_ } -%>
};
