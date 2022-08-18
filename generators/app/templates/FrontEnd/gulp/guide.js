import {join} from 'node:path/posix';
import {readFileSync} from 'node:fs';

import generateGuide from '@wycreative/design-guide';
import gulp from 'gulp';

import config from '../config/index.js';
import {getDirectory} from './utilities.js';

const {src, dest} = gulp;


async function build(done) {
	const pkg = JSON.parse(readFileSync('./package.json'));
	const {default: guide} = await import(`${join('..', config.guide)}?t=${Date.now()}`);

	generateGuide({
		package: pkg,
		guide,
		config,
		destination: config.build.base,
	});

	done();
}


function dist(done) {
	src(config.build.guide.views)
		.pipe(dest(getDirectory(config.dist.guide.views[0])));

	src(config.build.guide.assets)
		.pipe(dest(getDirectory(config.dist.guide.assets)));

	done();
}


build.displayName = 'guide:build';
dist.displayName = 'guide:dist';

export {
	build,
	dist,
};
