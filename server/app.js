import express, { metrics } from '@financial-times/n-express';
import { setupMonitor } from '@financial-times/n-express-monitor';

import getUserProfileBySession from './handlers/get-user-profile-by-session';
import sessionApiMock from './handlers/session-api-mock';
import userProfileSvcMock from './handlers/user-profile-svc-mock';
import errorHandler from './middlewares/error-handler';

const app = express({
	systemCode: 'next-monitor-express',
});

// monitor tooling setup
setupMonitor({ app, metrics });

// router setup
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/session/:sessionId', sessionApiMock);
app.use('/user-profile/:userId', userProfileSvcMock);
app.use('/:sessionId', getUserProfileBySession);

// error handler setup
app.use(errorHandler);

export default app;
