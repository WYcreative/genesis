import gulp from 'gulp';

import * as cleanTasks from './gulp/clean.js';
import * as tokens from './gulp/tokens.js';
import * as styles from './gulp/styles.js';
import * as fonts from './gulp/fonts.js';
import * as data from './gulp/data.js';
import * as symbols from './gulp/symbols.js';
import * as images from './gulp/images.js';
import * as libs from './gulp/libs.js';
import * as scripts from './gulp/scripts.js';
import * as views from './gulp/views.js';
import * as atlas from './gulp/atlas.js';
import * as browser from './gulp/browser.js';
import * as watch from './gulp/watch.js';
import * as deployTasks from './gulp/deploy.js';
import config from './config/index.js';



const {series, parallel} = gulp;



export const clean = parallel(
	cleanTasks.build,
	cleanTasks.dist,
);



const build = parallel(
	tokens.build,
	fonts.build,
	data.build,
	symbols.build,
	images.build,
	images.examples,
	styles.build,
	libs.build,
	scripts.build,
	views.build,
	views.examples,
	atlas.build,
);



export default series(
	clean,
	build,
	browser.build,
	watch.build,
);



export const serve = series(
	browser.build,
	watch.build,
);



// Tasks revving assets need to run in series to avoid manifest garbling.
// See: https://github.com/sindresorhus/gulp-rev/issues/115#issuecomment-135541782
export const dist = series(
	cleanTasks.dist,
	fonts.dist,
	data.dist,
	images.dist,
	images.distExamples,
	styles.dist,
	libs.dist,
	scripts.dist,
	views.dist,
	views.distExamples,
	atlas.dist,
	cleanTasks.backend,
	config.hasBackend
		? parallel(
			fonts.backend,
			data.backend,
			images.backend,
			styles.backend,
			libs.backend,
			scripts.backend,
			views.backend,
		)
		: [],
);



export const deploy = series(
	clean,
	deployTasks.release,
	build,
	dist,
	deployTasks.upload,
);
