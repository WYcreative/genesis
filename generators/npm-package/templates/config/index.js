import {createRequire} from 'node:module';
import {join} from 'node:path/posix';



// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../package.json');

<% if (tasks.some(task => ['symbols', 'images', 'styles', 'scripts', 'views'].includes(task))) { -%>
const src = './src';
<% } -%>
const examples = './examples';
const build = './build';
const dist = './dist';

const examplesPath = 'examples';

const config = {
	name: pkg.name,
	libs: './config/libs.js',
	<%_ if ((tasks.includes('symbols'))) { -%>
	data: {
		symbols: {
			colorsToRemove: [
				'black',
				'#000',
				'#000000',
			],
		},
	},
	<%_ } -%>
	<%_ if (tasks.some(task => ['symbols', 'images', 'styles', 'scripts', 'views'].includes(task))) { -%>
	src: {
		<%_ if (tasks.includes('symbols')) { -%>
		symbols: join(src, 'symbols/**/*.svg'),
		<%_ } -%>
		<%_ if (tasks.includes('images')) { -%>
		images: join(src, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		<%_ } -%>
		<%_ if (tasks.includes('styles')) { -%>
		styles: join(src, 'styles/**/*.s@(a|c)ss'),
		<%_ } -%>
		<%_ if (tasks.includes('scripts')) { -%>
		scripts: join(src, 'scripts/**/*.js'),
		<%_ } -%>
		<%_ if (tasks.includes('views')) { -%>
		views: join(src, 'views/**/*.pug'),
		<%_ } -%>
	},
	<%_ } -%>
	examples: {
		<%_ if (tasks.includes('symbols')) { -%>
		symbols: join(examples, 'symbols/**/*.svg'),
		<%_ } -%>
		<%_ if (tasks.includes('images')) { -%>
		images: join(examples, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		<%_ } -%>
		<%_ if (tasks.includes('styles')) { -%>
		styles: join(examples, 'styles/**/*.s@(a|c)ss'),
		<%_ } -%>
		<%_ if (tasks.includes('scripts')) { -%>
		scripts: join(examples, 'scripts/**/*.js'),
		<%_ } -%>
		views: [
			join(examples, 'views/**/*.pug'),
			'!**/_*/**',
			'!**/_*',
		],
	},
	build: {
		base: build,
		<%_ if (tasks.includes('images') || tasks.includes('symbols')) { -%>
		images: join(build, examplesPath, 'assets/images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		<%_ } -%>
		<%_ if (tasks.includes('styles')) { -%>
		styles: join(build, examplesPath, 'assets/styles/**/*.css'),
		<%_ } -%>
		libs: join(build, examplesPath, 'assets/libs/**'),
		<%_ if (tasks.includes('scripts')) { -%>
		scripts: join(build, examplesPath, 'assets/scripts/**/*.js'),
		<%_ } -%>
		views: join(build, examplesPath, '**/*.html'),
	},
	dist: {
		base: dist,
		<%_ if (tasks.includes('images') || tasks.includes('symbols')) { -%>
		images: join(dist, examplesPath, 'assets/images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		<%_ } -%>
		<%_ if (tasks.includes('styles')) { -%>
		styles: join(dist, examplesPath, 'assets/styles/**/*.css'),
		<%_ } -%>
		libs: join(dist, examplesPath, 'assets/libs/**'),
		<%_ if (tasks.includes('scripts')) { -%>
		scripts: join(dist, examplesPath, 'assets/scripts/**/*.js'),
		<%_ } -%>
		views: join(dist, examplesPath, '**/*.html'),
	},
};



export default config;
