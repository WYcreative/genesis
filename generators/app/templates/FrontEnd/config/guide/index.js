const guide = {
	name: '<%= name %>',
	team: <%- team %>,
	url: {
		design: '<%= design %>',
		prototype: {
			desktop: '<%= prototypeDesktop %>',
			mobile: '<%= prototypeMobile %>',
		},
		repository: 'https://dev.azure.com/Bycom/_git/<%= repository %>',
		development: 'https://<%= subdomain %>.dev.byclients.com',
		stage: 'https://<%= subdomain %>.stage.byclients.com',
		production: 'https://<%= homepage %>',
	},
	timeline: {
		design: {
			start: '<%= designStart %>',
			end: '<%= designEnd %>',
		},
		frontend: {
			start: '<%= frontendStart %>',
			end: '<%= frontendEnd %>',
		},
		backend: {
			start: '<%= backendStart %>',
			end: '<%= backendEnd %>',
		},
		stage: {
			start: '<%= stageStart %>',
			end: '<%= stageEnd %>',
		},
		preproduction: {
			start: '<%= preproductionStart %>',
			end: '<%= preproductionEnd %>',
		},
		production: {
			start: '<%= productionStart %>',
			end: '<%= productionEnd %>',
		},
	},
};

export default guide;
