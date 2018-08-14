# next-monitor-express
this is an example to demonstrate how [n-express-monitor](https://github.com/Financial-Times/n-express-monitor) can be setup with [n-express](https://github.com/Financial-Times/n-express) and how it could help improve log coverage efficiently with systematic control, and streamline debugging experience

> also applicable to [express](https://github.com/expressjs/express) with a metrics instance setup

- [setup](#setup)
- [concise example](#concise-example)
  * [when success](#when-success)
  * [when failed 1st step](#when-failed-1st-step)
  * [when failed 2nd step](#when-failed-2nd-step)
  
<br> 

## setup
This is a simple api server to provide the endpoint for `getUserProfileBySession` combing two mocked upstream apis, with every function properly logged in operation-action model and recorded in corresponding metrics.

```shell
make install
make .env # or setup .env with mock values
make run
```

## concise example

the following config are used by default in .env to have concise log in dev:
```
AUTO_LOG_LEVEL=concise
LOGGER_MUTE_FIELDS=stack, contentType, result, category, transactionId, requestId
```

### when success
[good request](localhost:5000/good-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById
```

### when failed 1st step
[bad request with random input](localhost:5000/random):
```
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, status=404, message=session data not found for given sessionId
```

### when failed 2nd step
[bad request with bad session](localhost:5000/bad-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, status=404, message=user profile not found for given userId
```
