> Disclaimer: This is the pre-release version of fx(lens)
> All features should be working
> You might encounter some inconveniences

# fx(lens) 

Interactive environment to view, tweak and develop generative tokens for the fx(hash) platform.

### Scope

- View a generative token
- Inject a random seed
- Tweak fx(params) values
- Display genrative token features


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

