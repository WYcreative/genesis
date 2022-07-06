import pkg from '../package.json' assert {type: 'json'};


const src = './src/';
const build = './build/';
const dist = './dist/';


const config = {
	name: pkg.name,
	src: {
		styles: `${src}styles/**/*.s@(a|c)ss`,
		fonts: `${src}fonts/**/*.{woff?(2),@(o|t)tf}`,
		symbols: `${src}symbols/**/*.svg`,
		images: `${src}images/**/*.{png,jp?(e)g,gif,svg}`,
		scripts: `${src}scripts/**/*.js`,
		views: `${src}views/**/*.pug`,
	},
	build: {
		base: build,
		styles: `${build}assets/styles/**/*.css`,
		fonts: `${build}assets/fonts/**/*.{woff?(2),@(o|t)tf}`,
		images: `${build}assets/images/**/*.{png,jp?(e)g,gif,svg}`,
		scripts: `${build}assets/scripts/**/*.js`,
		libs: `${build}assets/libs/**`,
		views: `${build}**/*.html`,
	},
	dist: {
		base: dist,
		styles: `${dist}assets/styles/**/*.css`,
		fonts: `${dist}assets/fonts/**/*.{woff?(2),@(o|t)tf}`,
		images: `${dist}assets/images/**/*.{png,jp?(e)g,gif,svg}`,
		scripts: `${dist}assets/scripts/**/*.js`,
		libs: `${dist}assets/libs/**`,
		views: `${dist}**/*.html`,
	},
};


export default config;
