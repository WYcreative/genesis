import {dirname<% if (tasks.some(task => ['symbols', 'images', 'styles', 'scripts'].includes(task))) { %>, relative, sep<% } %>} from 'node:path/posix';

import browserSync from 'browser-sync';
import globParent from 'glob-parent';

import config from '../config/index.js';



function getBrowserSync() {
	return browserSync.has(config.name)
		? browserSync.get(config.name)
		: browserSync.create(config.name);
}



function getDirectory(path, parentLevel = 1) {
	path = globParent(path);

	while (parentLevel-- > 1) {
		path = dirname(path);
	}

	return path;
}
<% if (tasks.some(task => ['symbols', 'images', 'styles', 'scripts'].includes(task))) { -%>



function getRelativePath(path, reference) {
	path = relative(dirname(reference), path);

	return (/^\.?\.\//.test(path) ? '' : `.${path.startsWith(sep) ? '' : sep}`) + path;
}
<% } -%>



export {
	getBrowserSync,
	getDirectory,
	<%_ if (tasks.some(task => ['symbols', 'images', 'styles', 'scripts'].includes(task))) { -%>
	getRelativePath,
	<%_ } -%>
};
