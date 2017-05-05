# openid-client-cli

[![npm][npm-image]][npm-url] [![licence][licence-image]][licence-url]

CLI for managing dynamic OpenID Connect client registrations.


**Table of Contents**

<!-- TOC START min:2 link:true update:true max:3 -->
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Commands](#commands)
    - [create](#create)
    - [read](#read)
    - [update](#update)
    - [edit](#edit)
    - [delete](#delete)

<!-- TOC END -->

## Prerequisites

Your OpenID Provider must support:
- [Dynamic Registration][registration] for `create`
and `read`.
- [Registration Management Protocol][management] for `update`
and `delete`.

## Install

Via npm:
```bash
$ npm install -g openid-client-cli
```

Via yarn:
```bash
$ yarn global add openid-client-cli
```

## Commands

### create
```bash
openid-client create --help

Example:
openid-client create https://op.example.com/client/register \
  redirect_uris=[https://rp.example.com/callback,https://rp.example.com/forum/callback] \
  response_types=code \
  grant_types=authorization_code,refresh_token \
  require_auth_time=true \
  client_name='My Client 1.0'
```

### read
```bash
openid-client read --help

Example:
openid-client read --token=<registration_access_token> --uri=<registration_client_uri>
```

### update
```bash
openid-client update --help

Example:
openid-client update --token=<registration_access_token> --uri=<registration_client_uri> \
  client_name=null
```

### edit

Similar to `update` but opens a text editor specified via `$EDITOR` and updates
the client with the result. Make sure to have your editor configured properly
to stay in the foreground (e.g. EDITOR="code --wait" for VS Code).

```bash
openid-client edit --help

Example:
openid-client edit --token=<registration_access_token> --uri=<registration_client_uri>
```

### delete
```bash
openid-client delete --help

Example:
openid-client delete --token=<registration_access_token> --uri=<registration_client_uri>
```

[registration]: https://openid.net/specs/openid-connect-registration-1_0.html
[management]: https://tools.ietf.org/html/rfc7592
[npm-image]: https://img.shields.io/npm/v/openid-client-cli.svg?style=flat-square&maxAge=7200
[npm-url]: https://www.npmjs.com/package/openid-client-cli
[licence-image]: https://img.shields.io/github/license/panva/openid-client-cli.svg?style=flat-square&maxAge=7200
[licence-url]: LICENSE.md
