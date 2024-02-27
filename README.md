# REST Clien vscode extensiom
If you wan to execute the endpoint call from with in vscode, you can open the request.rest file and choose the endpoint you want to call.


# JSON Server starter

Thanks for joining us today and many thanks for your time.

This code challenge is using Typescript, ExpressJS and NodeJS technologies. The basic project is already set up but you're welcome to add more packages if you like.

In /src/app.ts you will find the base code of our API. In /src/**tests**/app.ts you will find a basic unit test for it.

You can use your own tool (Postman, Insomnia etc) to call your API from your local computer once it's alive and running.

This repository is public but not open for merge requests. You should clone it and send back your own repository.

## Setup

This is a boilerplate you can start with. Just clone in your own machine and install the dependencies:

```
$ npm i
```

To run the server:

```
$ npm run dev
```

## Task 1 - Fetch product list

- Write a GET call that will fetch all products available at https://dummyjson.com/products and return them sorted by title (A-Z).
- Output product list must be an array of Product (see type definition).
- Documentation is available at https://dummyjson.com/docs/products

## Task 2 - Login

- Write a POST call that will take username and password from body and will authenticate against the endpoint https://dummyjson.com/auth/login
- If credentials are invalid throw the proper HTTP error.
- As response use type User (see type definition).
- Documentation is available at https://dummyjson.com/docs/auth

## Task 3 - Cart

- Write a POST call that will add a product to the cart.
- For this task please do not use Dummy JSON Cart API. You should create your own implementation.
- It will read the payload using CartPayload as type (see type definition) and add to customer's cart (reside in memory for the code challenge).
- You'll need to write a middleware to decode token and block and unauthorized attempt.
- Token payload has customer's ID and you should use that.
- Avoid product duplication.
