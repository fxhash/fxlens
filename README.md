> **⚠️ Disclaimer**: This project is still in development. Some changes will be introduced over the next weeks, so please use this project with caution.

# fx(lens)

Interactive environment to view, tweak and develop generative tokens for the fx(hash) platform.

### Scope

- View a generative token
- Inject a random seed
- Tweak fx(params) values
- Display genrative token features
- Randmomize fx(params) values with individual parameter locking
- Undo/redo stack for fx(params) values
- Schema validation of parameters with hints

### Prerequisites

- node >= 14
- npm >= 6.14.4

### Getting started

- Clone this repository: `npx degit fxhash/params-boilerplate your_project_name`
- Install dependencies and fx(lens): `npm install`

## Start fx(lens) development environment

- `npm start`: Starts a local http server with live reloading enabled.
- Visit `http://localhost:3000/` to view the fx(lens) environment

## Inspect token with fx(lens)

When visiting the local development you won't see anything usefull unless you provide a target fx(lens) is supposed to inspect. You can provide a target using queryParameters like. The target is the url of the token you want to inspect.

If you are developing a token localy and it is running on `http://localhost:3301` you can connect fx(lens) to the token like this:

```
http://localhost:3000/?target=http://localhost:3301
```

## Available fx(params) types

Checkout the [boilerplate documentation](https://github.com/fxhash/params-boilerplate#available-fxparams-types) for more info about the different fx(params) types.

## Randomization

You can explore randomness of the parameters by using the "Randomize params"-Button. Each parameter change is being kept inside the undo/redo stack; Making sure you don't loose any beloved configuration. When you like one of the parameters you can use the "lock"-button to not randomize this parameter and keep it "frozen".

## Validation

The injested parameter configuration is being validated. The UI will give you hints on invalid parameter configuration and what attributes need to be adjusted in order to provide a valid parameter configuration.
