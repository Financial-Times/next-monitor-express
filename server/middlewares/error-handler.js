/* eslint-disable no-unused-vars */
export default function(err, req, res, next) {
	/* eslint-enable no-unused-vars */

	// read the override values
	const { user } = err;
	const message = user && user.message ? user.message : err.message;
	const status = user && user.status ? user.status : err.status;

	// this can be refined according to categories from n-error
	if (status) {
		res.status(status).json({
			status,
			message,
		});
	} else {
		res.status(500).send('internal server error');
	}
}
