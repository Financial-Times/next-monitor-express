import { createServer } from 'http';

import app from './app';

const { PORT = 5000 } = process.env;
const SERVER_START = `server started on port ${PORT}`;
const server = createServer(app);
/* eslint-disable no-console */
server.listen(PORT, () => console.log(SERVER_START));
/* eslint-enable no-console */

if (process.env.NODE_ENV === 'development' && module.hot) {
	let currentApp = app;
	module.hot.accept('./app', () => {
		server.removeListener('request', currentApp);
		/* eslint-disable global-require */
		const hotApp = require('./app').default;
		/* eslint-enable global-require */
		server.on('request', hotApp);
		currentApp = hotApp;
	});
}
