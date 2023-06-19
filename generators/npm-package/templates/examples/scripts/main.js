<%_
const importName = packageName
	.split('/')
	.at(-1)
	.replace(
		/((?:^|[\s_-]+)\S)([^\s_-]*)/g,
		(_, p1, p2) =>
			p1.trim().replace(/[_-]+/g, '').toUpperCase() + p2.toLowerCase(),
	);
-%>
import <%= importName %> from '../libs/<%= packageName %>/scripts/index.js';
