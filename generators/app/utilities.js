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



function parseList(list) {
	list = list
		.split(/[,\r\n\f]+/)
		.map(item => item.replace(/\s+/g, ' ').trim())
		.filter(item => item.length > 0)
		.sort();

	return [...new Set(list)];
}



export {
	previewAnswer,
	parseList,
};
