# Gateway [![Build Status](https://travis-ci.com/centrifuge/gateway.svg?token=LpuoLEpkXWjp999VGisL&branch=develop)](https://travis-ci.com/centrifuge/gateway)
`Gateway` showcases interacting with a [go-centrifuge](https://github.com/centrifuge/go-centrifuge/) node and other Centrifuge users. It's main purpose is to act as a testing tool and rapid prototyping tool for simple integrations with Centrifuge.


## Getting started

#### Running locally

Gateway required a Centrifuge Node to run. Make sure you configure the node's webhooks to call youre future Gateway instance.
By default this will be `localhost:3001/webhooks`
 
 After the node is up and running open `packaes/server/src/config/ts`
update  the `centrifugeUrl`,`ethNetwork` and the `account` for the admin user to match your node.

```javascript
const config = {
  // URI for centrifuge node
  centrifugeUrl: env.CENTRIFUGE_URL || 'http://127.0.0.1:8082',
  // Port on which the application will run
  applicationPort: env.APPLICATION_PORT || '3001',
  sessionSecret: env.SESSION_SECRET || 'centrifuge',
  //We use replace to create a new database without changing the deployment config
  dbPath: env.DB_PATH ? env.DB_PATH.replace('db', 'db1') : './db',
  // Default admin user that will be created
  admin: {
    name: env.CENTRIFUGE_ADMIN_USER || 'admin',
    email: env.CENTRIFUGE_ADMIN_EMAIL || 'test@test.org',
    password: env.CENTRIFUGE_ADMIN_PASSWORD || 'admin',
    // Centrifuge Identity Address
    account: env.CENTRIFUGE_ADMIN_ACCOUNT || '0xBeaB9D94D23Ff609b92b8C739f4EE13bCe918F8c',
    permissions: [PERMISSIONS.CAN_MANAGE_USERS, PERMISSIONS.CAN_MANAGE_SCHEMAS, PERMISSIONS.CAN_MANAGE_DOCUMENTS],
  },
  inviteOnly: Boolean(env.INVITE_ONLY || true),
  ethNetwork: env.ETH_NETWORK || 'mainnet',
  ethProvider: env.ETH_PROVIDER || 'https://mainnet.infura.io/v3/55b957b5c6be42c49e6d48cbb102bdd5',
};

```

```javascript
npx lerna bootstrap
npm run start
```


 ## Features:
 #### Multi tenancy and managed identities

 Gateway is designed to use a multi tenancy Centrifuge Node. This means that all accounts created with gateway will
 have a on chain Identity where the node wallet is configured as a MANAGEMENT KEY. Gateway users do not 
 need a wallet to interact with ETH and all ETH transaction use the wallet configured on the node
 #### Managing user accounts and permissions
 
 A user can have the following permission
  
 ```javascript
export enum PERMISSIONS {
  // can create and manage user accounts
  CAN_MANAGE_USERS = 'can_manage_users', 
  // can create and manage schemas
  CAN_MANAGE_SCHEMAS = 'can_manage_schemas',
  // can create and manage FlexDocs. When a user has this permission  document schemas 
  // can be assigned to this account and he will be able to create documents
  CAN_MANAGE_DOCUMENTS = 'can_manage_documents', 
  // Can view received FlexDocs. He does need to have schemas assigned
  CAN_VIEW_DOCUMENTS = 'can_view_documents' 
}
``` 


By default a newly created account is in invite mode. This means the invited user should go to
register page, define his password using the account's email.
Gateway will not send email to the invited users
 
 
 #### Creating and managing schemas for flexible documents(FlexDocs)
 
 Gateway can define document schemas that can be assigned to a user with a `CAN_MANAGE_DOCUMENTS` permission enabling  
 that user to create specific documents or do actions with those documents(Ex: Minting an NFT)

You can read and understand how schemas work [here](https://centrifuge.hackmd.io/@rQf339bfSHi_a3rLcEuoaQ/S1Ofvf34B)
 
 
 #### Contact List
 
Stores Centrifuge Identities. All Gateway interaction with a Centrifuge identity(Ex: Sending a document to some else)
will perform a lookup in the contact list. 


## Getting help:
 Head over to our developer documentation at [developer.centrifuge.io](http://developer.centrifuge.io) to learn how to setup a node and interact with it. If you have any questions, feel free to join our [slack channel](https://join.slack.com/t/centrifuge-io/shared_invite/enQtNDYwMzQ5ODA3ODc0LTU4ZjU0NDNkOTNhMmUwNjI2NmQ2MjRiNzA4MGIwYWViNTkxYzljODU2OTk4NzM4MjhlOTNjMDAwNWZkNzY2YWY) 
