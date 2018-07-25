const SESSION_DATA = {
	'good-session': {
		userId: 'good-session-user-id',
	},
};

/*
	example of a flakey api implementation without proper error handling
	to demonstrate the case how error handling was strengthened on client side
 */
export default async (req, res) => {
	const { sessionId } = req.params;
	const data = SESSION_DATA[sessionId];
	res.json(data);
};
