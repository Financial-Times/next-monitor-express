import express, { metrics } from '@financial-times/n-express';
import MaskLogger from '@financial-times/n-mask-logger';
import { setupMonitor } from '@financial-times/n-express-monitor';

import getUserProfileBySession from './controllers/get-user-profile-by-session';
import sessionApiMock from './apis/session-api-mock';
import userProfileSvcMock from './apis/user-profile-svc-mock';
import errorHandler from './middlewares/error-handler';

const app = express({
	systemCode: 'next-monitor-express',
});

// monitor tooling setup
const logger = new MaskLogger(['sessionId']);
setupMonitor({ app, metrics, logger });

// router setup
app.get('/__gtg', (req, res) => res.status(200));
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/api/session/:sessionId', sessionApiMock);
app.use('/api/user-profile/:userId', userProfileSvcMock);
app.use('/:sessionId', getUserProfileBySession);

// error handler setup
app.use(errorHandler);

export default app;
