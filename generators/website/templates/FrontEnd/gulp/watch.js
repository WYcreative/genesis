import gulp from 'gulp';

import config from '../config/index.js';

import * as fonts from './fonts.js';
import * as styles from './styles.js';
import * as symbols from './symbols.js';
import * as images from './images.js';
import * as libs from './libs.js';
import * as scripts from './scripts.js';
import * as views from './views.js';
import * as atlas from './atlas.js';
import {reload} from './browser.js';



const {watch, series, parallel} = gulp;



function build(done) {
	watch(config.src.fonts, series(fonts.build, reload));
	watch(config.src.styles, styles.build);
	watch(config.src.symbols, series(symbols.build, reload));
	watch(config.src.images, series(images.build, reload));
	watch(config.examples.images, series(images.examples, reload));
	watch(config.libs, series(libs.build, reload));
	watch(config.src.scripts, series(scripts.build, reload));
	watch(config.src.views[0], series(parallel(views.build), reload));
	watch(config.examples.views[0], series(parallel(views.examples, atlas.build), reload));
	watch([config.atlas, './package.json'], series(atlas.build, reload));

	done();
}



build.displayName = 'build:watch';

export {
	build,
};
