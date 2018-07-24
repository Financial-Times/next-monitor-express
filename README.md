# next-auto-example
minimal example to demo how [n-auto-logger](https://github.com/Financial-Times/n-auto-logger), [n-auto-metrics](https://github.com/Financial-Times/n-auto-metrics) can be setup with [n-express](https://github.com/Financial-Times/n-express)
> also applicable to [express](https://github.com/expressjs/express) with a metrics instance setup


## demo
This is a simple api server to provide the endpoint for `getUserProfileBySession` combing two mocked upstream apis, with every function properly logged in operation-action model and recorded in corresponding metrics. It uses descriptive error object (most convinent using [n-error](https://github.com/Financial-Times/n-error)) to throw errors to be handled by a common error-handler.

```shell
make install
make .env # or setup .env with mock values
make run
```

### happy case
open your browser, and go to [localhost:5000/good-session](localhost:5000/good-session), this should be logged on the server as the following according to the `AUTO_LOG_LEVEL` setting:
* verbose
```
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60, service=session-api, action=verifySession, sessionId=good-session
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60, service=session-api, action=verifySession, sessionId=good-session, result=success
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60, service=user-profile-svc, action=getUserProfileById, userId=good-session-user-id
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60, service=user-profile-svc, action=getUserProfileById, userId=good-session-user-id, result=success
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60, result=success
```
* concise
```
info:  operation=getUserProfileBySession, transactionId=a3d55744-e860-47ab-862e-ff6c10000e60, result=success
```
* error
```
```

### unhappy case
open your browser, and go to [localhost:5000/random](localhost:5000/random), this should be logged on the server as the following according to the `AUTO_LOG_LEVEL` setting:
* verbose
```
info:  operation=getUserProfileBySession, transactionId=d9d25bf6-3513-42a6-b121-24ed71409f5e
info:  operation=getUserProfileBySession, transactionId=d9d25bf6-3513-42a6-b121-24ed71409f5e, service=session-api, action=verifySession, sessionId=random
warn:  operation=getUserProfileBySession, transactionId=d9d25bf6-3513-42a6-b121-24ed71409f5e, service=session-api, action=verifySession, sessionId=random, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
warn:  operation=getUserProfileBySession, transactionId=d9d25bf6-3513-42a6-b121-24ed71409f5e, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```
* concise
```
warn:  operation=getUserProfileBySession, transactionId=ee1097fd-e79e-48a7-b926-afb43873e48b, service=session-api, action=verifySession, sessionId=random, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
warn:  operation=getUserProfileBySession, transactionId=ee1097fd-e79e-48a7-b926-afb43873e48b, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```
* error
```
warn:  operation=getUserProfileBySession, transactionId=8093a71d-f8ab-4ce5-8c17-ce6a749e215e, result=failure, category=CUSTOM_ERROR, status=404, message=session data not found for given sessionId
```
