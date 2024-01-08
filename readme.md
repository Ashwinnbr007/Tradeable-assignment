# trade:able assignment - Backend ( Ashwin Nambiar )

This assignment deals with a backend system used for creating, managing refferals.

## Installation 

To run the application, please follow the steps below

1. Clone the repo.
2. Install dependencies - `npm i`
3. Run the server - `npm run dev`
4. A set of test cases are defined. To run the tests - `npm test`

Additionally, create a .env file in the root of the project. For this application, I have set up a mongoDB cluster. To use the cluster, add the following line to the .env file

`MONGO_URI=mongodb+srv://ashwinnambiar:Sus17251!@trade-able.cytcr0a.mongodb.net/?retryWrites=true&w=majority`

Moreover, to use JWT, you must define a JWT Secret key used for signing and verifying JWT's. Please add the following to the .env file 

`JWT_SECRET=YOUR_SECRET_KEY`

You may replace `YOUR_SECRET_KEY` with a 256 bit sha for better security.

The app is served on `localhost:3000/`

## Api documentation 

### Routes

You can view the entire collection of postman routes [here](https://app.getpostman.com/join-team?invite_code=1a59156cc62442d169351c5c3330c9b7&target_code=98437d2ea263b5133e4cfc222239c79d) 

1. `POST /api/register` : The endpoint takes care of registering a user, the expected request body is 
    `{username:"your_username", password:"your_password"}`

2. `POST /api/register/:refferalId` : The endpoint takes care of registering a user given a refferalId. If the refferalId is invalid or doesn't exist, an error will be thrown. The expected request body is `{username:"your_username", password:"your_password"}`

3. `POST /api/login` : The endpoint takes care of logging in a user. If the user has not been regsitered, an error will be thrown.  The expected request body is `{username:"your_username", password:"your_password"}`

4. `POST /api/refferal/generate` : The endpoint takes care of creating a refferal link for a user. You must pass the jwt as headers to the endpoint else, the endpoint will not be accessible.

5. `POST /api/refferal/verify` : The endpoint takes care of verifying the validity of a refferal link. You must pass the jwt as headers to the endpoint else, the endpoint will not be accessible. The expected request body is `{"refferalLink":"your_refferal_link"}`

6. `POST /api/refferal/expire` : The endpoint takes care of expiring a refferal link. You must pass the jwt as headers to the endpoint else, the endpoint will not be accessible. Additionally, you cannot send any other users refferal link to expire. The expected request body is `{"refferalLink":"your_refferal_link"}`

7. `GET /api/balance` : The endpoint takes care of returning the balance of a user. You must pass the jwt as headers to the endpoint else, the endpoint will not be accessible.

8. `GET /api/admin` : The endpoint takes care of returning the entire details of a user. You must pass the jwt as headers to the endpoint else, the endpoint will not be accessible.

Rate limiting has been setup at the rate of 5 req/min so as to not overload the server with requests to the following endpoints :

1. `POST /api/register`
2. `POST /api/register/:refferalId`
3. `POST /api/refferal/generate` 
4. `POST /api/refferal/verify`

## Commit message strategy

1. `Feature` : Deals with commits which are based on features for the application
2. `Security` : Deals with commits which are based on security aspects for the application
3. `Refactor` : Deals with commits which are based on refactoring of the application
4. `Test` : Any commit that deals with adding/modifying test cases of the application
5. `Documentation` : Deals with commits which are based on Documentation of the application

Additonally, commit message may cascade. For example, if a commit contains both security and features, the commit message may look like `Security feature : your_commit_deatil`
