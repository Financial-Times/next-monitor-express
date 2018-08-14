module.exports = {
	files: {
		allow: [
			'.gitattributes',
			'yarn.lock'
		],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'6bab6fe7-e1e5-483e-9279-70da1bec5ce1' // README.md:99|104|109
		]
	}
};
