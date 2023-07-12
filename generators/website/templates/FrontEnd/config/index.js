import {createRequire} from 'node:module';
import {join} from 'node:path/posix';


// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../package.json');

const data = './data/';
const src = './src/';
const examples = './examples/';
const build = './build/';
const dist = './dist/';
const backend = '../<% if (hasBackend) { %><%= backendName %>/<%= backendName %>/wwwroot/<% } else { %>BackEnd/<% } %>';

const assetsPath = 'assets/';
const examplesPath = 'examples/';
const atlasPath = 'atlas/';

const config = {
	name: pkg.name,
	atlas: './config/atlas/**/*.js?(on)',
	libs: './config/libs.js',
	data: {
		tokens: {
			base: join(data, 'tokens.json'),
		},
		fonts: {
			fallbacks: {
				'*': 'system-ui, -apple-system, sans-serif',
			},
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
		base: src,
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
	examples: {
		base: examples,
		images: join(examples, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		views: [
			join(examples, 'views/**/*.pug'),
			'!**/_*/**',
			'!**/_*',
		],
	},
	build: {
		base: build,
		assets: join(build, assetsPath),
		fonts: join(build, assetsPath, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(build, assetsPath, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		styles: {
			general: join(build, assetsPath, 'styles/**/*.css'),
			rte: join(build, assetsPath, 'styles/rte*.css'),
		},
		libs: join(build, assetsPath, 'libs/**'),
		scripts: join(build, assetsPath, 'scripts/**/*.js'),
		views: join(build, '**/*.html'),
		atlas: join(build, atlasPath, '**'),
	},
	buildExamples: {
		base: join(build, atlasPath, examplesPath),
		assets: join(build, atlasPath, examplesPath, assetsPath),
		images: join(build, atlasPath, examplesPath, assetsPath, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		views: join(build, atlasPath, examplesPath, '**/*.html'),
	},
	dist: {
		base: dist,
		assets: join(dist, assetsPath),
		fonts: join(dist, assetsPath, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(dist, assetsPath, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		styles: {
			general: join(dist, assetsPath, 'styles/**/*.css'),
			rte: join(dist, assetsPath, 'styles/rte*.css'),
		},
		libs: join(dist, assetsPath, 'libs/**'),
		scripts: join(dist, assetsPath, 'scripts/**/*.js'),
		views: join(dist, '**/*.html'),
		atlas: join(dist, atlasPath, '**'),
	},
	distExamples: {
		base: join(dist, atlasPath, examplesPath),
		assets: join(dist, atlasPath, examplesPath, assetsPath),
		images: join(dist, atlasPath, examplesPath, assetsPath, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		views: join(dist, atlasPath, examplesPath, '**/*.html'),
	},
	revManifest: './rev-manifest.json',
	hasBackend: <%= hasBackend %>,
	backend: {
		base: backend,
		fonts: join(backend, assetsPath, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(backend, assetsPath, 'images/**/*.{webp,png,jp?(e)g,gif,svg}'),
		styles: {
			general: join(backend, assetsPath, 'styles/**/*.css'),
			rte: join(backend, 'css/RteStyle*.css'),
		},
		libs: join(backend, assetsPath, 'libs/**'),
		scripts: join(backend, assetsPath, 'scripts/**/*.js'),
	},
};



export default config;
