import {conditionalTasks} from './utilities.js';


/**
 * Prompts the user which tasks to use.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String[]}} The list of answers, containing the `tasks` property with an array of task identifiers.
 */
const tasksPrompt = generator =>
	generator.prompt({
		type: 'checkbox',
		name: 'tasks',
		message: 'Tasks:',
		choices: conditionalTasks,
		validate(answer) {
			const requiredIfNoOtherTasks = conditionalTasks.filter(({requiredIfNoOther}) => requiredIfNoOther);

			if (answer.length === 0) {
				return 'At least one task is required!';
			}

			if (requiredIfNoOtherTasks.some(({value}) => answer.includes(value)) === false) {
				return `At least one of the following tasks should be present: ${requiredIfNoOtherTasks.map(({name}) => name).join(', ')}.`;
			}

			return true;
		},
	});



export {
	tasksPrompt,
};
