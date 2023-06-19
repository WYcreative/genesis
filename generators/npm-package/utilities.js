/**
 * The list of conditional tasks to be used in the project.
 *
 * @typedef {ConditionalTask[]} ConditionalTasks
 */
const conditionalTasks = [
	{
		name: 'Symbols',
		value: 'symbols',
		dependencies: [
			'images',
		],
	},
	{
		name: 'Images',
		value: 'images',
	},
	{
		name: 'Styles',
		value: 'styles',
		requiredIfNoOther: true,
		dependencies: [
			'views',
		],
	},
	{
		name: 'Scripts',
		value: 'scripts',
		requiredIfNoOther: true,
		dependencies: [
			'views',
		],
	},
	{
		name: 'Views',
		value: 'views',
		requiredIfNoOther: true,
	},
];



export {
	conditionalTasks,
};



/**
 * A conditional task to be used in the project.
 *
 * @typedef {Object} ConditionalTask
 *
 * @property {String} name - The display name of the task.
 * @property {String} value - The identifier of the task.
 * @property {Boolean} [requiredIfNoOther] - Wether the current task is required if no other required task is selected.
 * @property {String[]} [dependencies] - The list of other tasks the current one depends on.
 */
