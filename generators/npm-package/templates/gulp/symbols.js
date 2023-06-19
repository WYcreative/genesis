import {dirname, relative, join, basename, extname} from 'node:path/posix';
import {Buffer} from 'node:buffer';

import {globbySync} from 'globby';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import tap from 'gulp-tap';
import {JSDOM} from 'jsdom';
import imagemin, {svgo} from 'gulp-imagemin';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';

import config from '../config/index.js';

import {getDirectory} from './utilities.js';


const {src, dest} = gulp;


function examples(done) {
	const base = getDirectory(config.examples.symbols);
	const files = globbySync(config.examples.symbols);

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
			.pipe(tap(file => {
				const {window: {document: {body: svg}}} = new JSDOM(file.contents.toString());
				const elements = svg.querySelectorAll('[fill], [stroke]');

				// FIXME: Workaround for JSDOM's Element.closest() not working.
				const closest = (element, targets) => {
					do {
						for (const target of targets) {
							if (target === element.tagName) {
								return element;
							}
						}

						element = element.parentElement || element.parentNode;
					} while (element !== null && element.nodeType === 1);

					return null;
				};

				for (const element of elements) {
					const colorsToRemove = new Set(config.data.symbols.colorsToRemove);

					const fill = element.getAttribute('fill')?.toLowerCase();
					const stroke = element.getAttribute('stroke')?.toLowerCase();

					if (fill) {
						if (
							colorsToRemove.has(fill)
							|| (
								fill === 'none'
								&& element.tagName.toLowerCase() === 'svg'
							)
						) {
							element.removeAttribute('fill');
						} else if (closest(element, ['mask', 'clipPath']) === null) {
							console.error(`Found unexpected fill color '${fill}' in '${relative(base, join(directory, file.relative))}'.`);
						}
					}

					if (stroke) {
						if (colorsToRemove.has(stroke)) {
							element.setAttribute('stroke', 'currentColor');
						} else {
							console.error(`Found unexpected stroke color '${stroke}' in '${relative(base, join(directory, file.relative))}'.`);
						}
					}
				}

				file.contents = Buffer.from(svg.innerHTML);
			}))
			.pipe(imagemin([
				svgo({
					plugins: [
						{
							name: 'removeViewBox',
							active: false,
						},
					],
				}),
			]))
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


examples.displayName = 'examples:symbols';

export {
	examples,
};
