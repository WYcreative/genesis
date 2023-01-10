import gulp from 'gulp';

import * as cleanTasks from './gulp/clean.js';
import * as tokens from './gulp/tokens.js';
import * as styles from './gulp/styles.js';
import * as fonts from './gulp/fonts.js';
import * as symbols from './gulp/symbols.js';
import * as images from './gulp/images.js';
import * as libs from './gulp/libs.js';
import * as scripts from './gulp/scripts.js';
import * as views from './gulp/views.js';
import * as guide from './gulp/guide.js';
import * as browser from './gulp/browser.js';
import * as watch from './gulp/watch.js';
import * as deployTasks from './gulp/deploy.js';


const {series, parallel} = gulp;


export const clean = parallel(
	cleanTasks.build,
	cleanTasks.dist,
);


const build = parallel(
	tokens.build,
	fonts.build,
	symbols.build,
	images.build,
	styles.build,
	libs.build,
	scripts.build,
	views.build,
	guide.build,
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
	images.dist,
	styles.dist,
	libs.dist,
	scripts.dist,
	views.dist,
	guide.dist,
	cleanTasks.backend,
	parallel(
		fonts.backend,
		images.backend,
		styles.backend,
		libs.backend,
		scripts.backend,
		views.backend,
	),
);


export const deploy = series(
	clean,
	deployTasks.release,
	build,
	dist,
	deployTasks.upload,
);
