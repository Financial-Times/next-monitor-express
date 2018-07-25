import { logOperation, toMiddleware } from '@financial-times/n-auto-logger';
import { metricsOperation, compose } from '@financial-times/n-auto-metrics';

import SessionApi from '../clients/session-api';
import UserProfileSvc from '../clients/user-profile-svc';

const getUserProfileBySession = async (meta, req, res) => {
	const { sessionId } = req.params;
	const { userId } = await SessionApi.verifySession({ sessionId }, meta);
	const userProfile = await UserProfileSvc.getUserProfileById({ userId }, meta);
	res.json(userProfile);
};

export default compose(
	toMiddleware,
	logOperation,
	metricsOperation,
)(getUserProfileBySession);
