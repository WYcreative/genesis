import chalk from 'chalk';

import {members} from '@WYcreative/team';


function getMemberChoices() {
	const groupedMembers = [];

	for (const member of members) {
		const {team} = member;

		if (typeof groupedMembers.find(group => group.name === team) === 'undefined') {
			groupedMembers.push({
				name: team,
				list: [],
			});
		}

		const teamIndex = groupedMembers.findIndex(group => group.name === team);

		groupedMembers[teamIndex].list.push(member);
	}

	const choices = [];

	for (const group of groupedMembers) {
		choices.push({
			type: 'separator',
			line: `\n   ${group.name}\n`,
		});

		for (const member of group.list) {
			choices.push({
				name: `${member.name} ${member.surname} ${chalk.dim(`(${member.email})`)}`,
				value: member.email,
				short: `\n    ${member.name} ${member.surname} ${chalk.dim(`(${member.email})`)}`,
			});
		}
	}

	return choices;
}


function validateDate(answer) {
	return /^2\d{3}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/.test(answer)
		? true
		: `A valid date is required${Number.parseInt(answer.slice(0, 1), 10) < 2 ? ', starting from the year 2000' : ''}!`;
}


function formatDate(answer, _, {isFinal}) {
	const placeholder = ['YYYY', 'MM', 'DD'];
	const placeholderLength = placeholder.join('').length;

	let index = 0;
	let newAnswer = '';

	while (index < answer.length) {
		const character = answer.charAt(index);

		if (['/', '-'].includes(character) === false || newAnswer.length >= placeholderLength) {
			newAnswer += character;
		}

		index++;
	}

	answer = newAnswer;

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
	getMemberChoices,
	validateDate,
	formatDate,
};
