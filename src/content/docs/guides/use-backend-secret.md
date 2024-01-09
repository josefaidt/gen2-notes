---
title: Using BackendSecret
description: Learn how to use BackendSecret types in custom constructs
---

```ts
import { CDKContextKey } from '@aws-amplify/platform-core'
import { type BackendSecret } from '@aws-amplify/plugin-types'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

export type IdentityProviderProps = {
  /**
   * Cognito User Pool to attach to
   */
  userPool: cognito.IUserPool
  /**
   * Cognito User Pool client to use with identity provider
   */
  userPoolClient: cognito.IUserPoolClient
  /**
   * Identity provider OAuth client id
   */
  clientId: BackendSecret
  /**
   * Identity provider OAuth client secret
   */
  clientSecret: BackendSecret
  /**
   * Identity provider OAuth issuer URL
   */
  issuerUrl: BackendSecret
}

export class IdentityProvider extends Construct {
  public provider: cognito.UserPoolIdentityProvider
  private backendIdentifier = {
    name: this.node.tryGetContext(CDKContextKey.BACKEND_NAME),
    namespace: this.node.tryGetContext(CDKContextKey.BACKEND_NAMESPACE),
    type: this.node.tryGetContext(CDKContextKey.DEPLOYMENT_TYPE),
  }

  constructor(scope: Construct, id: string, props: IdentityProviderProps) {
    super(scope, id)

    const provider = new cognito.UserPoolIdentityProviderOidc(
      this,
      'Provider',
      {
        clientId: props.clientId
          .resolve(this, this.backendIdentifier)
          .unsafeUnwrap(),
        clientSecret: props.clientSecret
          .resolve(this, this.backendIdentifier)
          .unsafeUnwrap(),
        userPool: props.userPool,
        issuerUrl: props.issuerUrl
          .resolve(this, this.backendIdentifier)
          .unsafeUnwrap(),
      }
    )

    this.provider = provider
  }
}
```
