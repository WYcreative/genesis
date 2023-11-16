import {dirname, join, relative, sep, basename} from 'node:path/posix';
import {cwd} from 'node:process';

import browserSync from 'browser-sync';
import globParent from 'glob-parent';
import {readPackageUpSync} from 'read-pkg-up';
import {resolve} from 'resolve.exports';
import {globbySync} from 'globby';
import slugify from '@sindresorhus/slugify';

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



function getRelativePath(path, reference) {
	path = relative(dirname(reference), path);

	return (/^\.?\.\//.test(path) ? '' : `.${path.startsWith(sep) ? '' : sep}`) + path;
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



function resolveTildePath(url, filename, language) {
	const {groups: {packagePath}} = url.match(/^~(?<packagePath>(?!@).+?(?=\/|$)|@(?:.+?(?=\/|$)){2})/);

	url = url.slice(url.startsWith('~/') ? 2 : 1);

	const {packageJson} = readPackageUpSync({
		cwd: join(cwd(), 'node_modules', url),
	});

	let newPath = resolve(packageJson, url, {
		conditions: [language],
	});

	if (Array.isArray(newPath)) {
		newPath = newPath[0];
	}

	newPath = relative(
		dirname(filename),
		join(cwd(), 'node_modules', packagePath, newPath),
	);

	return newPath;
}


function getSymbols(symbolsPath) {
	const icons = globbySync('**/*.svg', {
		cwd: getDirectory(symbolsPath),
	});

	const result = [];

	for (const icon of icons) {
		const id = slugify(basename(icon, '.svg'));

		let path = dirname(dirname(icon));
		let name = basename(dirname(icon));

		path = slugify(path === '.' ? '' : path, {
			preserveCharacters: [
				'/',
			],
		});
		name = slugify(name === '.' ? basename(getDirectory(symbolsPath)) : name);

		if (result.some(file => file.path === path && file.name === name) === false) {
			result.push({
				name,
				path,
				file: join(path, `${name}.svg`),
				list: [],
			});
		}

		const fileIndex = result.findIndex(file => file.path === path && file.name === name);

		result[fileIndex].list.push(id);
	}

	return result;
}



export {
	getBrowserSync,
	getDirectory,
	getRelativePath,
	formatBytes,
	resolveTildePath,
	getSymbols,
};
