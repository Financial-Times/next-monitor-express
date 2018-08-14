# next-monitor-express
this is an example to demonstrate how [n-express-monitor](https://github.com/Financial-Times/n-express-monitor) can be setup with [n-express](https://github.com/Financial-Times/n-express) and how it could help improve log coverage efficiently with systematic control, and streamline debugging experience

> also applicable to [express](https://github.com/expressjs/express) with a metrics instance setup

<br>

- [setup](#setup)
- [operation-action model](#operation-action-model)
- [monitor](#monitor)
  * [error mode](#error-mode)
  * [concise mode](#concise-mode)
  * [standard mode](#standard-mode)
  * [common metrics](#common-metrics)
  
<br> 

## setup

The example api server has an endpoint for `getUserProfileBySession`, calling two mocked upstream apis. Service clients and express controllers are all monitored via [n-express-monitor](https://github.com/Financial-Times/n-express-monitor).

```shell
make install
make .env # or setup .env with values for different modes
make run
```


## operation-action model

Operation-action model is introduced to reflect the general structure of most express codebase, and to constraint unnecessary function layering. This can essentially be translated as `event-step` model as well.

Operations are essestially express middlewares and controllers, and operations can be chained together to perform certain user journey, e.g. `signup = [checkUserProfile] -> [createUserProfile] -> [createPaymentAccount] -> [createSubscription]`. 

Actions are reusable single purpose functions that have predictable input and output, which can be composed to complete an operation.

In the example server here, the operation-action model can be illustrated as the following:

- getUserProfileBySession (operation)
  * uncovered function (uncovered action)
  * verifySession (action)
  * getUserProfileById (action)
  


## monitor


### error mode

**recommended for production**

In error mode, only the failure of operation would be logged (tagged with related action and service); input params of the action function and the error category would be included to help identify the cause and reproduce the error; ContentType is recommended to proof and report error parsing mistakes;

> Alerts can be setup both based on log or metrics.

.env:
```
AUTO_LOG_LEVEL=error
LOGGER_MUTE_FIELDS=stack, transactionId
```

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
error:  operation=getUserProfileBySession, result=failure, category=NODE_SYSTEM_ERROR, name=Error, message=an uncovered function has thrown an error
```

### concise mode

**recommended for development or debugging**

In concise mode, only the success/failure of the operation would be logged, and action leading to the operation would be included in the error log; input params of the action would be omitted; This is best for showing how a user journey is complete via a series of operations.

.env:
```
AUTO_LOG_LEVEL=concise
LOGGER_MUTE_FIELDS=stack, contentType, result, category, transactionId, requestId
```

[good request](http://localhost:5000/good-session):
```
info:  operation=getUserProfileBySession
```

[bad request failed 1st step](http://localhost:5000/random):
```
warn:  requestId=6bab6fe7-e1e5-483e-9279-70da1bec5ce1, operation=getUserProfileBySession, service=session-api, action=verifySession, status=404, message=session data not found for given sessionId
```

[bad request failed 2nd step](http://localhost:5000/bad-session):
```
warn:  requestId=6bab6fe7-e1e5-483e-9279-70da1bec5ce1, operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, status=404, message=user profile not found for given userId
```

[request failed uncovered function](http://localhost:5000/uncovered):
```
error:  requestId=6bab6fe7-e1e5-483e-9279-70da1bec5ce1, operation=getUserProfileBySession, result=failure, category=NODE_SYSTEM_ERROR, name=Error, message=an uncovered function has thrown an error
```

### standard mode

**recommended for development or debugging**

In standard mode, success/failure of operation and its underlying actions/functions would be logged; Function call input would be logged to help reproducing errors;

.env:
```
AUTO_LOG_LEVEL=standard
LOGGER_MUTE_FIELDS=stack, contentType, category, transactionId, requestId
```

[good request](http://localhost:5000/good-session):
```
info:  operation=getUserProfileBySession, service=session-api, action=verifySession, sessionId=good-session, result=success
info:  operation=getUserProfileBySession, service=user-profile-svc, action=getUserProfileById, userId=good-session-user-id, result=success
info:  operation=getUserProfileBySession, result=success
```
metrics:

`operation.getUserProfileBySession.segment.undefined.state.start` + 1
`operation.getUserProfileBySession.segment.undefined.state.success` + 1

`operation.getUserProfileBySession.action.verifySession.state.start` + 1
`operation.getUserProfileBySession.action.verifySession.state.success` + 1
`operation.getUserProfileBySession.action.getUserProfileById.state.start` + 1
`operation.getUserProfileBySession.action.getUserProfileById.state.success` + 1

`service.sessionApi.action.verifySession.state.start` + 1
`service.sessionApi.action.verifySession.state.success` + 1
`service.userProfileSvc.action.getUserProfileById.state.start` + 1
`service.userProfileSvc.action.getUserProfileById.state.success` + 1

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

### common metrics

[good request](http://localhost:5000/good-session):

`operation.getUserProfileBySession.segment.undefined.state.start` + 1
`operation.getUserProfileBySession.segment.undefined.state.success` + 1

`operation.getUserProfileBySession.action.verifySession.state.start` + 1
`operation.getUserProfileBySession.action.verifySession.state.success` + 1
`operation.getUserProfileBySession.action.getUserProfileById.state.start` + 1
`operation.getUserProfileBySession.action.getUserProfileById.state.success` + 1

`service.sessionApi.action.verifySession.state.start` + 1
`service.sessionApi.action.verifySession.state.success` + 1
`service.userProfileSvc.action.getUserProfileById.state.start` + 1
`service.userProfileSvc.action.getUserProfileById.state.success` + 1

[bad request failed 1st step](http://localhost:5000/random):

`operation.getUserProfileBySession.segment.undefined.state.start` + 1
`operation.getUserProfileBySession.segment.undefined.state.failure.category.CUSTOM_ERROR.type.undefined` + 1

`operation.getUserProfileBySession.action.verifySession.state.start` + 1
`operation.getUserProfileBySession.action.verifySession.state.failure.category.CUSTOM_ERROR.status.404` + 1

`service.sessionApi.action.verifySession.state.start` + 1
`service.sessionApi.action.verifySession.state.failure.category.CUSTOM_ERROR.status.404` + 1

[bad request failed 2nd step](http://localhost:5000/bad-session):

`operation.getUserProfileBySession.segment.undefined.state.start` + 1
`operation.getUserProfileBySession.segment.undefined.state.failure.category.FETCH_RESPONSE_ERROR.type.undefined` + 1

`operation.getUserProfileBySession.action.verifySession.state.start` + 1
`operation.getUserProfileBySession.action.verifySession.state.success` + 1
`operation.getUserProfileBySession.action.getUserProfileById.state.start` + 1
`operation.getUserProfileBySession.action.getUserProfileById.state.failure.category.FETCH_RESPONSE_ERROR.status.404` + 1

`service.sessionApi.action.verifySession.state.start` + 1
`service.sessionApi.action.verifySession.state.success` + 1
`service.userProfileSvc.action.getUserProfileById.state.start` + 1
`service.userProfileSvc.action.getUserProfileById.state.failure.category.FETCH_RESPONSE_ERROR.status.404` + 1

[request failed uncovered function](http://localhost:5000/uncovered):

`operation.getUserProfileBySession.segment.undefined.state.start` + 1
`operation.getUserProfileBySession.segment.undefined.state.failure.category.NODE_SYSTEM_ERROR.type.undefined` + 1
