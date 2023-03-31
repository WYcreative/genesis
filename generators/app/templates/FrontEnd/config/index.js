import {createRequire} from 'node:module';
import {join} from 'node:path/posix';


// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../package.json');

<% if (type === 'website') { -%>
const data = './data';
<% } -%>
const src = './src';
const build = './build';
const dist = './dist';
<% if (type === 'website') { -%>
const backend = '../<%= backendName %>/<%= backendName %>/wwwroot';
<% } -%>

const examples = 'examples';

const config = {
	name: pkg.name,
	<%_ if (type === 'website') { -%>
	atlas: './config/atlas/**/*.js?(on)',
	<%_ } -%>
	libs: './config/libs.js',
	<%_ if (type === 'website' || (tasks.includes('symbols'))) { -%>
	data: {
		<%_ if (type === 'website') { -%>
		tokens: join(data, 'tokens.json'),
		fontFallbacks: {
			'*': 'system-ui, -apple-system, sans-serif',
		},
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('symbols')) { -%>
		symbols: {
			colorsToRemove: [
				'black',
				'#000',
				'#000000',
			],
		},
		<%_ } -%>
	},
	<%_ } -%>
	src: {
		<%_ if (type === 'website') { -%>
		fonts: join(src, 'fonts/**/*.{woff?(2),@(o|t)tf}'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('symbols')) { -%>
		symbols: join(src, 'symbols/**/*.svg'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('images')) { -%>
		images: join(src, 'images/**/*.{png,jp?(e)g,gif,svg}'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('styles')) { -%>
		styles: join(src, 'styles/**/*.s@(a|c)ss'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('scripts')) { -%>
		scripts: join(src, 'scripts/**/*.js'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('views')) { -%>
		views: [
			join(src, 'views/**/*.pug'),
			'!**/_*/**',
			'!**/_*',
		],
		<%_ } -%>
		<%_ if (type === 'website') { -%>
		backend: join(src, 'backend/**/*.pug'),
		<%_ } -%>
	},
	build: {
		base: build,
		<%_ if (type === 'website') { -%>
		fonts: join(build, examples, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.some(task => ['symbols', 'images'].includes(task))) { -%>
		images: join(build, examples, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('styles')) { -%>
		styles: [
			join(build, examples, 'assets/styles/**/*.css'),
			<%_ if (type === 'website') { -%>
			join(build, examples, 'assets/styles/rte*.css'),
			<%_ } -%>
		],
		<%_ } -%>
		libs: join(build, examples, 'assets/libs/**'),
		<%_ if (type === 'website' || tasks.includes('scripts')) { -%>
		scripts: join(build, examples, 'assets/scripts/**/*.js'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('views')) { -%>
		views: join(build, examples, '**/*.html'),
		<%_ } -%>
		<%_ if (type === 'website') { -%>
		atlas: {
			assets: join(build, 'assets/**/*.{css,woff?(2),@(o|t)tf,png,jp?(e)g,gif,svg,js}'),
			views: [
				join(build, '**/*.html'),
				join(`!${build}`, 'examples/**'),
			],
		},
		<%_ } -%>
	},
	dist: {
		base: dist,
		<%_ if (type === 'website') { -%>
		fonts: join(dist, examples, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.some(task => ['symbols', 'images'].includes(task))) { -%>
		images: [
			join(dist, examples, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
			'!**/dummy/**',
		],
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('styles')) { -%>
		styles: [
			join(dist, examples, 'assets/styles/**/*.css'),
			join(dist, examples, 'assets/styles/rte*.css'),
		],
		<%_ } -%>
		libs: join(dist, examples, 'assets/libs/**'),
		<%_ if (type === 'website' || tasks.includes('scripts')) { -%>
		scripts: join(dist, examples, 'assets/scripts/**/*.js'),
		<%_ } -%>
		<%_ if (type === 'website' || tasks.includes('views')) { -%>
		views: join(dist, examples, '**/*.html'),
		<%_ } -%>
		<%_ if (type === 'website') { -%>
		atlas: {
			assets: join(dist, 'assets/**/*.{css,woff?(2),@(o|t)tf,png,jp?(e)g,gif,svg,js}'),
			views: [
				join(dist, '**/*.html'),
				join(`!${dist}`, 'examples/**'),
			],
		},
		<%_ } -%>
	},
	<%_ if (type === 'website') { -%>
	revManifest: './rev-manifest.json',
	backend: {
		base: backend,
		fonts: join(backend, 'assets/fonts/**/*.{woff?(2),@(o|t)tf}'),
		images: join(backend, 'assets/images/**/*.{png,jp?(e)g,gif,svg}'),
		styles: [
			join(backend, 'assets/styles/**/*.css'),
			join(backend, 'css/RteStyle*.css'),
		],
		libs: join(backend, 'assets/libs/**'),
		scripts: join(backend, 'assets/scripts/**/*.js'),
	},
	<%_ } -%>
};


export default config;
