import { monitor } from '@financial-times/n-express-monitor';

import SessionApi from '../clients/session-api';
import UserProfileSvc from '../clients/user-profile-svc';

const getUserProfileBySession = async (req, res) => {
	const { meta } = req;
	const { sessionId } = req.params;
	if (sessionId === 'uncovered') {
		throw Error('an uncovered function has thrown an error');
	}
	const { userId } = await SessionApi.verifySession({ sessionId }, meta);
	const userProfile = await UserProfileSvc.getUserProfileById({ userId }, meta);
	res.json(userProfile);
};

export default monitor(getUserProfileBySession);
