import {createRequire} from 'node:module';
import {join} from 'node:path/posix';


// TODO [2022-10-25]: Use import assertions once they become stable, assuming they will be when Node 18 enters LTS mode.
const pkg = createRequire(import.meta.url)('../package.json');

const src = './src';
const build = './build';
const dist = './dist';
const backend = '../<%= backendName %>/<%= backendName %>/wwwroot';

const examples = 'examples';

const config = {
	name: pkg.name,
	guide: './config/guide/**/*.js',
	libs: './config/libs.js',
	src: {
		fonts: join(src, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		symbols: join(src, 'symbols/**/*.svg'),
		images: join(src, 'images/**/*.{png,jp?(e)g,gif,svg}'),
		styles: join(src, 'styles/**/*.s@(a|c)ss'),
		scripts: join(src, 'scripts/**/*.js'),
		views: [
			join(src, 'views/**/*.pug'),
			'!**/_*/**',
			'!**/_*',
		],
		backend: join(src, 'backend/**/*.pug'),
	},
	build: {
		base: build,
		fonts: join(build, examples, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(build, examples, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
		styles: [
			join(build, examples, 'assets/styles/**/*.css'),
			join(build, examples, 'assets/styles/rte.css'),
		],
		libs: join(build, examples, 'assets/libs/**'),
		scripts: join(build, examples, 'assets/scripts/**/*.js'),
		views: join(build, examples, '**/*.html'),
		guide: {
			assets: join(build, 'assets/**/*.{css,woff?(2),@(o|t)tf,png,jp?(e)g,gif,svg,js}'),
			views: [
				join(build, '**/*.html'),
				join(`!${build}`, 'examples/**'),
			],
		},
	},
	dist: {
		base: dist,
		fonts: join(dist, examples, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: [
			join(dist, examples, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
			'!**/dummy/**',
		],
		styles: [
			join(dist, examples, 'assets/styles/**/*.css'),
			join(dist, examples, 'assets/styles/rte.css'),
		],
		libs: join(dist, examples, 'assets/libs/**'),
		scripts: join(dist, examples, 'assets/scripts/**/*.js'),
		views: join(dist, examples, '**/*.html'),
		guide: {
			assets: join(dist, 'assets/**/*.{css,woff?(2),@(o|t)tf,png,jp?(e)g,gif,svg,js}'),
			views: [
				join(dist, '**/*.html'),
				join(`!${dist}`, 'examples/**'),
			],
		},
	},
	revManifest: './rev-manifest.json',
	backend: {
		base: backend,
		fonts: join(backend, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(backend, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
		styles: [
			join(backend, 'assets/styles/**/*.css'),
			join(backend, 'css/RteStyle.css'),
		],
		libs: join(backend, 'assets/libs/**'),
		scripts: join(backend, 'assets/scripts/**/*.js'),
	},
};


export default config;
