import { logAction, compose } from '@financial-times/n-auto-logger';
import { metricsAction, tagService } from '@financial-times/n-auto-metrics';
import nError from '@financial-times/n-error';

const SESSION_DATA = {
	'good-session': {
		userId: 'good-session-user-id',
	},
};

const ERROR_MESSAGES = {
	SESSION_ID_NOT_VALID: 'sessionId is not valid',
	SESSION_NOT_FOUND: 'session data not found for given sessionId',
};

/* eslint-disable no-unused-vars */
// meta is used to pass operationName, transactionId, and other prepend meta
// to fetch call to upstream services
const verifySession = async ({ sessionId, meta }) => {
	/* eslint-enable no-unused-vars */

	// customised validation on top standardised ones
	// user error message / error code to help locate the exact place where similar kind of errors could happen
	// e.g. there may be different case of 404 here, thus using error message/code to help locate
	if (!sessionId) {
		throw nError.notFound({ message: ERROR_MESSAGES.SESSION_ID_NOT_VALID });
	}

	try {
		// can use n-api-factory to setup standardised fetch service error handling
		const data = SESSION_DATA[sessionId];

		// in case the error handling from upstream api service is suitable for the app:
		// customised post-fetch validation to complement api error handling
		// e.g. when session-api is returning undefined with status 200 instead of 404 due to certain reason
		// we can add customised error hanlding based on the return data post-fetch
		if (!data) {
			throw nError.notFound({ message: ERROR_MESSAGES.SESSION_NOT_FOUND });
		}

		return data;
	} catch (e) {
		// override error code to passed to downstream service
		// fields in user wouldn't be logged, as these are information useful for downstream
		// e.g. when session-api throws any 4XX error, to downstream service it indicates authentification failure
		if (e.status && e.status >= 400 && e.status < 500) {
			// we can also use e.category === 'FETCH_RESPONSE.ERROR' from n-error
			throw e.extend({ user: { status: 403 } });
		} else {
			throw e;
		}
	}
};

export default compose(
	tagService('session-api'),
	metricsAction,
	logAction,
)({
	verifySession,
});
