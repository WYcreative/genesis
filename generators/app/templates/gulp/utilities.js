import {dirname, parse, format} from 'node:path/posix';

import browserSync from 'browser-sync';

import config from '../config/index.js';


function getBrowserSync() {
	return browserSync.has(config.name)
		? browserSync.get(config.name)
		: browserSync.create(config.name);
}


function getDirectory(path) {
	const end = path.indexOf('*');

	path = end > -1 ? path.slice(0, Math.max(0, end)) : dirname(path);

	return format(parse(path));
}


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


export {
	getBrowserSync,
	getDirectory,
	formatBytes,
};
