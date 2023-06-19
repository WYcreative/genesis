const atlas = {
	name: '<%= name %>',
	url: {
		design: '<%= design %>',
		designLibrary: '<%= designLibrary %>',
		prototypeDesktop: '<%= prototypeDesktop %>',
		prototypeMobile: '<%= prototypeMobile %>',
		repository: 'https://dev.azure.com/Bycom/_git/<%= repository %>',
		development: 'https://<%= subdomain %>.dev.byclients.com',
		stage: 'https://<%= subdomain %>.stage.byclients.com',
		production: 'https://<%= homepage %>',
	},
};

export default atlas;
