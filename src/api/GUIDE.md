# API Development/Design Guide

## General Architecture Design

The API is designed using REST standards. [Here](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9) is a good article on REST.

The goals of the architecture are:

- Make developing the API as simple as possible.
- Eliminate boilerplate code needed to create an endpoint (compared to Express).
- Separate the endpoints from the database.
- Make implementation simple.
  - Every endpoint should make sense.
  - Everything should be documented.

Under the hood, the API uses Inversion of Control (IoC) and Dependency Injection (DI). [Here's](https://medium.com/@distillerytech/inversion-and-injection-of-dependencies-69c166dead4) a decent article on that.

## Controller Design

All controllers should be pluralized. For example the `User` controller's base route is `/users`.
The only controller that is not pluralized is the `Authentication` controller, because it would not make sense to pluralize it.

In each controller, the CRUD endpoints should be at the very top of the controller.
Controllers that need CRUD endpoints should implement the `BaseController` interface.

Group endpoints that deal with the same resource (e.g. all user level endpoints are grouped together in the `User` controller).

Controllers must be very documented and tested.

## Controller-Service

Every controller has a corresponding service file that handles data interaction/processing.

The controller is unaware of the database and is agnostic as to what database is used.

The service is responsible for querying the database; therefore, it currently must be designed to work specifically with that database.

This design separates the controller from the data access layer, which allows for easier refactors, smaller file sizes, and an overall cleaner look.

The services are injected into the controller via dependency injection, because the controller depends on the service.

## Service Design

Services that need CRUD methods should implement the `BaseService` interface.

Do not prefix methods that fetch data from the database with `get`. Use `find` instead.
We are finding data from the database. There is no guarantee it exists.

Service methods should be well tested. Documentation is nice, but not necessary.

## Endpoint Design

Endpoints should use routes that adhere to the REST specification.

Routes should be all lowercase, with dashes to separate words if needed.

Route parameters should be camelCase.

All endpoints must be documented! At minimum, a JSDoc style comment should be used to describe what the endpoint does.

Use decorators in the method signature to pick out only what the method needs.

For example, to get a user by ID, the endpoint signature would look like:

```ts
@httpGet('/:id')
  async findById (
    @requestParam('id') id: string,
    @response() response: Response
  )
```

In this case, the endpoint only needs the string `id` from the request, not the entire request. The tools used in the API allow us to break down the request to only use what we need.

The benefit of this design is it allows is to create static typed request parameters without defining complex types. This design also allows the parameters to not have to be in a certain order.

Within the method body, don't assume the input received is valid/correct. Before doing anything with the input, the input must be validated.

All endpoints should be asynchronous.

For any endpoints that return data, make sure to only return the data that is needed. Don't return relations/columns unless they are needed.

Always return an appropriate status code. See the next section.

## Response Status Codes

To be consistent, always return the status code that matches one of the following cases:

- Error Responses

  - Validation error: 400
  - Resource already exists: 409
  - Authentication error (e.g. website login): 401
  - Authorization error (e.g. endpoint access control): 403
  - Internal server error: 500

- Success Responses:

  - GET: 200
  - PUT: 200
  - POST:
    - Returning item: 200
    - No return: 204
  - DELETE: 204

  The libraries used should handle the success cases for you.


## Unit Tests

All controllers, endpoints, and service methods must be thoroughly tested to ensure proper outcomes no matter the case.

For every endpoint, include at least one test for each of the following if applicable:

- Request succeeds as expected and the resource requested was found/modified.
- Request succeeds but resource requested was either not found or empty.
- Request failed due to bad input.
- Request failed due to internal server error.

Any pull request to add a endpoint or service method must contain unit tests that test the above cases.