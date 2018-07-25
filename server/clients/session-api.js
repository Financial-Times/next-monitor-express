import { logAction, compose } from '@financial-times/n-auto-logger';
import { metricsAction, tagService } from '@financial-times/n-auto-metrics';
import setupService from '@financial-times/n-api-factory';
import nError from '@financial-times/n-error';

const ERROR_MESSAGES = {
	SESSION_ID_NOT_VALID: 'sessionId is not valid',
	SESSION_NOT_FOUND: 'session data not found for given sessionId',
};

/*
	essential arguments needed to setup an API client
 */
const config = {
	API_HOST: 'http://localhost:5000',
	API_KEY: 'dummy-api-key',
};

const sessionApi = setupService(config);

/*
	CONVENTION: action function signature needs to use object ({ ...params, meta }) =>{}
	* meta is used to record operationName, actionName, transactionId, etc. and pass them to logger, metrics
 */
const verifySession = async ({ sessionId, meta }) => {
	/*
		EXTRA ERROR HANDLING: add extra param validation on top of the ones included in n-api-factory
		DEBUG: unique error message/code can help locate the error; stack is useful, but tends to be noisy
	 */
	if (!sessionId) {
		throw nError.notFound({ message: ERROR_MESSAGES.SESSION_ID_NOT_VALID });
	}

	try {
		/*
			use n-api-factory enhanced fetch with default error parsing
		 */
		const data = await sessionApi.get({
			endpoint: `/session/${sessionId}`,
			meta, // data in meta such as transactionId would be used in request header
		});

		/*
			EXTRA ERROR HANDLING: sometimes error handling in the api may not be properly implemented due to historical reasons
			to make some immediate retification we can add extra validation to complement the error handling

			e.g. here the session-api-mock is returning `undefined` with status 200 when session data is not found
			we can add some extra validation post-fetch to throw a 404 error properly

			note: EXTRA ERROR HANDLING may indicate that an improvement to the api is needed if it is something general

			note: nError is not necessary for n-auto-logger to log errors properly
			try just throwing an object here or a native Node error
			remember to update the error override in catch block 😉
		 */
		if (!data) {
			throw nError.notFound({ message: ERROR_MESSAGES.SESSION_NOT_FOUND });
		}

		return data;
	} catch (e) {
		/*
			ERROR OVERRIDE/ENRICHMENT(use try-catch block and override error in catch based on rules):

			the common use case of this is to override error code to passed to downstream service
			e.g. here when session-api throws a 4XX error, it indicates authentification failure to downstream service
			in order to use a common server error-handler to pass information to downstream services correctly we add statusCode for downstream in user object

			CONVENTION: any information specific to downstream services or end users is added to user object in error
			note: user field would be ignored by n-auto-logger by default, as information here doesn't help debugging
		 */
		if (e.status && e.status >= 400 && e.status < 500) {
			// e.status checks it is a valid FETCH_RESPONSE_ERROR
			// we can also use e.category === 'FETCH_RESPONSE_ERROR' from n-error
			throw e.extend({ user: { status: 403 } });
		} else {
			// other errors caught here still need to be thrown so that they can be caught on a higher level
			throw e;
		}
	}
};

// compose: this is equivelant to
// tagService('session-api')(metricsAction(logAction(verifySession)))
export default compose(
	// CONVENTION: tagService needs to be before the other enhancers
	// so that the data can be picked up by the other enhancers
	// under the hood, the enhancer functions would be executed in the following order
	tagService('session-api'),
	metricsAction,
	logAction,
)({
	verifySession,
});
