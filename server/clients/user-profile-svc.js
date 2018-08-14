import { monitorService } from '@financial-times/n-express-monitor';
import setupService from '@financial-times/n-api-factory';

const config = {
	API_HOST: 'http://localhost:5000/api',
	API_KEY: 'dummy-api-key',
};

const userProfileSvc = setupService(config);

/*
	SHORTHAND DEFAULT: in case we don't need to add extra error handling,
	the default method from n-api-factory can be used to setup a client method
 */
const getUserProfileById = async ({ userId }, meta) =>
	userProfileSvc.get({
		endpoint: `/user-profile/${userId}`,
		meta,
	});

export default monitorService('user-profile-svc', {
	getUserProfileById,
});
