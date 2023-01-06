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
			line: `\n   ${chalk.reset.yellow.bold(group.name)}`,
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


function previewAnswer(templates, isFinal) {
	return templates.map(template => {
		let result = `\n  ${isFinal ? ' ' : chalk.yellow.bold('>')} `;

		result += template.map(part => {
			if (part.default) {
				return part.text ? part.text : chalk.dim(part.default);
			}

			return chalk.dim(part.text);
		})
			.join('');

		return isFinal ? chalk.cyan(result) : result;
	})
		.join('');
}


export {
	getMemberChoices,
	previewAnswer,
};
