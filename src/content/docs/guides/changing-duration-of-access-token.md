---
title: Changing the Duration of Access Tokens
description: A guide to configuring the duration of validity for Cognito User Pool access tokens
---

```ts
// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'

const backend = defineBackend({
  auth,
})

const { cfnResources } = backend.auth.resources

// change in hours (default is 1 hour, max of 1 day)
cfnResources.cfnUserPoolClient.accessTokenValidity = 6
cfnResources.cfnUserPoolClient.idTokenValidity = 6
// change in days (default is 30 days, max of 10 years)
cfnResources.cfnUserPoolClient.refreshTokenValidity = 30
```
