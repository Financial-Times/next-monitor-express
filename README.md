# next-monitor-express
this is an example to demonstrate how [n-express-monitor](https://github.com/Financial-Times/n-express-monitor) can be setup with [n-express](https://github.com/Financial-Times/n-express) and how it could help improve log coverage efficiently with systematic control, and streamline debugging experience

> also applicable to [express](https://github.com/expressjs/express) with a metrics instance setup


## demo
This is a simple api server to provide the endpoint for `getUserProfileBySession` combing two mocked upstream apis, with every function properly logged in operation-action model and recorded in corresponding metrics.

```shell
make install
make .env # or setup .env with mock values
make run
```

### configure logger
the following config are used by default in .env:
```
AUTO_LOG_LEVEL=concise
LOGGER_MUTE_FIELDS=stack, transactionId, requestId
```

### monitor success
open [localhost:5000/good-session](localhost:5000/good-session), this would trigger a successful request and would be logged as:
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, result=success
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, result=success
```

### monitor failure - failed 1st step
open [localhost:5000/random](localhost:5000/random), this would trigger a request failed on 1st step and would be logged as:
```
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```

### monitor failure - failed 2nd step
open [localhost:5000/bad-session](localhost:5000/bad-session), this would trigger a request failed on 2nd step and would be logged as:
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, result=success
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
```
