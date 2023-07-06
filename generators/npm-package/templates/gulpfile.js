import gulp from 'gulp';

import * as cleanTasks from './gulp/clean.js';
<% if (tasks.includes('styles')) { -%>
import * as styles from './gulp/styles.js';
<% } -%>
<% if (tasks.includes('symbols')) { -%>
import * as symbols from './gulp/symbols.js';
<% } -%>
<% if (tasks.includes('images') || tasks.includes('symbols')) { -%>
import * as images from './gulp/images.js';
<% } -%>
import * as libs from './gulp/libs.js';
<% if (tasks.includes('scripts')) { -%>
import * as scripts from './gulp/scripts.js';
<% } -%>
import * as views from './gulp/views.js';
import * as browser from './gulp/browser.js';
import * as watch from './gulp/watch.js';



const {series, parallel} = gulp;



export const clean = parallel(
	cleanTasks.build,
	cleanTasks.dist,
);



const build = parallel(
	<%_ if (tasks.includes('symbols')) { -%>
	symbols.examples,
	<%_ } -%>
	<%_ if (tasks.includes('images')) { -%>
	images.examples,
	<%_ } -%>
	<%_ if (tasks.includes('styles')) { -%>
	styles.examples,
	<%_ } -%>
	libs.build,
	<%_ if (tasks.includes('scripts')) { -%>
	scripts.examples,
	<%_ } -%>
	views.examples,
);



export default series(
	clean,
	build,
	browser.build,
	watch.build,
	watch.examples,
);



export const serve = series(
	browser.build,
	watch.build,
	watch.examples,
);



export const dist = series(
	cleanTasks.dist,
	<%_ if (tasks.includes('images') || tasks.includes('symbols')) { -%>
	images.dist,
	<%_ } -%>
	<%_ if (tasks.includes('styles')) { -%>
	styles.dist,
	<%_ } -%>
	libs.dist,
	<%_ if (tasks.includes('scripts')) { -%>
	scripts.dist,
	<%_ } -%>
	views.dist,
);
