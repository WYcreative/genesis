import {addDevDependencies} from '../_common/utilities.js';


/**
 * Gets the list of development dependencies and their latest possible versions.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of development dependencies and their respective versions, following NPM's rules.
 */
async function getDevDependencies(generator) {
	const devDependencies = {
		'@babel/core': '',
		'@babel/preset-env': '',
		'@wycreative/atlas': '',
		'@rollup/plugin-babel': '',
		'@rollup/plugin-commonjs': '',
		'@rollup/plugin-node-resolve': '',
		'basic-ftp': '',
		'browser-sync': '',
		chalk: '',
		conf: '',
		cssnano: '',
		del: '',
		execa: '',
		'glob-parent': '',
		globby: '',
		gulp: '',
		'gulp-imagemin': '',
		'gulp-plumber': '',
		'gulp-postcss': '',
		'gulp-pug': '',
		'gulp-rename': '',
		'gulp-rev': '',
		'gulp-rev-rewrite': '5.0.0',
		'gulp-sass': '',
		'gulp-svgstore': '',
		'gulp-tap': '',
		'gulp-uglify-es': '',
		'imagemin-webp': '',
		inquirer: '',
		jsdom: '',
		'node-sass-json-importer': '',
		ora: '',
		postcss: '',
		'postcss-preset-env': '',
		'pug-walk': '',
		'read-pkg-up': '',
		'resolve.exports': '',
		rollup: '',
		sass: '',
		semver: '',
		'strip-json-comments': '',
		'style-dictionary': '',
		xo: '',
	};

	return addDevDependencies(devDependencies, generator);
}

export default getDevDependencies;
