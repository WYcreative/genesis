import {createRequire} from 'node:module';
import {join} from 'node:path/posix';


// TODO [2022-10-25]: Use import assertions once they become stable, assuming they will be when Node 18 enters LTS mode.
const pkg = createRequire(import.meta.url)('../package.json');

const src = './src';
const build = './build';
const dist = './build';

const examples = 'examples';

const config = {
	name: pkg.name,
	src: {
		styles: join(src, 'styles/**/*.s@(a|c)ss'),
		fonts: join(src, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		symbols: join(src, 'symbols/**/*.svg'),
		images: join(src, 'images/**/*.{png,jp?(e)g,gif,svg}'),
		scripts: join(src, 'scripts/**/*.js'),
		views: [
			join(src, 'views/**/*.pug'),
			'!**/_*/**',
			'!**/_*',
		],
	},
	build: {
		base: build,
		styles: join(build, examples, 'assets/styles/**/*.css'),
		fonts: join(build, examples, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(build, examples, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
		scripts: join(build, examples, 'assets/scripts/**/*.js'),
		libs: join(build, examples, 'assets/libs/**'),
		views: join(build, examples, '**/*.html'),
	},
	dist: {
		base: dist,
		styles: join(dist, examples, 'assets/styles/**/*.css'),
		fonts: join(dist, examples, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(dist, examples, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
		scripts: join(dist, examples, 'assets/scripts/**/*.js'),
		libs: join(dist, examples, 'assets/libs/**'),
		views: join(dist, examples, '**/*.html'),
	},
};


export default config;
