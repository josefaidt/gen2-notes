---
title: 'Adding Auth Groups'
description: A guide to configuring User Pool Groups.
---

```ts
// amplify/custom/AuthGroup.ts
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export type AuthGroupProps = {
  /**
   * Group name
   */
  name: string
  /**
   * User Pool ID to create with
   */
  userPoolId: string
}

export class AuthGroup extends Construct {
  public group: cognito.CfnUserPoolGroup
  public role: iam.Role

  constructor(scope: Construct, id: string, props: AuthGroupProps) {
    super(scope, id)

    const { name, userPoolId } = props

    const userPoolGroupRole = new iam.Role(scope, `Group${name}Role`, {
      assumedBy: new iam.ServicePrincipal('cognito-idp.amazonaws.com', {
        conditions: {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': userPoolId,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
      }),
    })

    const userPoolGroup = new cognito.CfnUserPoolGroup(scope, `Group${name}`, {
      userPoolId: userPoolId,
      groupName: name,
      roleArn: userPoolGroupRole.roleArn,
    })

    this.group = userPoolGroup
    this.role = userPoolGroupRole
  }
}
```

```ts
// amplify/backend.ts
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { AuthGroup } from './custom/AuthGroup'

const backend = defineBackend({
  auth,
  data,
})

const { userPool } = backend.resources.auth.resources

// define the groups
const GROUPS = {
  ADMINS: 'ADMINS',
} as const

// create a stack to host the Cognito User Pool Groups
const groupsStack = backend.createStack('AuthGroups')
const groups: Record<string, AuthGroup> = {}
for (const group of Object.values(GROUPS)) {
  // create each group using a reference to the Cognito User Pool created by defineAuth
  groups[group] = new AuthGroup(groupsStack, `AuthGroup${group}`, {
    name: group,
    userPoolId: userPool.userPoolId,
  })
}
```
