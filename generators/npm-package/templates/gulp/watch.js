import gulp from 'gulp';

import config from '../config/index.js';

<% if (tasks.includes('symbols')) { -%>
import * as symbols from './symbols.js';
<% } -%>
<% if (tasks.includes('images')) { -%>
import * as images from './images.js';
<% } -%>
<% if (tasks.includes('styles')) { -%>
import * as styles from './styles.js';
<% } -%>
import * as libs from './libs.js';
<% if (tasks.includes('scripts')) { -%>
import * as scripts from './scripts.js';
<% } -%>
import * as views from './views.js';
import {reload} from './browser.js';



const {watch, series} = gulp;



function build(done) {
	watch(config.libs, series(libs.build, reload));
	<%_ if (tasks.includes('scripts')) { -%>
	watch(config.src.scripts, series(scripts.build, reload));
	<%_ } -%>

	done();
}



function examples(done) {
	<%_ if (tasks.includes('symbols')) { -%>
	watch([config.src.symbols, config.examples.symbols], series(symbols.examples, reload));
	<%_ } -%>
	<%_ if (tasks.includes('images')) { -%>
	watch([config.src.images, config.examples.images], series(images.examples, reload));
	<%_ } -%>
	<%_ if (tasks.includes('styles')) { -%>
	watch([config.src.styles, config.examples.styles], styles.examples);
	<%_ } -%>
	<%_ if (tasks.includes('scripts')) { -%>
	watch([config.src.scripts, config.examples.scripts], series(scripts.examples, reload));
	<%_ } -%>
	<%_ if (tasks.includes('views')) { -%>
	watch([config.src.views, config.examples.views[0]], series(views.examples, reload));
	<%_ } else { -%>
	watch(config.examples.views[0], series(views.examples, reload));
	<%_ } -%>

	done();
}


build.displayName = 'build:watch';
examples.displayName = 'examples:watch';

export {
	build,
	examples,
};
