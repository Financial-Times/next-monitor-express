import express, { metrics } from '@financial-times/n-express';
import { initAutoMetrics } from '@financial-times/n-auto-metrics';
import { addTransactionId } from '@financial-times/n-auto-logger';

import getUserProfileBySession from './handlers/get-user-profile-by-session';
import sessionApiMock from './handlers/session-api-mock';
import errorHandler from './middlewares/error-handler';

const app = express({
	systemCode: 'next-auto-example',
});

// middlewares setup
initAutoMetrics(metrics);

app.use(addTransactionId);

// router setup
app.use('/session/:sessionId', sessionApiMock);
app.use('/:sessionId', getUserProfileBySession);

// error handler setup
app.use(errorHandler);

export default app;
