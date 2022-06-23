import {parse, format} from 'node:path/posix';

import browserSync from 'browser-sync';

import config from '../config/index.js';


function getBrowserSync() {
	return browserSync.has(config.name)
		? browserSync.get(config.name)
		: browserSync.create(config.name);
}


function getDirectory(path) {
	return format(parse(path.slice(0, Math.max(0, path.indexOf('*')))));
}


export {
	getBrowserSync,
	getDirectory,
};
