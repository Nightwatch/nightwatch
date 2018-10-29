# Nightwatch API

> Realtime API for the Nightwatch Discord bot and web interface. Secure, fast, and developer-friendly!

## Roadmap

### Endpoints

- [x] Authentication
  - [x] Use Discord OAuth to get access token
- [ ] Giveaways
  - [ ] ...TODO
- [ ] Guilds
  - [x] CRUD
  - [x] Guild settings
  - [ ] ...TODO
- [ ] Music
  - [ ] ...TODO
- [ ] Users
  - [x] CRUD
  - [x] User settings
  - [x] User friends
  - [x] User level
  - [x] User balance
  - [ ] ...TODO

### Internal stuff

- [ ] Audit logs
  - [x] Log API requests to database
  - [ ] Configurable audit log settings
- [ ] Security
  - [x] JWT client-server authentication
  - [x] Rate limiting
  - [ ] Route authorization
- [ ] 100% test coverage

-- TODO: (Re)move/clean the stuff below --

## Documentation

Generated documentation can be found here: <https://nightwatch.tk/api/docs/> (Currently Unavailable)

## Prerequisites

- Node.js >= 8.9.0
- PostgreSQL > 9.0
- Redis

## Installation

1. Clone the repo: `git clone https://github.com/Nightwatch/api.git`
2. Configure npm to point to our private registry (only for packages with the @nightwatch scope): `npm config set @nightwatch:registry http://51.15.253.55:4873`
3. Run `npm i`
4. Rename the `ormconfig.example.json` to `ormconfig.json` and modify the database settings.
5. Rename the `api.example.json` to `api.json` and generate a **secure** secret. Use an online password generator if you don't know how.
6. Run `npm start` to start the API on port 3001. You can do `npm run prod` to start the API in production mode on port 5000.

## Usage

In the client application, any request to hit the API will need to include a JWT token generated using the `secret` you made.

> GET requests do not need to include the token. Anyone can make a GET request to the API.

There are two ways you can send the token to the API:

* The token can be included in the request's query string:

```ts
axios.get(`${apiRoute}/users?token=${apiToken}`)
```

* The token can be included in the request's **Authorization** header using the **Bearer** schema.

To view the available endpoints for the API, view the generated documentation. See **Documentation**.

## Realtime Updates

If you use the API (whether it be my production instance, or your local instance) to make a website/dashboard/etc, you can connect to it with Socket.io to get live updates every time a CREATE, POST, or PUT endpoint is hit.

This is perfect for a Discord bot that updates the API, and you want to use the new data immediately in a web interface without having to send another request to the API. The API will just send you the data automatically.

## Security

This API does not store any personal information, but it is designed to be as secure as an API that does.

To authenticate requests and only allow trusted client applications to modify data, the API uses JWT.

The API is designed to prevent various attacks (e.g. DOS, Brute-force, etc.) using rate-limiting and the production API is secured behind HTTPS to protect all the things!

### JWT

The API uses JWTs, or JSON Web Tokens, to authenticate requests. They are used to only allow certain applications to use the API.

HTTPS is used by production API and client applications to prevent XSS and CSRF attacks to hijack the token.

JWTs are generated using a secure `secret` which must only be available to the trusted client applications.

This API uses JWTs to authenticate PUT, POST, and DELETE requests. Anyone can make GET requests to this API and use the JSON. Example: <https://nightwatch.tk/api/users>

### Rate Limiting

Although most access to the API is restricted, everyone has access to make GET requests for any data the API stores.

To prevent brute-force attacks, DOS attacks, and to prevent spam, the API uses IP-based request limits.

The current limit is 150 requests per 15 minutes. Client applications running on the same IP as the API bypass the limits and have unrestricted access to the API.

The API will cache data, and only request new data at intervals. It is recommended that anyone that uses the API caches the data on their end to reduce the number of requests made.

## Data Policy

All data stored by the API is publicly available and accessible under reasonable limit.

Any person has the ability to view the data, but can not modify, create, or delete data from the server.

Data used from the API can be used to create websites, analytics, metrics, etc.

The API itself complies with the Discord TOS; usage of the data must also comply.

Rate limits do apply. See **Security > Rate Limiting** for more information.

If you access data from the production API, at <https://nightwatch.tk/api>, you agree that:

* Your usage of the data will be compliant with the [Discord Developer Terms of Service](https://discordapp.com/developers/docs/legal).
* You will not use the data for commercial purposes.
* The application or service that uses this API's data must be provided free of charge and the implementation of the API and/or API data must be open-source.
* Credit will be given to the Nightwatch API project. The project's GitHub and production API URL must be linked where the API data is used.
  * GitHub: <https://github.com/Nightwatch/api>
  * Production API: <https://nightwatch.tk/api>
* You will not exceed the given request rate limit.
  * It is recommended to cache the data you receive to reduce the number of requests made.
