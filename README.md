# function

Deploy functions to different FaaS providers with this simple function abstraction made as a [Serverless Component](https://github.com/serverless/components).

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)

&nbsp;


### 1. Install

```shell
$ npm install -g serverless
```

### 2. Create


```console
$ mkdir my-function && cd my-function
```

the directory should look something like this:


```
|- code
  |- handler.js
  |- package.json # optional
|- serverless.yml
|- .env           # your AWS api keys
```

```js
// handler.js
module.exports.hello = async (event, context, cb) => {
  return { hello: 'world' }
}

```

the `.env` files are not required if you have the aws keys set globally and you want to use a single stage, but they should look like this.

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```


### 3. Configure

```yml
name: function

myFunction:
  component: '@serverless/function'
  inputs:
    name: my-function
    description: My Serverless Function
    memory: 128
    timeout: 20
    code: ./code
    handler: handler.hello
    runtime: nodejs8.10
    env:
      TABLE_NAME: my-table
    region: us-east-1
```

### 4. Deploy

```shell
$ serverless
```

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
