import {dirname, basename, extname} from 'node:path/posix';
import {globbySync} from 'globby';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function build(done) {
	const base = getDirectory(config.src.symbols);
	const files = globbySync(config.src.symbols);

	let directories = [];
	let extensions = [];

	for (const file of files) {
		directories.push(dirname(file));
		extensions.push(extname(file).replace(/^\./, ''));
	}

	directories = [...new Set(directories)];
	extensions = [...new Set(extensions)];

	extensions = extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];

	for (const directory of directories) {
		src(`${directory}/*.${extensions}`)
			.pipe(plumber())
			.pipe(imagemin())
			.pipe(svgstore())
			.pipe(rename(path => {
				if (directory.startsWith(base) && directory.length > base.length) {
					path.dirname = dirname(directory.slice(base.length));
					path.basename = basename(directory);
				}
			}))
			.pipe(dest(getDirectory(config.build.images)));
	}

	done();
}


build.displayName = 'symbols:build';

export {
	build,
};
