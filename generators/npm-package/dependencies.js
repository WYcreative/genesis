import {addDevDependencies} from '../_common/utilities.js';


/**
 * Gets the list of development dependencies and their latest possible versions.
 *
 * @param {String[]} tasks - The list of tasks to be used in the project.
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of development dependencies and their respective versions, following NPM's rules.
 */
async function getDevDependencies(tasks, generator) {
	const devDependencies = {
		'browser-sync': '',
		del: '',
		'glob-parent': '',
		globby: '',
		gulp: '',
		'gulp-plumber': '',
		'gulp-pug': '',
		'gulp-rename': '',
		np: '',
		'read-pkg-up': '',
		'resolve.exports': '',
		xo: '',
	};

	if (tasks.some(task => ['symbols', 'images'].includes(task))) {
		Object.assign(devDependencies, {
			'gulp-imagemin': '',
		});
	}

	if (tasks.includes('symbols')) {
		Object.assign(devDependencies, {
			'gulp-svgstore': '',
			'gulp-tap': '',
			jsdom: '',
		});
	}

	if (tasks.includes('images')) {
		Object.assign(devDependencies, {
			'imagemin-webp': '',
		});
	}

	if (tasks.includes('styles')) {
		Object.assign(devDependencies, {
			cssnano: '',
			'gulp-postcss': '',
			'gulp-sass': '',
			postcss: '',
			'postcss-preset-env': '',
			sass: '',
		});
	}

	if (tasks.includes('scripts')) {
		Object.assign(devDependencies, {
			'@babel/core': '',
			'@babel/preset-env': '',
			'@rollup/plugin-babel': '',
			'@rollup/plugin-commonjs': '',
			'@rollup/plugin-node-resolve': '',
			'gulp-uglify-es': '',
			rollup: '',
		});
	}

	if (tasks.includes('views')) {
		Object.assign(devDependencies, {
			'pug-walk': '',
		});
	}

	return addDevDependencies(devDependencies, generator);
}

export default getDevDependencies;
