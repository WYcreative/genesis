import pkg from '../package.json' assert {type: 'json'};


const src = './src/';
const build = './build/';
const dist = './dist/';


const config = {
	name: pkg.name,
	src: {
		styles: `${src}styles/**/*.s+(a|c)ss`,
		fonts: `${src}fonts/**/*.woff2`,
		symbols: `${src}symbols/**/*.svg`,
		images: `${src}images/**/*.{png,jpg,jpeg,gif,svg}`,
		scripts: `${src}scripts/**/*.js`,
		views: `${src}views/**/*.pug`,
	},
	build: {
		base: build,
		styles: `${build}styles/**/*.css`,
		fonts: `${build}fonts/**/*.woff2`,
		images: `${build}images/**/*.{png,jpg,jpeg,gif,svg}`,
		scripts: `${build}scripts/**/*.js`,
		libs: `${build}libs/**`,
		views: `${build}**/*.html`,
	},
	dist: {
		base: dist,
		styles: `${dist}styles/**/*.css`,
		fonts: `${dist}fonts/**/*.woff2`,
		images: `${dist}images/**/*.{png,jpg,jpeg,gif,svg}`,
		scripts: `${dist}scripts/**/*.js`,
		libs: `${dist}libs/**`,
		views: `${dist}**/*.html`,
	},
	libs: {
	}
};


export default config;
