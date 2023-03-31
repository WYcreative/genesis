import {dirname<% if (type === 'website' || (tasks.some(task => ['symbols', 'images', 'styles', 'scripts'].includes(task)))) { %>, relative, sep<% } %>} from 'node:path/posix';

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
<% if (type === 'website' || (tasks.some(task => ['symbols', 'images', 'styles', 'scripts'].includes(task)))) { -%>


function getRelativePath(path, reference) {
	path = relative(dirname(reference), path);

	return (/^\.?\.\//.test(path) ? '' : `.${path.startsWith(sep) ? '' : sep}`) + path;
}
<% } -%>
<% if (type === 'website') { -%>


function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) {
		return '0 Bytes';
	}

	decimals = Math.max(0, decimals);

	const multiplier = 1024;
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const unitIndex = Math.floor(Math.log(bytes) / Math.log(multiplier));

	return Number.parseFloat((bytes / (multiplier ** unitIndex)).toFixed(decimals)) + ' ' + units[unitIndex];
}
<% } -%>


export {
	getBrowserSync,
	getDirectory,
	<%_ if (type === 'website' || (tasks.some(task => ['symbols', 'images', 'styles', 'scripts'].includes(task)))) { -%>
	getRelativePath,
	<%_ } -%>
	<%_ if (type === 'website') { -%>
	formatBytes,
	<%_ } -%>
};
