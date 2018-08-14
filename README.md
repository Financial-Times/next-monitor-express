# next-monitor-express
this is an example to demonstrate how [n-express-monitor](https://github.com/Financial-Times/n-express-monitor) can be setup with [n-express](https://github.com/Financial-Times/n-express) and how it could help improve log coverage efficiently with systematic control, and streamline debugging experience

> also applicable to [express](https://github.com/expressjs/express) with a metrics instance setup

<br>

- [setup](#setup)
- [examples](#examples)
  * [standard mode for debugging](#standard-mode-for-debugging)
  * [concise mode for development](#concise-mode-for-development)
  * [error mode for production](#error-mode-for-production)
  
<br> 

## setup
This is a simple api server to provide the endpoint for `getUserProfileBySession` combing two mocked upstream apis, with every function properly logged in operation-action model and recorded in corresponding metrics.

```shell
make install
make .env # or setup .env with mock values
make run
```


## examples

### standard mode for debugging

the following config are used by default in .env to have concise log in dev:
```
AUTO_LOG_LEVEL=standard
LOGGER_MUTE_FIELDS=stack, contentType, category, transactionId, requestId
```

In standard mode, success/failure of operation and its underlying actions/functions would be logged; Function call input would be logged to help reproducing errors;

[good request](http://localhost:5000/good-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=good-session, result=success
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=good-session-user-id, result=success
info:  operation=getUserProfileBySession, result=success
```

[bad request failed 1st step](http://localhost:5000/random):
```
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=random, result=failure, status=404, message=session data not found for given sessionId
warn:  operation=getUserProfileBySession, result=failure, status=404, message=session data not found for given sessionId
```

[bad request failed 2nd step](http://localhost:5000/bad-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=bad-session, result=success
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=corrupted-data, result=failure, status=404, message=user profile not found for given userId
warn:  operation=getUserProfileBySession, result=failure, status=404, message=user profile not found for given userId
```

[request failed uncovered function](http://localhost:5000/uncovered):
```
error:  operation=getUserProfileBySession, result=failure, category=NODE_SYSTEM_ERROR, name=Error, message=an uncovered function has thrown an error
```


### concise mode for development

the following config are used by default in .env to have concise log in dev:
```
AUTO_LOG_LEVEL=concise
LOGGER_MUTE_FIELDS=stack, contentType, result, category, transactionId, requestId
```

In concise mode, only the success/failure of the actions would be logged, which would be tagged with operation and service they have been threaded; params in function calls wouldn't be logged.

[good request](http://localhost:5000/good-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById
```

[bad request failed 1st step](http://localhost:5000/random):
```
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, status=404, message=session data not found for given sessionId
```

[bad request failed 2nd step](http://localhost:5000/bad-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, status=404, message=user profile not found for given userId
```

[request failed uncovered function](http://localhost:5000/uncovered):
```
```

### error mode for production

the following config are used by default in .env to have concise log in dev:
```
AUTO_LOG_LEVEL=error
LOGGER_MUTE_FIELDS=stack, transactionId
```

In error mode, only the failure of actions would be logged (tagged with related operation and service); Input to the function, category of the error would be logged to help identify the cause of the error; ContentType is recommended to proof and report error parsing mistakes;

Alerts can be setup both based on log or metrics;

[good request](http://localhost:5000/good-session) -> only metrics, no log

[bad request failed 1st step](http://localhost:5000/random):
```
warn:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=random, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```

[bad request failed 2nd step](http://localhost:5000/bad-session):
```
warn:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=corrupted-data, result=failure, category=FETCH_RESPONSE_ERROR, status=404, message=user profile not found for given userId, contentType=text/plain; charset=utf-8
```

[request failed uncovered function](http://localhost:5000/uncovered):
```
```
