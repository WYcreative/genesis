import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import walk from 'pug-walk';

import config from '../config/index.js';

import {getDirectory, resolveTildePath} from './utilities.js';



const {src, dest} = gulp;



function examples() {
	return src(config.examples.views)
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
			plugins: [
				{
					postParse: (ast, {filename}) =>
						walk(ast, (node, replace) => {
							if (['Include', 'RawInclude'].includes(node.type) && node.file.path.startsWith('~')) {
								const path = node.file.path
									.slice(0, /^~(?:@.+\/.+|[^@].+)\/.+/.test(node.file.path) === false ? -4 : undefined);

								const resolvedPath = resolveTildePath(path, filename, 'pug');

								if (resolvedPath) {
									const clone = JSON.parse(JSON.stringify(node));

									clone.file.path = resolvedPath;

									replace(clone);

									return false;
								}
							}

							return true;
						}),
				},
			],
		}))
		.pipe(dest(getDirectory(config.build.views)));
}



function dist() {
	return src(config.build.views)
		.pipe(dest(getDirectory(config.dist.views)));
}



examples.displayName = 'examples:views';
dist.displayName = 'dist:views';

export {
	examples,
	dist,
};
