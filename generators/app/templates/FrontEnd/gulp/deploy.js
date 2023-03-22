import {createRequire} from 'node:module';
import {exit} from 'node:process';
import {relative, dirname, join} from 'node:path/posix';
import {readFileSync} from 'node:fs';

import {execa} from 'execa';
import inquirer from 'inquirer';
import chalk from 'chalk';
import semver from 'semver';
import {globbySync} from 'globby';
import ftp from 'basic-ftp';
import Conf from 'conf';
import ora from 'ora';

import config from '../config/index.js';
import atlas from '../config/atlas/index.js';
import {formatBytes} from './utilities.js';


// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../package.json');

const spinner = ora();

function fail(text, error, done) {
	if (Array.isArray(text)) {
		text = text
			.map((line, index) => '  '.repeat(index > 0) + line)
			.join('\n');
	}

	spinner.fail(chalk.red(text));

	// Enforce empty line between terminal messages.
	console.info('');

	if (error) {
		console.error(error);
	}

	if (done) {
		done();
		exit(1);
	}
}


async function release(done) {
	const releaseTypes = {
		major: {
			name: 'Major',
			description: 'The first Go Live deploy, a complete project refactor, or with significant breaking changes.',
		},
		minor: {
			name: 'Minor',
			description: 'Includes new or changed features.',
		},
		patch: {
			name: 'Patch',
			description: 'Only bugfixes.',
		},
		prerelease: {
			name: 'Pre-Release',
			description: 'Development release for testing purposes.',
		},
	};
	const preReleaseName = 'beta';

	// Enforce empty line between terminal messages.
	console.info('');

	try {
		spinner.start('Fetching changes...');

		await execa('git', ['fetch']);
	} catch (error) {
		fail('Couldn\'t fetch changes.', error, done);
	}

	try {
		spinner.text = 'Looking for incoming changes...';

		const {stdout: upstreamCommits} = await execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']);

		if (upstreamCommits > 0) {
			fail(
				[
					'There are incoming changes.',
					'Pull them before deploying.',
				],
				false,
				done,
			);
		}
	} catch (error) {
		fail('Couldn\'t look for changes in the remote repository.', error, done);
	}

	try {
		spinner.text = 'Looking for local pending changes...';

		const {stdout: diff} = await execa('git', ['status', '--porcelain', '-uall']);

		if (diff.length > 0) {
			fail(
				[
					'There are pending changes in the repository.',
					'Commit them before deploying.',
				],
				false,
				done,
			);
		}
	} catch (error) {
		fail('Couldn\'t look for local changes in the repository.', error, done);
	}

	try {
		spinner.text = 'Checking current branch...';

		const {stdout: currentBranch} = await execa('git', ['branch', '--show-current']);

		if (['main', 'master'].includes(currentBranch) === false) {
			fail(
				[
					`"${currentBranch}" isn't the default branch.`,
					'Switch branches before deploying.',
				],
				false,
				done,
			);
		}
	} catch (error) {
		fail('Couldn\'t check if it\'s in the default branch.', error, done);
	}

	try {
		spinner.text = 'Running tests...';

		await execa('npm', ['test']);

		spinner.stop();
	} catch (error) {
		fail('Failed testing the project.', error, done);
	}

	await inquirer.prompt([
		{
			type: 'list',
			name: 'release',
			message: 'Type of release:',
			choices: Object.entries(releaseTypes).map(([value, type]) => {
				const newVersion = chalk.dim(`(v${semver.inc(pkg.version, value, value === 'prerelease' ? preReleaseName : null)})`);

				return {
					name: `${type.name} ${newVersion}${chalk.gray.dim(`: ${type.description}`)}`,
					short: `${type.name} ${newVersion}`,
					value,
				};
			}),
			pageSize: Number.POSITIVE_INFINITY,
			default: Object.keys(releaseTypes).indexOf('minor'),
		},
	]).then(async answers => {
		// Enforce empty line between terminal messages.
		console.info('');

		await execa('npm', ['version', answers.release, '--preid', preReleaseName, '--no-git-tag-version']);

		done();
	});
}


function upload(done) {
	const store = new Conf({
		projectName: 'genesis',
	});

	// Enforce empty line between terminal messages.
	console.info('');

	inquirer.prompt([
		{
			name: 'host',
			message: 'FTP Host:',
			default: store.get('ftp.host'),
		},
		{
			name: 'username',
			message: 'FTP Username:',
			default: store.get('ftp.username'),
		},
		{
			type: 'password',
			name: 'password',
			message: 'FTP Password:',
			default: store.get('ftp.password'),
			mask: '*',
		},
	]).then(async answers => {
		// Enforce empty line between terminal messages.
		console.info('');

		for (const answer of ['host', 'username', 'password']) {
			if (answers[answer]) {
				store.set(`ftp.${answer}`, answers[answer]);
			}
		}

		const root = join('/', new URL(atlas.url.development).hostname, 'httpdocs/wwwroot/atlas');
		const files = globbySync(join(config.dist.base, '**'), {
			stats: true,
		});
		const totalSize = files
			.map(({stats}) => stats.size)
			.reduce((previous, current) => previous + current, 0);
		const lastOperation = {
			type: '',
			file: '',
			progress: 0,
		};

		spinner.start('Starting FTP connection...');

		const client = new ftp.Client();

		client.trackProgress(info => {
			let text = 'Doing other operations...';

			if (info.name !== lastOperation.file && lastOperation.type === 'upload') {
				spinner.succeed(relative(root, lastOperation.file));
			}

			if (info.type === 'list') {
				text = 'Preparing directories...';
			} else if (info.type === 'upload') {
				if (Number.isFinite(info.bytes)) {
					lastOperation.progress += info.bytes;
				}

				text = relative(root, info.name);
			}

			const progress = lastOperation.progress / totalSize;
			const totalProgress = 35;
			const bar = [
				'\n\n  ',
				chalk.cyan('█'.repeat(Math.max(0, Math.round(progress * totalProgress)))),
				'░'.repeat(Math.max(0, totalProgress - Math.round(progress * totalProgress))),
				' ',
				chalk.dim(`${formatBytes(lastOperation.progress)} / ${formatBytes(totalSize)}`),
			].join('');

			text += bar;

			if (spinner.isSpinning) {
				spinner.text = text;
			} else {
				spinner.start(text);
			}

			lastOperation.type = info.type;
			lastOperation.file = info.name;
		});

		const {stdout: repositoryRoot} = await execa('git', ['rev-parse', '--show-toplevel']);

		try {
			await client.access({
				host: store.get('ftp.host'),
				user: store.get('ftp.username'),
				password: store.get('ftp.password'),
			});

			await client.ensureDir(root);
			await client.clearWorkingDir();

			let previousDirectory = '';

			for (const file of files) {
				const remoteFile = join(root, relative(config.dist.base, file.path));
				const relativePath = relative(previousDirectory, dirname(remoteFile));

				if (relativePath.length > 0) {
					await client.ensureDir(relativePath); // eslint-disable-line no-await-in-loop
				}

				await client.uploadFrom(file.path, remoteFile); // eslint-disable-line no-await-in-loop

				previousDirectory = dirname(remoteFile);
			}

			// Force showing the last uploaded file, if it wasn't yet.
			if (spinner.isSpinning && lastOperation.type === 'upload') {
				spinner.succeed(relative(root, lastOperation.file));
			}

			// Enforce empty line between terminal messages.
			console.info('');

			spinner.start('Updating repository...');

			// Get the updated version.
			const {version} = JSON.parse(readFileSync('package.json'));

			// Create a new commit, tag it, and push to remote with the tag included.
			await execa('git', ['add', repositoryRoot]);
			await execa('git', ['commit', '--message', `DIST - v${version}`]);
			await execa('git', ['tag', `v${version}`]);

			try {
				await execa('git', ['push', '--follow-tags']);
			} catch (error) {
				fail(
					[
						'Failed to push release commit and it\'s tag to remote repository.',
						chalk.dim('If it was a connection problem, please run the command'),
						chalk.dim('"') + chalk.cyan('git push --follow-tags') + chalk.dim('" once the connection is restored.'),
					],
					error,
				);

				// Enforce empty line between terminal messages.
				console.info('');
			}

			spinner.info('Upload complete!\n');
		} catch (error) {
			fail('Error occured trying to upload files:', error);

			// Revert changes.
			await execa('git', ['restore', repositoryRoot, '-SW']);
			await execa('git', ['clean', repositoryRoot, '-fdq']);
		}

		spinner.start('Closing FTP connection...');

		client.trackProgress();
		client.close();

		spinner.stop();

		done();
	});
}


export {
	release,
	upload,
};
