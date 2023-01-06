const guide = {
	name: '<%= name %>',
	team: <%- team %>,
	url: {
		design: '<%= design %>',
		prototypeDesktop: '<%= prototypeDesktop %>',
		prototypeMobile: '<%= prototypeMobile %>',
		repository: 'https://dev.azure.com/Bycom/_git/<%= repository %>',
		development: 'https://<%= subdomain %>.dev.byclients.com',
		stage: 'https://<%= subdomain %>.stage.byclients.com',
		production: 'https://<%= homepage %>',
	},
};

export default guide;
