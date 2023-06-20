import {createRequire} from 'node:module';

import chalk from 'chalk';
import Generator from 'yeoman-generator';

import {intro, say} from '../_common/utilities.js';



export default class Genesis extends Generator {
	/**
	 * Initiate compatibility checks, inform the user of the start of the generator,
	 * prompt which project type to generate, and run appropriate sub-generator.
	 */
	initializing() {
		intro(this);

		return this.prompt({
			type: 'list',
			name: 'type',
			message: 'Project Type:',
			choices: [
				{
					name: 'Website',
					value: 'website',
				},
				{
					name: 'NPM Package',
					value: 'npm-package',
				},
			],
		})
			.then(async ({type}) => {
				await this.composeWith(
					createRequire(import.meta.url).resolve(`../${type}/index.js`),
				);
			});
	}

	install() {
		say(
			[
				chalk.green('Installing dependencies!'),
				'',
				'Please wait...',
			],
			this,
		);
	}
}
