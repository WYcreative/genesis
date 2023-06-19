import {execSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {version as nodeVersion} from 'node:process';

import semver from 'semver';



// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../../package.json');
const npmVersion = execSync('npm -v', {
	encoding: 'utf8',
}).trim();


let gulpCliVersion;

try {
	gulpCliVersion = execSync('gulp -v', {
		encoding: 'utf8',
	});

	gulpCliVersion = gulpCliVersion.trim().match(/^.+: (.+)/)?.[1];
} catch {}



/**
 * The list of required engines and related version information.
 *
 * @typedef {{String: Engine}} Engines
 */
const versions = {
	gulpCli: {
		name: 'Gulp CLI',
		version: semver.coerce(gulpCliVersion),
		minimum: pkg.engines['gulp-cli'],
		hasMinimum: semver.satisfies(gulpCliVersion, pkg.engines['gulp-cli']),
	},
	node: {
		name: 'Node',
		version: semver.coerce(nodeVersion),
		minimum: pkg.engines.node,
		hasMinimum: semver.satisfies(nodeVersion, pkg.engines.node),
	},
	npm: {
		name: 'npm',
		version: semver.coerce(npmVersion),
		minimum: pkg.engines.npm,
		hasMinimum: semver.satisfies(npmVersion, pkg.engines.npm),
	},
};



/**
 * Gets the list of required engines and their minimum supported versions.
 *
 * @returns {{String: String}} The list of engines and their respective minimum supported versions.
 */
function getEngineVersions() {
	const result = {};

	for (const [engine, {version, minimum}] of Object.entries(versions)) {
		const minimumVersion = semver.coerce(minimum);

		const projectVersion = semver.gt(version.version, minimumVersion.version)
			? version
			: minimumVersion;

		result[`${engine}Version`] = projectVersion.major + (projectVersion.minor > 0 ? `.${projectVersion.minor}` : '');
	}

	return result;
}



export {
	versions,
	getEngineVersions,
};



/**
 * A required engine for the project.
 *
 * @typedef {Object} Engine
 * @property {String} name - The display name of the engine.
 * @property {String} version - The semantic version of the engine.
 * @property {String} minimum - The minimum supported semantic version of the engine.
 * @property {Boolean} hasMinimum - Wether `version` satisfies the `minimum` version.
 */
