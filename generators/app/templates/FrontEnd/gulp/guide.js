import {createRequire} from 'node:module';

import generateGuide from '@wycreative/design-guide';
import gulp from 'gulp';

import config from '../config/index.js';
import guide from '../config/guide.js';
import {getDirectory} from './utilities.js';

// TODO [2022-10-25]: Use import assertions once they become stable, assuming they will be when Node 18 enters LTS mode.
const pkg = createRequire(import.meta.url)('../package.json');
const {src, dest} = gulp;


function build(done) {
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
