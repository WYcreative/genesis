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
		'gulp-babel': '',
		'gulp-imagemin': '',
		'gulp-plumber': '',
		'gulp-postcss': '',
		'gulp-pug': '',
		'gulp-rename': '',
		'gulp-rev': '',
		'gulp-rev-rewrite': '',
		'gulp-sass': '',
		'gulp-svgstore': '',
		'gulp-tap': '',
		'gulp-uglify-es': '',
		'imagemin-webp': '',
		inquirer: '',
		jsdom: '',
		ora: '',
		postcss: '',
		'postcss-preset-env': '',
		sass: '',
		semver: '',
		'style-dictionary': '',
		xo: '',
	};

	return addDevDependencies(devDependencies, generator);
}

export default getDevDependencies;
