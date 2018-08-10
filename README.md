# next-monitor-express
minimal example to demo how [n-express-monitor](https://github.com/Financial-Times/n-express-monitor) can be setup with [n-express](https://github.com/Financial-Times/n-express)
> also applicable to [express](https://github.com/expressjs/express) with a metrics instance setup


## demo
This is a simple api server to provide the endpoint for `getUserProfileBySession` combing two mocked upstream apis, with every function properly logged in operation-action model and recorded in corresponding metrics. It uses descriptive error object (most convenient using [n-error](https://github.com/Financial-Times/n-error)) to throw errors to be handled by a common error-handler.

```shell
make install
make .env # or setup .env with mock values
make run
```

### happy case
open your browser, and go to [localhost:5000/good-session](localhost:5000/good-session), this should be logged on the server as the following according to the `AUTO_LOG_LEVEL` setting:
* verbose
```
info:  operation=getUserProfileBySession
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=good-session
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=good-session, result=success
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=good-session-user-id
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=good-session-user-id, result=success
info:  operation=getUserProfileBySession, result=success
```
* concise
```
info:  operation=getUserProfileBySession, result=success
```
* error
```
```

### unhappy case - invalid session
open your browser, and go to [localhost:5000/random](localhost:5000/random), this should be logged on the server as the following according to the `AUTO_LOG_LEVEL` setting:
* verbose
```
info:  operation=getUserProfileBySession
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=random
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=random, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
warn:  operation=getUserProfileBySession, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```
* concise
```
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=random, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
warn:  operation=getUserProfileBySession, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```
* error
```
warn:  operation=getUserProfileBySession, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```

### unhappy case - bad session
open your browser, and go to [localhost:5000/bad-session](localhost:5000/bad-session), this should be logged on the server as the following according to the `AUTO_LOG_LEVEL` setting:
* verbose
```
info:  operation=getUserProfileBySession
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=bad-session
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=bad-session, result=success
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=corrupted-date
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=corrupted-date, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
warn:  operation=getUserProfileBySession, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
```
* concise
```
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=corrupted-date, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
warn:  operation=getUserProfileBySession, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
```
* error
```
warn:  operation=getUserProfileBySession, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
```
