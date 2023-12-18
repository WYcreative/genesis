import gulp from 'gulp';
<% if (tasks.includes('images')) { -%>
import plumber from 'gulp-plumber';
import svgmin from 'gulp-svgmin';
import filter from 'gulp-filter';
import sharp from 'gulp-sharp-responsive';
import rename from 'gulp-rename';
<% } -%>

import config from '../config/index.js';

import {getDirectory} from './utilities.js';



const {src, dest<% if (tasks.includes('images')) { %>, lastRun<% } %>} = gulp;
<% if (tasks.includes('images')) { -%>



function examples() {
	const vector = filter('**/*.svg', {restore: true});
	const raster = filter(['**', '!**/*.svg'], {restore: true});

	return src(config.examples.images, {
		since: lastRun(examples),
	})
		.pipe(plumber())
		.pipe(vector)
		.pipe(svgmin({
			multipass: true,
		}))
		.pipe(vector.restore)
		.pipe(raster)
		.pipe(sharp({
			formats: [
				{
					pngOptions: {
						quality: 90,
					},
				},
				{
					format: 'webp',
				},
			],
		}))
		.pipe(raster.restore)
		.pipe(dest(getDirectory(config.build.images)));
}
<%_ } -%>



function dist() {
	return src(config.build.images)
		.pipe(dest(getDirectory(config.dist.images)));
}



<% if (tasks.includes('images')) { -%>
examples.displayName = 'examples:images';
<% } -%>
dist.displayName = 'dist:images';

export {
	<%_ if (tasks.includes('images')) { -%>
	examples,
	<%_ } -%>
	dist,
};
