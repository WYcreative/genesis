import gulp from 'gulp';

import * as cleanTasks from './gulp/clean.js';
<% if (type === 'website') { -%>
import * as tokens from './gulp/tokens.js';
<% } -%>
<% if (type === 'website' || tasks.includes('styles')) { -%>
import * as styles from './gulp/styles.js';
<% } -%>
<% if (type === 'website') { -%>
import * as fonts from './gulp/fonts.js';
<% } -%>
<% if (type === 'website' || tasks.includes('symbols')) { -%>
import * as symbols from './gulp/symbols.js';
<% } -%>
<% if (type === 'website' || tasks.some(task => ['symbols', 'images'].includes(task))) { -%>
import * as images from './gulp/images.js';
<% } -%>
import * as libs from './gulp/libs.js';
<% if (type === 'website' || tasks.includes('scripts')) { -%>
import * as scripts from './gulp/scripts.js';
<% } -%>
<% if (type === 'website' || tasks.includes('views')) { -%>
import * as views from './gulp/views.js';
<% } -%>
<% if (type === 'website') { -%>
import * as atlas from './gulp/atlas.js';
<% } -%>
import * as browser from './gulp/browser.js';
import * as watch from './gulp/watch.js';
<% if (type === 'website') { -%>
import * as deployTasks from './gulp/deploy.js';
<% } -%>


const {series, parallel} = gulp;


export const clean = parallel(
	cleanTasks.build,
	cleanTasks.dist,
);


const build = parallel(
	<%_ if (type === 'website') { -%>
	tokens.build,
	fonts.build,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('symbols')) { -%>
	symbols.build,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('images')) { -%>
	images.build,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('styles')) { -%>
	styles.build,
	<%_ } -%>
	libs.build,
	<%_ if (type === 'website' || tasks.includes('scripts')) { -%>
	scripts.build,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('views')) { -%>
	views.build,
	<%_ } -%>
	<%_ if (type === 'website') { -%>
	atlas.build,
	<%_ } -%>
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


<% if (type === 'website') { -%>
// Tasks revving assets need to run in series to avoid manifest garbling.
// See: https://github.com/sindresorhus/gulp-rev/issues/115#issuecomment-135541782
<% } -%>
export const dist = series(
	cleanTasks.dist,
	<%_ if (type === 'website') { -%>
	fonts.dist,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.some(task => ['symbols', 'images'].includes(task))) { -%>
	images.dist,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('styles')) { -%>
	styles.dist,
	<%_ } -%>
	libs.dist,
	<%_ if (type === 'website' || tasks.includes('scripts')) { -%>
	scripts.dist,
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('views')) { -%>
	views.dist,
	<%_ } -%>
	<%_ if (type === 'website') { -%>
	atlas.dist,
	cleanTasks.backend,
	parallel(
		fonts.backend,
		images.backend,
		styles.backend,
		libs.backend,
		scripts.backend,
		views.backend,
	),
	<%_ } -%>
);
<% if (type === 'website') { -%>


export const deploy = series(
	clean,
	deployTasks.release,
	build,
	dist,
	deployTasks.upload,
);
<% } -%>
