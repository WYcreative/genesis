import chalk from 'chalk';


function validateDate(answer) {
	return /^2\d{3}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/.test(answer)
		? true
		: `A valid date is required${Number.parseInt(answer.slice(0, 1), 10) < 2 ? ', starting from the year 2000' : ''}!`;
}


function formatDate(answer, _, {isFinal}) {
	const placeholder = ['YYYY', 'MM', 'DD'];
	const placeholderLength = placeholder.join('').length;

	const formattedAnswer = placeholder.map((group, index, array) => {
		const indexStart = array.slice(0, index).join('').length;
		const indexEnd = indexStart + group.length;
		const groupAnswer = answer.slice(indexStart, indexEnd);
		const groupPlaceholder = group.slice(groupAnswer.length);

		return (isFinal ? chalk.cyan(groupAnswer) : groupAnswer) + chalk.dim(groupPlaceholder);
	});

	return formattedAnswer.join(chalk.dim('/'))
		+ (answer.length > placeholderLength ? chalk.bgRed(answer.slice(placeholderLength)) : '');
}


export {
	validateDate,
	formatDate,
};
