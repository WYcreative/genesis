import gulp from 'gulp';

import config from '../config/index.js';
<% if (type === 'website') { -%>
import * as fonts from './fonts.js';
<% } -%>
<% if (type === 'website' || tasks.includes('styles')) { -%>
import * as styles from './styles.js';
<% } -%>
<% if (type === 'website' || tasks.some(task => ['symbols', 'images'].includes(task))) { -%>
import * as symbols from './symbols.js';
<% } -%>
<% if (type === 'website' || tasks.includes('images')) { -%>
import * as images from './images.js';
<% } -%>
import * as libs from './libs.js';
<% if (type === 'website' || tasks.includes('scripts')) { -%>
import * as scripts from './scripts.js';
<% } -%>
<% if (type === 'website' || tasks.includes('views')) { -%>
import * as views from './views.js';
<% } -%>
<% if (type === 'website') { -%>
import * as atlas from './atlas.js';
<% } -%>
import {reload} from './browser.js';


const {watch, series<% if (type === 'website') { %>, parallel<% } %>} = gulp;


function build(done) {
	<%_ if (type === 'website') { -%>
	watch(config.src.fonts, series(fonts.build, reload));
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('styles')) { -%>
	watch(config.src.styles, styles.build);
	<%_ } -%>
	<%_ if (type === 'website' || tasks.some(task => ['symbols', 'images'].includes(task))) { -%>
	watch(config.src.symbols, series(symbols.build, reload));
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('images')) { -%>
	watch(config.src.images, series(images.build, reload));
	<%_ } -%>
	watch(config.libs, series(libs.build, reload));
	<%_ if (type === 'website' || tasks.includes('scripts')) { -%>
	watch(config.src.scripts, series(scripts.build, reload));
	<%_ } -%>
	<%_ if (type === 'website' || tasks.includes('views')) { -%>
	watch(config.src.views[0], series(<% if (type === 'website') { %>parallel(<% } %>views.build<% if (type === 'website') { %>, atlas.build)<% } %>, reload));
	<%_ } -%>
	<%_ if (type === 'website') { -%>
	watch([config.atlas, './package.json'], series(atlas.build, reload));
	<%_ } -%>

	done();
}


build.displayName = 'watch';

export {
	build,
};
