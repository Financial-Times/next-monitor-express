const USER_PROFILE_DATA = {
	'good-session-user-id': {
		id: 'good-session-user-id',
		firstName: 'John',
		lastName: 'Cage',
	},
};

/*
	example of a good api implementation with relatively proper error handling
	to demonstrate the case how default method can be used to setup api client
 */
export default async (req, res) => {
	const { userId } = req.params;
	const data = USER_PROFILE_DATA[userId];

	if (!data) {
		res
			.set('Content-Type', 'text/plain')
			.status(404)
			.send('user profile not found for given userId');
	}

	res.json(data);
};
