# Get a room! backend

## Setting up the backend for development

Some environment variables must be set, so the backend is able to use the Google SSO/OAuth 2.0 succesfully and also so backend can access the Google WorkSpace. Instructions are inside the file backend/.env.example

## Database

Database is a mongodb database hosted in google cloud environment.

### Online interface

Database can be looked at from [cloud](https://cloud.mongodb.com/). Login with admin account.

### Connecting with the app

Environment variables `DB_URL`, `DB_USER` and `DB_PASSWORD` need to be present (add them to .env file).

## Api documentation

Api documentation on swaggerhub:

[https://app.swaggerhub.com/apis/Mikkooo/api/0.2.0#/]()
