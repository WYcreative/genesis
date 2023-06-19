import {createRequire} from 'node:module';
import {join} from 'node:path/posix';


// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../package.json');

const data = './data';
const src = './src';
const build = './build';
const dist = './dist';
const backend = '../<%= backendName %>/<%= backendName %>/wwwroot';

const examplesPath = 'examples';

const config = {
	name: pkg.name,
	atlas: './config/atlas/**/*.js?(on)',
	libs: './config/libs.js',
	data: {
		tokens: join(data, 'tokens.json'),
		fontFallbacks: {
			'*': 'system-ui, -apple-system, sans-serif',
		},
		symbols: {
			colorsToRemove: [
				'black',
				'#000',
				'#000000',
			],
		},
	},
	src: {
		fonts: join(src, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		symbols: join(src, 'symbols/**/*.svg'),
		images: join(src, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
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
		fonts: join(build, examplesPath, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(build, examplesPath, 'assets/images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		styles: [
			join(build, examplesPath, 'assets/styles/**/*.css'),
			join(build, examplesPath, 'assets/styles/rte*.css'),
		],
		libs: join(build, examplesPath, 'assets/libs/**'),
		scripts: join(build, examplesPath, 'assets/scripts/**/*.js'),
		views: join(build, examplesPath, '**/*.html'),
		atlas: {
			assets: join(build, 'assets/**/*.{css,woff?(2),@(o|t)tf,webp,png,jp?(e)g,gif,svg,js}'),
			views: [
				join(build, '**/*.html'),
				join(`!${build}`, examplesPath, '**'),
			],
		},
	},
	dist: {
		base: dist,
		fonts: join(dist, examplesPath, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: [
			join(dist, examplesPath, 'assets/images/**/*.{webp,png,jp?(e)g,gif,svg}'),
			'!**/dummy/**',
		],
		styles: [
			join(dist, examplesPath, 'assets/styles/**/*.css'),
			join(dist, examplesPath, 'assets/styles/rte*.css'),
		],
		libs: join(dist, examplesPath, 'assets/libs/**'),
		scripts: join(dist, examplesPath, 'assets/scripts/**/*.js'),
		views: join(dist, examplesPath, '**/*.html'),
		atlas: {
			assets: join(dist, 'assets/**/*.{css,woff?(2),@(o|t)tf,webp,png,jp?(e)g,gif,svg,js}'),
			views: [
				join(dist, '**/*.html'),
				join(`!${dist}`, examplesPath, '**'),
			],
		},
	},
	revManifest: './rev-manifest.json',
	backend: {
		base: backend,
		fonts: join(backend, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(backend, 'assets/images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		styles: [
			join(backend, 'assets/styles/**/*.css'),
			join(backend, 'css/RteStyle*.css'),
		],
		libs: join(backend, 'assets/libs/**'),
		scripts: join(backend, 'assets/scripts/**/*.js'),
	},
};



export default config;
