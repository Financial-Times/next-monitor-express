import { logAction, compose } from '@financial-times/n-auto-logger';
import { metricsAction, tagService } from '@financial-times/n-auto-metrics';
import nError from '@financial-times/n-error';

const USER_PROFILE_DATA = {
	'good-session-user-id': {
		id: 'good-session-user-id',
		firstName: 'John',
		lastName: 'Cage',
	},
};

/* eslint-disable no-unused-vars */
const getUserProfileById = async ({ userId }, meta) => {
	/* eslint-enable no-unused-vars */

	// customised validation on top standardised ones
	if (!userId) {
		// userId would be logged from function arguments, so it doesn't need to be inserted to the error message
		throw nError.notFound({ message: 'userId is not valid' });
	}
	// can use n-api-factory to setup standardised fetch service error handling
	// if the thrown error doesn't need to be override, then try-catch block is not needed
	const data = USER_PROFILE_DATA[userId];

	if (!data) {
		throw nError.notFound();
	}

	return data;
};

export default compose(
	tagService('user-profile-svc'),
	metricsAction,
	logAction,
)({
	getUserProfileById,
});
