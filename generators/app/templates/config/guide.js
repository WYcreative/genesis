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
			start: <%- designStart %>,
			end: <%- designEnd %>,
		},
		development: {
			frontend: {
				start: <%- frontendStart %>,
				end: <%- frontendEnd %>,
			},
			backend: {
				start: <%- backendStart %>,
				end: <%- backendEnd %>,
			},
		},
		stage: {
			start: <%- stageStart %>,
			end: <%- stageEnd %>,
		},
		preproduction: {
			start: <%- preproductionStart %>,
			end: <%- preproductionEnd %>,
		},
		production: {
			start: <%- productionStart %>,
			end: <%- productionEnd %>,
		},
	},
	tokens: {

	},
	components: [

	],
	modules: [

	],
	templates: [

	],
};

export default guide;
