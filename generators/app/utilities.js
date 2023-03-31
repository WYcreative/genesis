import chalk from 'chalk';



function previewAnswer(templates, isFinal) {
	return templates.map(template => {
		let result = `\n  ${isFinal ? ' ' : chalk.yellow.bold('>')} `;

		result += template.map(part => {
			if (part.default) {
				return part.text ?? chalk.dim(part.default);
			}

			return chalk.dim(part.text);
		})
			.join('');

		return isFinal ? chalk.cyan(result) : result;
	})
		.join('');
}


export {
	previewAnswer,
};
